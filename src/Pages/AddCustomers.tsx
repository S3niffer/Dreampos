import { useDispatch, useSelector } from "react-redux"
import { Get_UserINFo } from "../Apps/Slices/User"
import UploadSVG from "../assets/Pics/upload.svg"
import { useEffect, useReducer, useRef, useState } from "react"
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { storage } from "../Firebase"
import { AddImage, EditImage } from "../Apps/Slices/UploadedImage"
import { UnknownAction } from "@reduxjs/toolkit"
import { AddCustomer } from "../Apps/Slices/Customers"
import Loading from "../Components/Loading"
import OutLetParent from "../Components/OutLetParent"

const AddCustomers = () => {
    const Dispatch = useDispatch()
    const userID = (useSelector(Get_UserINFo).user as I_UserInLocal).Id
    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const [isShowLoading, setIsShowLoading] = useState<boolean>(false)
    const [secondaryPassword, setSecondaryPassword] = useState<string>("")
    const [isShowAlert, setIsShowAlert] = useState<{ status: boolean; type: "Danger" | "Success" }>({
        status: false,
        type: "Danger",
    })
    const [FormIsvalid, setFormIsvalid] = useState<boolean>(false)
    const ImageProgress_Ref = useRef(0)
    const Page_Ref = useRef<HTMLDivElement>(null)
    const [CurrentImage, setCurrentImage] = useState<I_CurrentImage>({ link: "", name: "", file: undefined, status: "idle" })
    const InitialData: T_CustomerInDBWithoutDate = {
        AdminId: userID,
        ImgSrce: "",
        Name: "",
        Password: "",
        Email: "",
    }
    const Reducer = (state: T_CustomerInDBWithoutDate, action: T_AddCustomerAction) => {
        let copyState: T_CustomerInDBWithoutDate

        switch (action.type) {
            case "Password":
                copyState = { ...state, Password: action.payload }
                break
            case "ImgSrce":
                copyState = { ...state, ImgSrce: action.payload }
                break
            case "Email":
                copyState = { ...state, Email: action.payload }
                break
            case "Name":
                copyState = { ...state, Name: action.payload }
                break
            case "REST":
                copyState = {
                    ...state,
                    ImgSrce: "",
                    Name: "",
                    Password: "",
                    Email: "",
                }
                break
            default:
                copyState = { ...state }
                break
        }

        if (copyState.AdminId && copyState.Name && copyState.ImgSrce && copyState.Email && copyState.Password.length > 3) {
            setFormIsvalid(true)
        } else {
            setFormIsvalid(false)
        }
        return copyState
    }
    const [Data, DataDipatcher] = useReducer(Reducer, InitialData)

    const _ResetValues = () => {
        DataDipatcher({ type: "REST" })
        setCurrentImage(prv => ({ ...prv, file: undefined, link: "", name: "", status: "idle" }))
        setSecondaryPassword("")
    }

    const _addCustomerHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!FormIsvalid) return
        setIsShowLoading(true)

        const _addUploadedImageStore = (id: string) => {
            const ImageData: T_UploadedImage<"CustomerAvatar"> = {
                id,
                kind: "CustomerAvatar",
                link: CurrentImage.link,
                name: CurrentImage.name,
                status: "Used",
            }
            _ResetValues()
            setIsShowLoading(false)
            setIsShowAlert({ status: true, type: "Success" })

            setTimeout(() => {
                Dispatch(EditImage(ImageData))
            }, 500)
        }

        if (Data.Password === secondaryPassword) {
            Dispatch(
                AddCustomer({ data: { ...Data, Date: new Date() }, func: _addUploadedImageStore }) as unknown as UnknownAction
            )
        } else {
            setIsShowAlert({ status: true, type: "Danger" })
            setIsShowLoading(false)
        }
    }

    const _UploadImageHandler: T_UploadImageHandler = (date, file, setState, progressRef, basketName) => {
        const storageRef = ref(storage, String(`${basketName}/(${date})${file.name}`))
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
                        setState(prv => ({ ...prv, file: undefined, status: "failed" }))
                        break
                }
            },
            error => {
                setState(prv => ({ ...prv, file: undefined, status: "failed" }))
                console.log(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                    const ImageData: T_UploadedImage<typeof basketName> = {
                        status: "unUsed",
                        link: downloadURL,
                        name: `(${date})${file.name}`,
                        kind: `${basketName}`,
                    }
                    Dispatch(AddImage(ImageData))
                    setState({ link: downloadURL, name: ImageData.name, file: undefined, status: "idle" })
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

    useEffect(() => {
        if (!CurrentImage.file) return

        _UploadImageHandler(
            _DateFormatter(new Date()),
            CurrentImage.file,
            setCurrentImage,
            ImageProgress_Ref.current,
            "CustomerAvatar"
        )
    }, [CurrentImage.file])

    useEffect(() => {
        if (CurrentImage.link === "" || CurrentImage.name === "") return

        DataDipatcher({ type: "ImgSrce", payload: CurrentImage.link })
    }, [CurrentImage.link, CurrentImage.name])

    useEffect(() => {
        if (isShowAlert.status) {
            Page_Ref.current?.scrollTo({ top: 0, behavior: "smooth" })
            const FiveSecondsTimeOut = setTimeout(() => {
                setIsShowAlert(prv => ({ ...prv, status: false }))
            }, 5000)
            return () => clearTimeout(FiveSecondsTimeOut)
        }
    }, [isShowAlert.status])

    return (
        <OutLetParent DRef={Page_Ref}>
            <div className='p-4 md:p-5 lg:p-7'>
                <div className='text-sm md:text-base lg:text-lg'>
                    افزودن کاربر {""}
                    <br />
                    <span className='text-added-text-secondary text-xs md:text-sm lg:text-base'>کابر جدید را اضافه کنید</span>
                </div>

                <div className='bg-added-bg-secondary rounded-md shadow-sm p-2 md:p-4 lg:p-6 mt-16 border border-added-border relative'>
                    {isShowAlert.status ? (
                        <div className={`absolute -top-14 w-full left-0 addCustomerAlert ${isShowAlert ? "active" : ""}`}>
                            <div
                                className={`${
                                    isShowAlert.type === "Danger"
                                        ? " bg-red-100 border-red-400 text-red-700 "
                                        : " bg-green-100 border-green-400 text-green-700 "
                                }  border  px-4 py-3 rounded relative`}
                                role='alert'
                            >
                                <div
                                    className={`bell absolute top-0 ${
                                        isShowAlert.type === "Danger" ? " bg-red-400 " : " bg-green-400 "
                                    }  h-1 right-0`}
                                ></div>
                                <div className='flex items-center text-right dir-rtl text-sm sm:text-base'>
                                    <strong className='font-bold'>{isShowAlert.type === "Danger" ? "توجه" : "موفق"}!</strong>
                                    <span className='pr-1'>
                                        {isShowAlert.type === "Danger"
                                            ? "هردو گذرواژه شما باید باهم برابر باشند"
                                            : "کاربر مورد نظر با موفقیت اضافه شد"}{" "}
                                        .
                                    </span>
                                </div>
                                <span className='absolute top-0 bottom-0 left-0 px-2 py-2.5 sm:px-4 sm:py-3'>
                                    <svg
                                        className={`fill-current h-6 w-6 ${
                                            isShowAlert.type === "Danger" ? " text-red-500 " : " text-green-500 "
                                        }`}
                                        role='button'
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 20 20'
                                        onClick={() => {
                                            setIsShowAlert(prv => ({ ...prv, status: false }))
                                        }}
                                    >
                                        <title>Close</title>
                                        <path d='M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z' />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    ) : null}

                    {isShowLoading ? (
                        <div className='absolute w-[calc(100%-16px)] h-[calc(100%-16px)] z-40 backdrop-blur-[2px] left-2 top-2'>
                            <div className='flex h-full items-center justify-center'>
                                <div className='-translate-x-1/2 -translate-y-1/2'>
                                    <Loading />
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <form onSubmit={_addCustomerHandler}>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-1.5 md:gap-y-3'>
                            <div className='flex flex-col gap-2.5 p-1'>
                                <label
                                    htmlFor='getCustomerName'
                                    className='cursor-pointer'
                                >
                                    نام
                                </label>
                                <input
                                    type='text'
                                    className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 bg-added-bg-secondary focus:border-added-main'
                                    id='getCustomerName'
                                    placeholder='عنوان محصول را وارد کنید'
                                    value={Data.Name}
                                    onChange={e => {
                                        DataDipatcher({ type: "Name", payload: e.target.value })
                                    }}
                                />
                            </div>
                            <div className='flex flex-col gap-2.5 p-1'>
                                <label
                                    htmlFor='getCustomerEmail'
                                    className='cursor-pointer'
                                >
                                    ایمیل
                                </label>
                                <input
                                    type='email'
                                    className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 bg-added-bg-secondary focus:border-added-main'
                                    id='getCustomerEmail'
                                    placeholder='ایمیل کاربر را وارد کنید'
                                    value={Data.Email}
                                    onChange={e => {
                                        DataDipatcher({ type: "Email", payload: e.target.value })
                                    }}
                                />
                            </div>
                            <div className='flex flex-col gap-2.5 p-1'>
                                <label
                                    htmlFor='getCustomerPassword'
                                    className='cursor-pointer'
                                >
                                    گذرواژه
                                </label>
                                <div className='logininputContainer border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 bg-added-bg-secondary focus:border-added-main relative'>
                                    <input
                                        type={passwordVisibility ? "text" : "password"}
                                        className='outline-none w-[90%] h-full bg-transparent'
                                        id='getCustomerPassword'
                                        placeholder='گذرواژه کاربر را وارد کنید'
                                        value={Data.Password}
                                        onChange={e => {
                                            DataDipatcher({ type: "Password", payload: e.target.value })
                                        }}
                                    />
                                    <div
                                        onClick={() => setPasswordVisibility(prv => !prv)}
                                        className='absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer'
                                    >
                                        {passwordVisibility ? (
                                            <FiEyeOff className='md:text-lg lg:text-xl' />
                                        ) : (
                                            <FiEye className='md:text-lg lg:text-xl' />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-2.5 p-1'>
                                <label
                                    htmlFor='secondaryPassword'
                                    className='cursor-pointer'
                                >
                                    تکرار گذرواژه
                                </label>
                                <div className='logininputContainer border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 bg-added-bg-secondary focus:border-added-main relative'>
                                    <input
                                        type={passwordVisibility ? "text" : "password"}
                                        className='outline-none w-[90%] h-full bg-transparent'
                                        id='secondaryPassword'
                                        placeholder='گذرواژه کاربر را دوباره وارد کنید'
                                        value={secondaryPassword}
                                        onChange={e => {
                                            setSecondaryPassword(e.target.value)
                                        }}
                                    />
                                    <div
                                        onClick={() => setPasswordVisibility(prv => !prv)}
                                        className='absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer'
                                    >
                                        {passwordVisibility ? (
                                            <FiEyeOff className='md:text-lg lg:text-xl' />
                                        ) : (
                                            <FiEye className='md:text-lg lg:text-xl' />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-2.5 p-1'>
                                <label htmlFor=''>شناسه فرد اضافه کننده</label>
                                <input
                                    type='text'
                                    className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 bg-added-bg-secondary focus:border-added-main cursor-pointer disabled:bg-black/5'
                                    value={userID}
                                    disabled
                                />
                            </div>
                            <div className='flex flex-col gap-2.5 p-1'>
                                <label htmlFor=''>تاریخ</label>
                                <input
                                    type='text'
                                    className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 bg-added-bg-secondary focus:border-added-main cursor-pointer disabled:bg-black/5'
                                    value={String(new Intl.DateTimeFormat("fa-IR").format(new Date()))}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className='flex mt-5  sm:mt-7 md:mt-9'>
                            <div className='flex flex-col gap-2.5 p-1 w-3/6 sm:w-4/6'>
                                <label
                                    htmlFor='getCustomerImage'
                                    className='cursor-pointer w-28'
                                >
                                    تصویر کاربر
                                </label>
                                <label
                                    htmlFor='getCustomerImage'
                                    className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 cursor-pointer flex justify-center items-center flex-col gap-2 bg-added-bg-secondary focus:border-added-main hover:bg-added-border'
                                    onDrop={e => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        ;(e.target as HTMLElement).classList.remove("hovered")

                                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                            setCurrentImage(prv => ({ ...prv, file: e.dataTransfer.files[0] }))
                                        }
                                    }}
                                    onDragEnter={e => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        ;(e.target as HTMLElement).classList.add("hovered")
                                    }}
                                    onDragOver={e => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        ;(e.target as HTMLElement).classList.add("hovered")
                                    }}
                                    onDragLeave={e => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        ;(e.target as HTMLElement).classList.remove("hovered")
                                    }}
                                >
                                    <input
                                        type='file'
                                        className='hidden'
                                        id='getCustomerImage'
                                        accept='image/*'
                                        onChange={e => {
                                            const files = e.target.files
                                            if (!files) return
                                            setCurrentImage(prv => ({ ...prv, file: files[0] }))
                                        }}
                                        disabled={CurrentImage.status !== "idle"}
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
                                <div className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 flex justify-center items-center flex-col gap-2 bg-added-bg-secondary focus:border-added-main h-[114px] min-[447px]:h-[99px] sm:h-[106px] md:h-[114px] lg:h-[146px]'>
                                    {CurrentImage.status === "running" ? (
                                        "درحال بارگذاری " + ImageProgress_Ref.current + "%"
                                    ) : (
                                        <img
                                            src={CurrentImage.link ? CurrentImage.link : UploadSVG}
                                            className='w-full h-full object-contain'
                                            alt='CustomerAvatar'
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='mt-4 flex justify-between items-center'>
                            <button
                                onClick={_ResetValues}
                                type='button'
                                className='bg-added-text-secondary hover:bg-added-text-primary/90 text-white rounded-md p-2'
                            >
                                پاک کردن ورودی ها
                            </button>
                            <button
                                className='transition-all duration-300 border text-white border-added-main bg-added-main hover:bg-added-bg-secondary hover:text-added-main
                         rounded-md p-2 cursor-pointer disabled:bg-added-border disabled:border-added-border disabled:text-added-text-primary'
                                disabled={!FormIsvalid}
                                type='submit'
                            >
                                <div className='flex items-center justify-center gap-1'>
                                    ثبت
                                    {FormIsvalid ? null : <FiLock className='mb-1' />}
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </OutLetParent>
    )
}
export default AddCustomers
