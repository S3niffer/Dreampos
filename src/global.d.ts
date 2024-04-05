import { IconType } from "react-icons"
import Store from "./Apps/Store"
import { StatusPossibility } from "./Apps/Slices/User"

declare global {
    // Store
    type T_StoreItems = ReturnType<typeof Store.getState>

    // Theme
    type T_Theme = "light" | "dark"

    type T_ThemeChangerAction = { type: string; payload: T_Theme }

    // User
    type StatusPossibilityOBJ = {
        [K in keyof typeof StatusPossibility]: { value: K; message: (typeof StatusPossibility)[K] }
    }[keyof typeof StatusPossibility]

    type T_UserIntialState = {
        status: StatusPossibilityOBJ
        user: {} | I_UserInLocal
        users: T_Users
    }

    type T_Users = [string, T_UserInDB][]

    interface I_UserInLocal {
        Email: string
        Password: string
        ImgSrc: string
        Name: string
        Id: string
    }

    type T_UserInDB = Omit<I_UserInLocal, "Id">

    // inputTag props
    type T_InputTagProps = React.ComponentProps<"input"> & {
        label: string
        Icon: IconType
        FunctionOnIcon?: React.MouseEventHandler<HTMLDivElement>
        minLengthCondition?: number
    }

    // userLoginParameters
    interface I_UserLoginParameter {
        Email: T_UserInDB["Email"]
        Password: T_UserInDB["Password"]
    }

    // userRegisterParameter
    interface I_UserRegisterParameters {
        Name: T_UserInDB["Name"]
        Email: T_UserInDB["Email"]
        Password: T_UserInDB["Password"]
    }
}

export {}
