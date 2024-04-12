import { configureStore } from "@reduxjs/toolkit"
import ThemeSlice from "./Slices/Theme"
import UserSlice from "./Slices/User"
import UImagesSlice from "./Slices/UploadedImage"

const Store = configureStore({
    reducer: {
        Theme: ThemeSlice,
        User: UserSlice,
        Images: UImagesSlice,
    },
})

export default Store
