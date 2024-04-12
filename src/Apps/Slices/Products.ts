import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState: T_Products = [] as T_Products

export const AddProduct = createAsyncThunk(
    "Products/AddProduct",
    async (arg: { data: T_ProductsInDB; func: (id: string, link: string) => void }) => {
        return await fetch(`https://dashboard-a5184-default-rtdb.firebaseio.com/Products.json`, {
            method: "POST",
            body: JSON.stringify(arg.data),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(res => res)
    }
)

const ProductsSlice = createSlice({
    name: "Products",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(AddProduct.pending, (state, action) => {
                // changeStatus
            })
            .addCase(AddProduct.fulfilled, (state, action) => {
                const id = action.payload.name
                const link = action.meta.arg.data.ImgSrce

                action.meta.arg.func(id, link)
                console.log(action)
            })
    },
})

export default ProductsSlice.reducer
export const GettAllProducts = (state: T_StoreItems): T_Products => state.Products
