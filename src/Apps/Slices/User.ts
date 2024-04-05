import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit"

export const StatusPossibility = {
    Logged_Out: "خدافظ",
    Logged_In: "درحال انتقال به صفحه اصلی",
    Getting_Users: "درحال ارسال اطلاعات به سرور",
    Users_Saved: "اطلاعات با موفقیت به سرور ارسال شد",
    NotFound: "هیچ کاربری با این مشخصات یافت نشد",
    Email_Already_Used: "درحال حاضر یک حساب کاربری با ایمیل مورد نظر شما درسایت موجود میباشد (🙄)",
    CheckingData: "درحال بررسی اطلاعات",
    Idle: "بیکار",
} as const

const initialState: T_UserIntialState = {
    status: {
        value: "Idle",
        message: StatusPossibility["Idle"],
    },
    user: {},
    users: [],
} as T_UserIntialState

export const GetUsers = createAsyncThunk("User/GetUsers", async () => {
    // something like this but you have to replace it with firebase function package
    return await fetch("https://dashboard-a5184-default-rtdb.firebaseio.com/Users.json", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(result => result.json())
        .then(result => result)
})

export const RegisterReducer = createAsyncThunk("User/Register", async (data: I_UserRegisterParameters) => {
    return await fetch("https://dashboard-a5184-default-rtdb.firebaseio.com/Users.json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...data,
            ImgSrc: "",
        } as T_UserInDB),
    })
        .then(res => res.json())
        .then(res => res)
})

const userSlice = createSlice({
    name: "User",
    initialState,
    reducers: {
        LogOut(state: T_UserIntialState) {
            state.status = {
                value: "Logged_Out",
                message: StatusPossibility["Logged_Out"],
            }
            state.user = {}
        },
        LogIn(state, action: { payload: I_UserLoginParameter }) {
            const Users = current(state.users)
            const { Email, Password } = action.payload
            state.status = {
                value: "CheckingData",
                message: StatusPossibility["CheckingData"],
            }
            const User = Users.filter(user => {
                if (user[1].Email.toLocaleLowerCase() === Email.toLocaleLowerCase() && user[1].Password === Password) return true
            }) as T_Users

            if (User.length !== 0) {
                const objUser: I_UserInLocal = {
                    Email: User[0][1].Email,
                    Id: User[0][0],
                    ImgSrc: User[0][1].ImgSrc,
                    Name: User[0][1].Name,
                    Password: User[0][1].Password,
                }

                state.user = objUser
                state.status = {
                    value: "Logged_In",
                    message: StatusPossibility["Logged_In"],
                }
            } else {
                state.status = {
                    value: "NotFound",
                    message: StatusPossibility["NotFound"],
                }
            }
        },
        ChangeStatus(state, action: { payload: T_UserIntialState["status"]["value"] }) {
            state.status = {
                value: action.payload,
                message: StatusPossibility[action.payload],
            } as T_UserIntialState["status"]
        },
    },
    extraReducers: builder => {
        builder
            .addCase(GetUsers.pending, (state, action) => {
                state.status = {
                    value: "Getting_Users",
                    message: StatusPossibility["Getting_Users"],
                }
            })
            .addCase(GetUsers.fulfilled, (state, action) => {
                if (action.payload) {
                    const Users = Object.entries(action.payload) as T_Users
                    state.users = Users
                    state.status = {
                        value: "Users_Saved",
                        message: StatusPossibility["Users_Saved"],
                    }
                } else {
                    state.status = {
                        value: "NotFound",
                        message: StatusPossibility["NotFound"],
                    }
                }
            })
            .addCase(RegisterReducer.fulfilled, (state, action) => {
                const UserObj: I_UserInLocal = {
                    Email: action.meta.arg.Email,
                    Id: action.payload.name,
                    ImgSrc: "",
                    Name: action.meta.arg.Name,
                    Password: action.meta.arg.Password,
                }
                state.user = UserObj
                state.status = {
                    value: "Logged_In",
                    message: StatusPossibility["Logged_In"],
                }
            })
    },
})

export default userSlice.reducer
export const Get_UserINFo = (state: T_StoreItems): T_UserIntialState => state.User
export const { LogOut, LogIn, ChangeStatus } = userSlice.actions
