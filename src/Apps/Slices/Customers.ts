import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState: T_Customers = [] as T_Customers

export const AddCustomer = createAsyncThunk("Customers/AddCustomer", async (arg: AddCustomerActionReducer) => {
    return await fetch(`https://dashboard-a5184-default-rtdb.firebaseio.com/Customers.json`, {
        method: "POST",
        body: JSON.stringify(arg.data),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(res => res.json())
        .then(res => res)
})
export const Get_Customers = createAsyncThunk("Customers/GetCustomers", async (func: () => void) => {
    return await fetch(`https://dashboard-a5184-default-rtdb.firebaseio.com/Customers.json`, {
        method: "GET",
    })
        .then(res => res.json())
        .then(res => res)
})
export const DeleteCustomer = createAsyncThunk("Customers/DeleteCustomer", async ({ id, func }: DeleteCustomerActionReducer) => {
    return await fetch(`https://dashboard-a5184-default-rtdb.firebaseio.com/Customers/${id}.json`, {
        method: "DELETE",
    })
        .then(res => res.json())
        .then(res => res)
})
export const EditCustomer = createAsyncThunk("Customers/EditCustomer", async ({ id, newData }: EditCustomerActionReducer) => {
    return await fetch(`https://dashboard-a5184-default-rtdb.firebaseio.com/Customers/${id}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
    })
        .then(res => res.json())
        .then(res => res)
})

const CustomersSlice = createSlice({
    name: "Customers",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(AddCustomer.fulfilled, (state, action) => {
                const id = action.payload.name

                action.meta.arg.func()
            })
            .addCase(Get_Customers.fulfilled, (state, action) => {
                if (action.payload) {
                    const Customers = Object.entries(action.payload) as T_Customers
                    action.meta.arg()
                    return Customers
                }
                action.meta.arg()
                return []
            })
            .addCase(DeleteCustomer.fulfilled, (state, action) => {
                action.meta.arg.func()
            })
            .addCase(EditCustomer.fulfilled, (state, action) => {
                action.meta.arg._func()
            })
    },
})

export default CustomersSlice.reducer
export const GettAllCustomers = (state: T_StoreItems): T_Customers => state.Customers
