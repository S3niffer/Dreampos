import { createSlice } from "@reduxjs/toolkit"

const initialState: T_Theme = "light" as T_Theme

const ThemeSlice = createSlice({
    name: "Theme",
    initialState,
    reducers: {
        ThemeChanger: (theme: T_Theme = "light", action: T_ThemeChangerAction) => {
            theme = action.payload
            return action.payload
        },
    },
})

export default ThemeSlice.reducer
export const Get_Theme = (state: T_StoreItems): T_Theme => state.Theme
export const { ThemeChanger } = ThemeSlice.actions
