import { useDispatch, useSelector } from "react-redux"
import DefaultAvatar from "../assets/Pics/Default Avatar.png"
import { EditUserByID, Get_UserINFo, LogintUserByID } from "../Apps/Slices/User"
import { useEffect, useReducer, useRef, useState } from "react"
import OutLetParent from "../Components/OutLetParent"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { storage } from "../Firebase"
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi"
import { RiImageEditLine, RiDeleteBin2Line } from "react-icons/ri"
import { UnknownAction } from "@reduxjs/toolkit"
import Loading from "../Components/Loading"

const Profile = () => {
    const Dispatch = useDispatch()
    const User = useSelector(Get_UserINFo).user as I_UserInLocal
    const [FormIsvalid, setFormIsvalid] = useState<boolean>(false)
    const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false)
    const [isShowAlert, setIsShowAlert] = useState<{ value: "Success" | "Error"; status: boolean }>({
        value: "Success",
        status: false,
    })
    const [isShowLoading, setIsShowLoading] = useState<boolean>(false)
    const [isShowPasswordGetter, setIsShowPasswordGetter] = useState({ status: false, Value: "" })
    const getAdminAvatarInput = useRef<HTMLInputElement>(null)
    const Page_Ref = useRef<HTMLDivElement>(null)
    const PasswordModal_Ref = useRef<HTMLInputElement>(null)
    const Form_Ref = useRef<HTMLFormElement>(null)
    const [CurrentImage, setCurrentImage] = useState<I_CurrentImage>({ link: "", name: "", file: undefined, status: "idle" })
    const InitialState = { ...User, Password: "" }
    const Reducer = (state: I_UserInLocal, action: EditAdminReducer) => {
        switch (action.type) {
            case "Email":
                state = { ...state, Email: action.payload }
                break
            case "Name":
                state = { ...state, Name: action.payload }
                break
            case "ImgSrc":
                state = { ...state, ImgSrc: action.payload }
                break
            case "Password":
                state = { ...state, Password: action.payload }
                break
            default:
                state = state
        }
        if (state.Email && state.Id && state.Name && state.Password ? state.Password.length >= 8 : true) {
            setFormIsvalid(true)
        } else {
            setFormIsvalid(false)
        }
        return state
    }
    const [Data, DataDipatcher] = useReducer(Reducer, InitialState)

    const _UploadImageHandler: T_UploadImageHandler = (date, file, setState, number, basketName) => {
        const storageRef = ref(storage, String(`${basketName}/(${date})${file.name}`))
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on(
            "state_changed",
            snapshot => {
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
                    setState({ link: downloadURL, name: ImageData.name, file: undefined, status: "idle" })
                })
            }
        )
    }

    const _SubmitProfileHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!FormIsvalid) return
        setIsShowPasswordGetter({ status: true, Value: "" })
        Page_Ref.current?.scrollBy({
            top: -(Form_Ref.current?.scrollHeight! / 2.5),
            behavior: "smooth",
        })
    }

    const _EditProfileHandler = () => {
        setIsShowLoading(true)
        if (User.Password === isShowPasswordGetter.Value) {
            const _AfterUploaded = () => {
                setIsShowAlert({ status: true, value: "Success" })
                setIsShowPasswordGetter(prv => ({ ...prv, status: false }))

                setTimeout(() => {
                    Dispatch(LogintUserByID({ id: User.Id }) as unknown as UnknownAction)
                }, 600)

                setTimeout(() => {
                    setIsShowAlert({ status: true, value: "Success" })
                    setIsShowPasswordGetter(prv => ({ ...prv, status: false }))
                    setCurrentImage({ file: undefined, link: "", name: "", status: "idle" })
                    setIsShowLoading(false)
                }, 300)
            }

            const newUser: T_UserInDB = {
                Email: Data.Email,
                ImgSrc: Data.ImgSrc,
                Name: Data.Name,
                Password: Data.Password ? Data.Password : User.Password,
            }
            Dispatch(EditUserByID({ id: User.Id, newUser, _func: _AfterUploaded }) as unknown as UnknownAction)
        } else {
            setIsShowAlert({ status: true, value: "Error" })
            setIsShowPasswordGetter(prv => ({ ...prv, status: false }))
            setIsShowLoading(false)
        }
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

        _UploadImageHandler(_DateFormatter(new Date()), CurrentImage.file, setCurrentImage, 0, "AdminAvatar")
    }, [CurrentImage.file])
    useEffect(() => {
        if (CurrentImage.link === "" || CurrentImage.name === "") return

        DataDipatcher({ type: "ImgSrc", payload: CurrentImage.link })
    }, [CurrentImage.link, CurrentImage.name])
    useEffect(() => {
        if (isShowAlert) {
            Page_Ref.current?.scrollTo({ top: 0, behavior: "smooth" })
            const FiveSecondsTimeOut = setTimeout(() => {
                setIsShowAlert(prv => ({ ...prv, status: false }))
            }, 5000)
            return () => clearTimeout(FiveSecondsTimeOut)
        }
    }, [isShowAlert.status])
    useEffect(() => {
        const state = Data
        if (state.Email && state.Id && state.Name) {
            setFormIsvalid(true)
        } else {
            setFormIsvalid(false)
        }
    }, [])
    useEffect(() => {
        if (!isShowPasswordGetter.status) return
        if (!PasswordModal_Ref.current) return

        PasswordModal_Ref.current.focus()
    }, [isShowPasswordGetter.status])

    return (
        <OutLetParent DRef={Page_Ref}>
            {/* password getter */}
            <div
                className={`absolute w-full h-full z-20 backdrop-blur-sm flex items-center justify-center ${
                    isShowPasswordGetter.status ? "block" : "hidden"
                }`}
                onClick={e => {
                    if (e.target === e.currentTarget) {
                        setIsShowPasswordGetter({ status: false, Value: "" })
                    }
                }}
            >
                <div className='relative p-4 w-full max-w-md max-h-full'>
                    <div className='relative bg-added-bg-primary rounded-lg shadow shadow-added-border dir-ltr'>
                        <button
                            type='button'
                            className='absolute top-3 end-2.5 bg-transparent hover:bg-added-border rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center group'
                            data-modal-hide='popup-modal'
                            onClick={() => {
                                setIsShowPasswordGetter({ status: false, Value: "" })
                            }}
                        >
                            <svg
                                className='w-3 h-3 text-added-text-secondary group-hover:text-added-main'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 14 14'
                            >
                                <path
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                                />
                            </svg>
                            <span className='sr-only'>Close modal</span>
                        </button>
                        <div className='p-4 md:p-5 text-center'>
                            <svg
                                className='mx-auto mb-4 text-added-text-secondary w-12 h-12'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 20 20'
                            >
                                <path
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                                />
                            </svg>
                            <h3 className='mb-5 text-lg font-normal text-added-text-primary'>
                                برای ادامه گذرواژه خودتان را وارد کنید
                            </h3>
                            <div className='mb-5 outline-none border-added-border border rounded-sm bg-added-bg-secondary w-64 mx-auto relative h-10'>
                                <input
                                    type={passwordVisibility ? "text" : "password"}
                                    className='outline-none absolute left-1 top-2 bottom-1 right-9 bg-transparent'
                                    value={isShowPasswordGetter.Value}
                                    ref={PasswordModal_Ref}
                                    onChange={e => {
                                        setIsShowPasswordGetter(prv => ({ ...prv, Value: e.target.value }))
                                    }}
                                />
                                <div
                                    onClick={() => {
                                        setPasswordVisibility(prv => !prv)
                                    }}
                                    className='absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer'
                                >
                                    {passwordVisibility ? (
                                        <FiEyeOff className='md:text-lg lg:text-xl' />
                                    ) : (
                                        <FiEye className='md:text-lg lg:text-xl' />
                                    )}
                                </div>
                            </div>
                            <button
                                data-modal-hide='popup-modal'
                                type='button'
                                className='text-white bg-added-main/85 hover:bg-added-main transition-all duration-150  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center hover:text-blue-700'
                                onClick={_EditProfileHandler}
                            >
                                برو
                            </button>
                            <button
                                data-modal-hide='popup-modal'
                                type='button'
                                className='py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
                                onClick={() => {
                                    setIsShowPasswordGetter({ status: false, Value: "" })
                                }}
                            >
                                بیخیال
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='p-4 md:p-5 lg:p-7'>
                <div className='text-sm md:text-base lg:text-lg'>
                    پروفایل {""}
                    <br />
                    <span className='text-added-text-secondary text-xs md:text-sm lg:text-base'>پروفایل خود را تغییر دهید</span>
                </div>

                <div className='bg-added-bg-secondary rounded-md shadow-sm p-2 md:p-4 lg:p-6 mt-16 border border-added-border relative'>
                    {isShowAlert.status ? (
                        <div className={`absolute -top-14 w-full left-0 addCustomerAlert ${isShowAlert.status ? "active" : ""}`}>
                            <div
                                className={`${
                                    isShowAlert.value === "Error"
                                        ? " bg-red-100 border-red-400 text-red-700 "
                                        : " bg-green-100 border-green-400 text-green-700 "
                                }  border  px-4 py-3 rounded relative`}
                                role='alert'
                            >
                                <div
                                    className={`bell absolute top-0 ${
                                        isShowAlert.value === "Error" ? " bg-red-400 " : " bg-green-400 "
                                    }  h-1 right-0`}
                                ></div>
                                <div className='flex items-center text-right dir-rtl text-sm sm:text-base'>
                                    <strong className='font-bold'>{isShowAlert.value === "Error" ? "توجه" : "موفق"}!</strong>
                                    <span className='pr-1'>
                                        {isShowAlert.value === "Error"
                                            ? "گذرواژه شما صحیح نمی باشد"
                                            : "پروفایل شما با موفقیت بروزرسانی شد"}{" "}
                                        .
                                    </span>
                                </div>
                                <span className='absolute top-0 bottom-0 left-0 px-2 py-2.5 sm:px-4 sm:py-3'>
                                    <svg
                                        className={`fill-current h-6 w-6 ${
                                            isShowAlert.value === "Error" ? " text-red-500 " : " text-green-500 "
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

                    <form
                        onSubmit={_SubmitProfileHandler}
                        ref={Form_Ref}
                    >
                        <div className='h-32 relative'>
                            <div className='h-28 bg-gradient-to-r from-[#EA5455] to-[#FF9F43] rounded-md'></div>
                            <div className='bg-added-bg-secondary rounded-full aspect-square border-[6px] border-added-bg-primary w-36 -bottom-1/3 left-1/2 -translate-x-1/2 absolute flex items-center justify-center shadow-xl shadow-added-border cursor-pointer group hover:border-added-main/50 transition-all duration-150'>
                                <div className='w-full h-full relative'>
                                    <label
                                        className='w-full h-full cursor-pointer overflow-hidden'
                                        htmlFor='getAdminAvatar'
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
                                        <img
                                            src={Data.ImgSrc ? Data.ImgSrc : User.ImgSrc ? User.ImgSrc : DefaultAvatar}
                                            alt='avatar'
                                            className='aspect-square w-full h-full rounded-full object-cover'
                                        />
                                    </label>
                                    <div
                                        className='absolute z-10 bottom-1/2 translate-y-1/2 -right-[70px] flex items-center justify-center text-added-bg-primary bg-added-main py-1 w-20 cursor-pointer rounded-r-full transition-all duration-300 shaodw shadow-md border-2 border-added-main hover:text-added-main hover:bg-added-bg-primary rounded-tl-full gap-2'
                                        onClick={() => {
                                            if (getAdminAvatarInput.current) {
                                                getAdminAvatarInput.current.click()
                                            }
                                        }}
                                    >
                                        تغییر
                                        <RiImageEditLine className='text-inherit text-2xl' />
                                    </div>
                                    <div
                                        className='absolute z-10 bottom-1/2 translate-y-1/2 -left-[70px] flex items-center justify-center text-added-bg-primary bg-added-main py-1 w-20 cursor-pointer rounded-l-full  transition-all duration-300 shaodw shadow-md border-2 border-added-main hover:text-added-main hover:bg-added-bg-primary rounded-tr-full gap-2'
                                        onClick={() => {
                                            setCurrentImage({ file: undefined, link: "", name: "", status: "idle" })
                                            DataDipatcher({
                                                type: "ImgSrc",
                                                payload:
                                                    "https://firebasestorage.googleapis.com/v0/b/dashboard-a5184.appspot.com/o/AdminAvatar%2FDefault%20Avatar.png?alt=media&token=f0295bd0-4768-45ee-9b6c-5df353df242d",
                                            })
                                        }}
                                    >
                                        <RiDeleteBin2Line className='text-inherit text-2xl' />
                                        حذف
                                    </div>
                                    <input
                                        type='file'
                                        id='getAdminAvatar'
                                        className='hidden'
                                        ref={getAdminAvatarInput}
                                        accept='image/*'
                                        onChange={e => {
                                            const files = e.target.files
                                            if (!files) return
                                            setCurrentImage(prv => ({ ...prv, file: files[0] }))
                                        }}
                                        disabled={CurrentImage.status !== "idle"}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 gap-1.5 md:gap-y-3 mt-10'>
                            <div className='flex flex-col gap-2.5 p-1'>
                                <label
                                    htmlFor='getAdminName'
                                    className='cursor-pointer'
                                >
                                    نام
                                </label>
                                <input
                                    type='text'
                                    className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 bg-added-bg-secondary focus:border-added-main'
                                    id='getAdminName'
                                    placeholder='نام خود را وارد کنید'
                                    value={Data.Name}
                                    onChange={e => {
                                        DataDipatcher({ type: "Name", payload: e.target.value })
                                    }}
                                />
                            </div>
                            <div className='flex flex-col gap-2.5 p-1'>
                                <label
                                    htmlFor='getAdminEmail'
                                    className='cursor-pointer'
                                >
                                    پست الکترونیک
                                </label>
                                <input
                                    type='Email'
                                    className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 bg-added-bg-secondary focus:border-added-main'
                                    id='getAdminEmail'
                                    placeholder='پست الکترونیکی خود را وارد کنید'
                                    value={Data.Email}
                                    onChange={e => {
                                        DataDipatcher({ type: "Email", payload: e.target.value })
                                    }}
                                />
                            </div>
                            <div className='flex flex-col gap-2.5 p-1'>
                                <label>شناسه شما</label>
                                <input
                                    type='text'
                                    className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 bg-added-bg-secondary focus:border-added-main cursor-pointer disabled:bg-black/5 dir-ltr'
                                    value={Data.Id}
                                    disabled
                                />
                            </div>
                            <div className='flex flex-col gap-2.5 p-1'>
                                <label
                                    htmlFor='getAdminPassword'
                                    className='cursor-pointer'
                                >
                                    گذرواژه جدید
                                </label>
                                <div className='logininputContainer border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 bg-added-bg-secondary focus:border-added-main relative'>
                                    <input
                                        type={passwordVisibility ? "text" : "password"}
                                        className='outline-none w-[90%] h-full bg-transparent'
                                        id='getAdminPassword'
                                        placeholder='گذرواژه جدید را وارد کنید'
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
                        </div>

                        <div className='mt-7 flex justify-between items-center dir-ltr'>
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
export default Profile
