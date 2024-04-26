import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState: T_Products = [] as T_Products

export const AddProduct = createAsyncThunk("Products/AddProduct", async (arg: AddProductActionReducer) => {
    return await fetch(`https://dashboard-a5184-default-rtdb.firebaseio.com/Products.json`, {
        method: "POST",
        body: JSON.stringify(arg.data),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(res => res.json())
        .then(res => res)
})
export const DeleteProduct = createAsyncThunk("Products/DeleteProduct", async ({ id }: DeleteProductActionReducer) => {
    return await fetch(`https://dashboard-a5184-default-rtdb.firebaseio.com/Products/${id}.json`, {
        method: "DELETE",
    })
        .then(res => res.json())
        .then(res => res)
})
export const EditProduct = createAsyncThunk("Products/EditProduct", async ({ id, newData, _func }: EditProductActionReducer) => {
    return await fetch(`https://dashboard-a5184-default-rtdb.firebaseio.com/Products/${id}.json`, {
        method: "PUT",
        body: JSON.stringify(newData),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(res => res.json())
        .then(res => res)
})
export const Get_Products = createAsyncThunk("Products/GetProducts", async (func: () => void) => {
    return await fetch(`https://dashboard-a5184-default-rtdb.firebaseio.com/Products.json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(res => res.json())
        .then(res => res)
})

const ProductsSlice = createSlice({
    name: "Products",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(AddProduct.fulfilled, (state, action) => {
                const id = action.payload.name

                action.meta.arg.func(id)
            })
            .addCase(Get_Products.fulfilled, (state, action) => {
                if (action.payload) {
                    const Products = Object.entries(action.payload) as T_Products
                    action.meta.arg()
                    return Products
                }
                action.meta.arg()
                return []
            })
            .addCase(DeleteProduct.fulfilled, (state, action) => {
                action.meta.arg.func(action.meta.arg.id)
            }).addCase(EditProduct.fulfilled, (state,action) => {
                action.meta.arg._func()
            })
    },
})

export default ProductsSlice.reducer
export const GettAllProducts = (state: T_StoreItems): T_Products => state.Products
