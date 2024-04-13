import { createSlice, current } from "@reduxjs/toolkit"
import RemoveFIlesFromFBStorage from "../../Components/RemoveFIlesFromFBStorage"

const initialState: T_UploadedImages = {
    Products: [],
    CustomerAvatar: [],
    AdminAvatar: [],
} as T_UploadedImages

const UImagesSlice = createSlice({
    name: "UploadedImages",
    initialState,
    reducers: {
        AddImage: (state: T_UploadedImages, action: { type: string; payload: T_UploadedImage<ImageBaskets> }) => {
            const Value = action.payload

            switch (Value.kind) {
                case "AdminAvatar":
                    state.AdminAvatar.push(Value as T_UploadedImage<"AdminAvatar">)
                    break
                case "CustomerAvatar":
                    state.CustomerAvatar.push(Value as T_UploadedImage<"CustomerAvatar">)
                    break
                case "Products":
                    state.Products.push(Value as T_UploadedImage<"Products">)
                    break
                default:
                    return state
            }

            localStorage.setItem("UploadedImages", JSON.stringify(current(state)))
        },
        EditImage: (state: T_UploadedImages, action: { type: string; payload: T_UploadedImage<ImageBaskets> }) => {
            const Value = action.payload
            const copyState = current(state)
            let result

            switch (Value.kind) {
                case "AdminAvatar":
                    result = copyState.AdminAvatar.map(image => {
                        if (image.name == Value.name) {
                            return Value
                        } else return image
                    })
                    state.AdminAvatar = result as T_UploadedImage<"AdminAvatar">[]
                    break
                case "CustomerAvatar":
                    result = copyState.CustomerAvatar.map(image => {
                        if (image.name == Value.name) {
                            return Value
                        } else return image
                    })
                    state.CustomerAvatar = result as T_UploadedImage<"CustomerAvatar">[]
                    break
                case "Products":
                    result = copyState.Products.map(image => {
                        if (image.name == Value.name) {
                            return Value
                        } else return image
                    })

                    state.Products = result as T_UploadedImage<"Products">[]
                    break
            }
            localStorage.setItem("UploadedImages", JSON.stringify(current(state)))
            RemoveFIlesFromFBStorage()
        },
        WriteToRedux: (state: T_UploadedImages, action: { type: string; payload: T_UploadedImages }) => {
            state.AdminAvatar = action.payload.AdminAvatar
            state.CustomerAvatar = action.payload.CustomerAvatar
            state.Products = action.payload.Products
        },
    },
})

export default UImagesSlice.reducer
export const Get_Images = (state: T_StoreItems): T_UploadedImages => state.Images
export const { AddImage, EditImage, WriteToRedux } = UImagesSlice.actions
