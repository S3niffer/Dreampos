import { configureStore } from "@reduxjs/toolkit"
import ThemeSlice from "./Slices/Theme"
import UserSlice from "./Slices/User"

const Store = configureStore({
    reducer: {
        Theme: ThemeSlice,
        User: UserSlice,
    },
})

export default Store
