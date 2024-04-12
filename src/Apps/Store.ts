import { configureStore } from "@reduxjs/toolkit"
import ThemeSlice from "./Slices/Theme"
import UserSlice from "./Slices/User"
import UImagesSlice from "./Slices/UploadedImage"
import ProductsSlice from './Slices/Products'

const Store = configureStore({
    reducer: {
        Theme: ThemeSlice,
        User: UserSlice,
        Images: UImagesSlice,
        Products: ProductsSlice
    },
})

export default Store
