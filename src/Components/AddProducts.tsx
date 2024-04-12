import { useDispatch, useSelector } from "react-redux"
import { Get_UserINFo } from "../Apps/Slices/User"
import UploadSVG from "../assets/Pics/upload.svg"
import { useEffect, useReducer, useRef, useState } from "react"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { storage } from "../Firebase"
import { AddImage, EditImage } from "../Apps/Slices/UploadedImage"
import { FiLock } from "react-icons/fi"
import { AddProduct } from "../Apps/Slices/Products"
import { UnknownAction } from "@reduxjs/toolkit"

const AddProducts = () => {
    const Dispatch = useDispatch()
    const UserInfo = useSelector(Get_UserINFo)
    const userID = (UserInfo.user as I_UserInLocal).Id
    const [FormIsvalid, setFormIsvalid] = useState<boolean>(false)
    const ImageProgress_Ref = useRef(0)
    const InitialProductData: T_ProductsInDB = {
        AdminId: userID,
        Date: new Date(),
        ImgSrce: "",
        Name: "",
        Price: 0,
    }

    const Reducer = (state: T_ProductsInDB, action: T_AddProductsAction) => {
        let copyState: T_ProductsInDB

        switch (action.type) {
            case "Price":
                copyState = { ...state, Price: Number(action.payload) }
                break
            case "ImgSrce":
                copyState = { ...state, ImgSrce: action.payload }
                break
            case "Name":
                copyState = { ...state, Name: action.payload }
                break
            default:
                copyState = { ...state }
                break
        }

        if (copyState.AdminId && copyState.Date && copyState.Name && copyState.ImgSrce) {
            console.log("true")
            setFormIsvalid(true)
        } else {
            console.log("false")
            setFormIsvalid(false)
        }
        return copyState
    }

    const [ImageOBJ, setImageOBJ] = useState<I_ImageOBJ>({ file: undefined, status: "idle" })
    const [ProductsData, ProductsDataDipatcher] = useReducer(Reducer, InitialProductData)
    const [CurrentImage, setCurrentImage] = useState<I_CurrentImage>({ link: "", name: "" })

    const _addProductHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const _addUploadedImageStore = (id: string, link: string) => {
            const ImageData: T_UploadedImage<"Products"> = {
                id,
                kind: "Products",
                link,
                name: CurrentImage.name,
                status: "Used",
            }

            setTimeout(() => {
                Dispatch(EditImage(ImageData))
            }, 2000)
        }

        Dispatch(AddProduct({ data: ProductsData, func: _addUploadedImageStore }) as unknown as UnknownAction)
    }

    useEffect(() => {
        if (!ImageOBJ.file) return

        const _UploadImageHandler: T_UploadImageHandler = (date, file, setState, progressRef) => {
            const storageRef = ref(storage, String(`Products/(${date})${file.name}`))
            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on(
                "state_changed",
                snapshot => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    progressRef = progress

                    switch (snapshot.state) {
                        case "paused":
                            setState(prv => ({ ...prv, status: "paused" }))
                            break
                        case "running":
                            setState(prv => ({ ...prv, status: "running" }))
                            break
                        case "canceled":
                        case "error":
                            setState({ file: undefined, status: "failed" })
                            break
                    }
                },
                error => {},
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                        const ImageData: T_UploadedImage<"Products"> = {
                            status: "unUsed",
                            link: downloadURL,
                            name: `(${date})${file.name}`,
                            kind: "Products",
                        }
                        Dispatch(AddImage(ImageData))
                        setCurrentImage({ link: downloadURL, name: ImageData.name })
                        setState({ file: undefined, status: "idle" })
                        progressRef = 0
                    })
                }
            )
        }

        const _DateFormatter = (date: Date): string => {
            return `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date
                .getDate()
                .toString()
                .padStart(2, "0")}_${
                date.getHours() === 0 ? "12am" : date.getHours() > 12 ? date.getHours() - 12 + "pm" : date.getHours() + "am"
            }${date.getMinutes().toString().padStart(2, "0")}min`
        }

        _UploadImageHandler(_DateFormatter(new Date()), ImageOBJ.file, setImageOBJ, ImageProgress_Ref.current)
    }, [ImageOBJ.file])

    useEffect(() => {
        if (CurrentImage.link === "" || CurrentImage.name === "") return
        ProductsDataDipatcher({ type: "ImgSrce", payload: CurrentImage.link })
    }, [CurrentImage])

    return (
        <div className='p-4 md:p-5 lg:p-7'>
            <div className='text-sm md:text-base lg:text-lg'>
                افزودن محصول {""}
                <br />
                <span className='text-added-text-secondary text-xs md:text-sm lg:text-base'>محصول جدید را اضافه کنید</span>
            </div>

            <div className='bg-added-bg-secondary rounded-md shadow-sm p-2 md:p-4 lg:p-6 mt-5 md:mt-7 lg:mt-10 border border-added-border'>
                <form onSubmit={_addProductHandler}>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-1.5 md:gap-y-3'>
                        <div className='flex flex-col gap-2.5 p-1'>
                            <label
                                htmlFor='getProductName'
                                className='cursor-pointer'
                            >
                                عنوان
                            </label>
                            <input
                                type='text'
                                className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 bg-added-bg-secondary focus:border-added-main'
                                id='getProductName'
                                placeholder='عنوان محصول را وارد کنید'
                                value={ProductsData.Name}
                                onChange={e => {
                                    ProductsDataDipatcher({ type: "Name", payload: e.target.value })
                                }}
                            />
                        </div>
                        <div className='flex flex-col gap-2.5 p-1'>
                            <label
                                htmlFor='getProductPrice'
                                className='cursor-pointer'
                            >
                                قیمت
                            </label>
                            <input
                                type='number'
                                className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 bg-added-bg-secondary focus:border-added-main'
                                id='getProductPrice'
                                placeholder='قیمت محصول را وارد کنید'
                                value={ProductsData.Price}
                                onChange={e => {
                                    ProductsDataDipatcher({ type: "Price", payload: Number(e.target.value) })
                                }}
                            />
                        </div>
                        <div className='flex flex-col gap-2.5 p-1'>
                            <label htmlFor=''>شناسه فرد اضافه کننده</label>
                            <input
                                type='text'
                                className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 bg-added-bg-secondary focus:border-added-main cursor-pointer disabled:bg-black/5'
                                value={ProductsData.AdminId}
                                disabled
                            />
                        </div>
                        <div className='flex flex-col gap-2.5 p-1'>
                            <label htmlFor=''>تاریخ</label>
                            <input
                                type='text'
                                className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 bg-added-bg-secondary focus:border-added-main cursor-pointer disabled:bg-black/5'
                                value={String(new Intl.DateTimeFormat("fa-IR").format(ProductsData.Date))}
                                disabled
                            />
                        </div>
                    </div>

                    <div className='flex mt-5  sm:mt-7 md:mt-9'>
                        <div className='flex flex-col gap-2.5 p-1 w-3/6 sm:w-4/6'>
                            <label
                                htmlFor='getProductImage'
                                className='cursor-pointer w-28'
                            >
                                تصویر محصول
                            </label>
                            <label
                                htmlFor='getProductImage'
                                className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 cursor-pointer flex justify-center items-center flex-col gap-2 bg-added-bg-secondary focus:border-added-main hover:bg-added-border'
                            >
                                <input
                                    type='file'
                                    className='hidden'
                                    id='getProductImage'
                                    onChange={e => {
                                        const files = e.target.files
                                        if (!files) return
                                        setImageOBJ(prv => ({ ...prv, file: files[0] }))
                                    }}
                                    disabled={ImageOBJ.status !== "idle"}
                                />
                                <img
                                    src={UploadSVG}
                                    alt='Icon'
                                    className='sm:w-12 lg:w-16'
                                />
                                <span className='text-added-text-secondary text-xs text-center md:text-sm lg:text-base'>
                                    بکشید و رها کنید برای انتخاب عکس <br /> یا کلیک کنید
                                </span>
                            </label>
                        </div>
                        <div className='w-3/6 sm:w-2/6 p-1'>
                            <div className='pb-2.5'>پیش نمایش</div>
                            <div className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 flex justify-center items-center flex-col gap-2 bg-added-bg-secondary focus:border-added-main h-[114px] min-[447px]:h-[99px] sm:h-[106px] md:h-[114px] lg:h-[146px] dir-rtl'>
                                {ImageOBJ.status === "running" ? (
                                    "درحال بارگذاری " + ImageProgress_Ref.current + "%"
                                ) : (
                                    <img
                                        src={CurrentImage.link ? CurrentImage.link : UploadSVG}
                                        className='w-full h-full object-contain'
                                        alt='product'
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='mt-4 flex justify-between items-center'>
                        <button className='bg-added-text-secondary hover:bg-added-text-primary/90 text-white rounded-md p-2'>
                            پاک کردن ورودی ها
                        </button>
                        <button
                            className='transition-all duration-300 bg-added-main border border-added-main hover:bg-added-bg-secondary
                        hover:text-added-main text-white rounded-md p-2 w-28 cursor-pointer disabled:bg-added-border flex items-center justify-center gap-2'
                            disabled={!FormIsvalid}
                            type='submit'
                        >
                            ارسال
                            {FormIsvalid ? null : <FiLock />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default AddProducts
