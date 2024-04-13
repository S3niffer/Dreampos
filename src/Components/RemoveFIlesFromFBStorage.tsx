import { ref, deleteObject } from "firebase/storage"
import { storage } from "../Firebase"
import { useDispatch } from "react-redux"
import { WriteToRedux } from "../Apps/Slices/UploadedImage"

const RemoveFIlesFromFBStorage = () => {
    const getImages_fromLocal = localStorage.getItem("UploadedImages")
    const Images = getImages_fromLocal ? (JSON.parse(getImages_fromLocal) as T_UploadedImages) : undefined

    if (!Images) return

    const _RemoveFromArray: T_RemoveFromArray = (array, fn) => {
        return array.filter(Img => {
            if (Img.status === "unUsed") {
                const desertRef = ref(storage, `${fn}/${Img.name}`)
                deleteObject(desertRef)
                    .then()
                    .catch(e => console.log(e))
                return false
            } else return true
        })
    }

    let AdminAvatar = _RemoveFromArray(Images.AdminAvatar, "AdminAvatar")
    let CustomerAvatar = _RemoveFromArray(Images.CustomerAvatar, "CustomerAvatar")
    let Products = _RemoveFromArray(Images.Products, "Products")
    const Dipatch = useDispatch()

    const filteredImages: T_UploadedImages = {
        AdminAvatar,
        CustomerAvatar,
        Products,
    }

    Dipatch(WriteToRedux(filteredImages))
    localStorage.setItem("UploadedImages", JSON.stringify(filteredImages))
}
export default RemoveFIlesFromFBStorage
