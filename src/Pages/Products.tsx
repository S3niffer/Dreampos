import { useDispatch, useSelector } from "react-redux"
import { DeleteProduct, EditProduct, Get_Products, GettAllProducts } from "../Apps/Slices/Products"
import { UnknownAction } from "@reduxjs/toolkit"
import OutLetParent from "../Components/OutLetParent"
import UploadSVG from "../assets/Pics/upload.svg"
import { IoRefresh } from "react-icons/io5"
import { LuClock } from "react-icons/lu"
import { formatDistanceToNow } from "date-fns-jalali"
import { RiDeleteBin2Line, RiEdit2Line } from "react-icons/ri"
import { useEffect, useRef, useState } from "react"
import Portal from "../Components/Portal"
import Loading from "../Components/Loading"
import { getDownloadURL, uploadBytesResumable, ref } from "firebase/storage"
import { storage } from "../Firebase"
import { FiLock } from "react-icons/fi"

function TimeAgo({ date }: { date: Date }) {
    const timeAgo = formatDistanceToNow(new Date(date))

    return <span> {timeAgo} پیش اضافه شده</span>
}

const Products = () => {
    const [selectedProduct, setSelectedProduct] = useState<EditOrDeleteProduct>({
        target: null,
        job: "IDLE",
    })
    const Dispatch = useDispatch()
    const Products = useSelector(GettAllProducts)
    const _GetProducts_Handler = () => {
        setIsShowLoading(true)
        const removeLoading = () => {
            setIsShowLoading(false)
        }
        Dispatch(Get_Products(removeLoading) as unknown as UnknownAction)
    }
    const [isShowAlert, setIsShowAlert] = useState<{ status: boolean; job: "DELETE" | "EDIT" }>({ status: false, job: "DELETE" })
    const [isShowLoading, setIsShowLoading] = useState<boolean>(false)
    const [formISvalid, setFormIsvalid] = useState<boolean>(false)
    const [valuesForEdit, setValuesForEdit] = useState<{ Name: string; Price: number; ImgSrce: string }>({
        Name: "",
        ImgSrce: "",
        Price: 0,
    })
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
                    setState({ link: downloadURL, name: ImageData.name, file: undefined, status: "idle" })
                    progressRef = 0
                })
            }
        )
    }
    const [CurrentImage, setCurrentImage] = useState<I_CurrentImage>({ link: "", name: "", file: undefined, status: "idle" })
    const Page_Ref = useRef<HTMLDivElement>(null)
    const ImageProgress_Ref = useRef(0)

    const persianMonths = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]

    const _removePersianDigitsAndSeparators = (str: string) => {
        return str.replace(/[۰-۹٫]/g, match => {
            switch (match) {
                case "۰":
                    return "0"
                case "۱":
                    return "1"
                case "۲":
                    return "2"
                case "۳":
                    return "3"
                case "۴":
                    return "4"
                case "۵":
                    return "5"
                case "۶":
                    return "6"
                case "۷":
                    return "7"
                case "۸":
                    return "8"
                case "۹":
                    return "9"
                case "٫":
                    return "."
                default:
                    return ""
            }
        })
    }

    const _DateFormatter = (date: Date): string => {
        return `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date
            .getDate()
            .toString()
            .padStart(2, "0")}_${
            date.getHours() === 0 ? "12am" : date.getHours() > 12 ? date.getHours() - 12 + "pm" : date.getHours() + "am"
        }${date.getMinutes().toString().padStart(2, "0")}min`
    }

    const _ConvertValueToPersianFormat = (value: number): string => {
        return (+value).toLocaleString("fa-IR")
    }

    const _HandleAddingPersianFormatToNormalAndSaveInState = (event: React.ChangeEvent<HTMLInputElement>) => {
        const removePersianDigitsAndSeparators = (str: string) => {
            return str.replace(/[۰-۹٫]/g, match => {
                switch (match) {
                    case "۰":
                        return "0"
                    case "۱":
                        return "1"
                    case "۲":
                        return "2"
                    case "۳":
                        return "3"
                    case "۴":
                        return "4"
                    case "۵":
                        return "5"
                    case "۶":
                        return "6"
                    case "۷":
                        return "7"
                    case "۸":
                        return "8"
                    case "۹":
                        return "9"
                    case "٫":
                        return "."
                    default:
                        return ""
                }
            })
        }

        const enteredValue = removePersianDigitsAndSeparators(event.target.value).toString().replace(/٬/g, "")

        if (!isNaN(Number(enteredValue))) {
            setValuesForEdit(prv => ({ ...prv, Price: Number(enteredValue) }))
        }
    }

    const _DeleteProduct = () => {
        const _AfterDelete = () => {
            setTimeout(() => {
                setSelectedProduct(prv => ({ ...prv, job: "IDLE" }))
                setIsShowAlert({ status: true, job: "DELETE" })
                setCurrentImage({ file: undefined, link: "", name: "", status: "idle" })
                _GetProducts_Handler()
            }, 300)
        }
        if (!selectedProduct.target) return
        Dispatch(DeleteProduct({ id: selectedProduct.target[0], func: _AfterDelete }) as unknown as UnknownAction)
    }

    const _EditProduct = () => {
        const { ImgSrce, Name, Price } = valuesForEdit
        if (!ImgSrce || !Name || !Price || !selectedProduct.target) return

        const newData: T_ProductsInDB = {
            AdminId: selectedProduct.target[1].AdminId,
            Date: selectedProduct.target[1].Date,
            ImgSrce,
            Name,
            Price,
        }

        const _AfterEdit = () => {
            setTimeout(() => {
                setSelectedProduct(prv => ({ ...prv, job: "IDLE" }))
                setIsShowAlert({ status: true, job: "EDIT" })
                setCurrentImage({ file: undefined, link: "", name: "", status: "idle" })
                _GetProducts_Handler()
            }, 300)
        }

        Dispatch(EditProduct({ id: selectedProduct.target[0], _func: _AfterEdit, newData }) as unknown as UnknownAction)
    }

    useEffect(() => {
        if (isShowAlert.status) {
            Page_Ref.current?.scrollTo({ top: 0, behavior: "smooth" })
            const FiveSecondsTimeOut = setTimeout(() => {
                setIsShowAlert({ status: false, job: "DELETE" })
            }, 5000)
            return () => clearTimeout(FiveSecondsTimeOut)
        }
    }, [isShowAlert.status])

    useEffect(() => {
        if (!CurrentImage.file) return

        _UploadImageHandler(_DateFormatter(new Date()), CurrentImage.file, setCurrentImage, ImageProgress_Ref.current, "Products")
    }, [CurrentImage.file])

    useEffect(() => {
        if (CurrentImage.link === "" || CurrentImage.name === "") return

        setValuesForEdit(prv => ({ ...prv, ImgSrce: CurrentImage.link }))
    }, [CurrentImage.link, CurrentImage.name])

    useEffect(() => {
        if (valuesForEdit.ImgSrce && valuesForEdit.Name && valuesForEdit.Price) {
            setFormIsvalid(true)
        } else {
            setFormIsvalid(false)
        }
    }, [valuesForEdit])

    return (
        <OutLetParent DRef={Page_Ref}>
            <div className='p-4 md:p-5 lg:p-7'>
                <div className='flex items-center justify-between'>
                    <div className='text-sm md:text-base lg:text-lg'>
                        صفحه محصولات {""}
                        <br />
                        <span className='text-added-text-secondary text-xs md:text-sm lg:text-base'>محصولات را مشاهده کنید</span>
                    </div>

                    <button
                        className='outline-none bg-added-main text-added-bg-primary border border-added-main rounded-md px-2 py-1 flex items-center  flex-row-reverse gap-1 hover:text-added-main hover:bg-transparent transition-all duration-300'
                        onClick={_GetProducts_Handler}
                    >
                        <IoRefresh className='text-inherit text-xl' />
                        بروزرسانی
                    </button>
                </div>
                <div className='mt-16 relative'>
                    {isShowAlert.status ? (
                        <div className={`absolute -top-14 w-full left-0 addCustomerAlert ${isShowAlert ? "active" : ""}`}>
                            <div
                                className='bg-green-100 border-green-400 text-green-700 border  px-4 py-3 rounded relative'
                                role='alert'
                            >
                                <div className='bell absolute top-0 bg-green-400 h-1 right-0'></div>
                                <div className='flex items-center text-right dir-rtl text-sm sm:text-base'>
                                    <strong className='font-bold'>موفق!</strong>
                                    <span className='pr-1'>
                                        محصول مورد نظر با موفقیت{" "}
                                        <strong className='font-bold underline underline-offset-8'>
                                            {isShowAlert.job === "DELETE" ? "حذف" : "ویرایش"}
                                        </strong>{" "}
                                        شد .
                                    </span>
                                </div>
                                <span className='absolute top-0 bottom-0 left-0 px-2 py-2.5 sm:px-4 sm:py-3'>
                                    <svg
                                        className='fill-current h-6 w-6 text-green-500'
                                        role='button'
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 20 20'
                                        onClick={() => {
                                            setIsShowAlert({ status: false, job: "DELETE" })
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
                        <div className='absolute w-full h-full z-40 backdrop-blur-[2px] left-0 top-0 rounded overflow-hidden'>
                            <div className='flex h-full items-center justify-center'>
                                <div className='-translate-x-1/2 -translate-y-1/2'>
                                    <Loading />
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {Products.length !== 0 ? (
                        <div className='grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                            {Products.map(product => {
                                const productDate = product[1].Date
                                const PersianDateParts = new Intl.DateTimeFormat("fa-IR").formatToParts(new Date(productDate))
                                const PersianMonthWord =
                                    persianMonths[Number(_removePersianDigitsAndSeparators(PersianDateParts[2].value)) - 1]

                                return (
                                    <div
                                        className='rounded overflow-hidden shadow-lg shadow-added-border bg-added-bg-secondary'
                                        key={product[0]}
                                    >
                                        <div className='relative'>
                                            <div className='h-44'>
                                                <img
                                                    className='w-full h-full'
                                                    src={product[1].ImgSrce}
                                                    alt='Sunset in the mountains'
                                                />
                                                <div className='hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25'></div>
                                            </div>

                                            <div className='absolute bottom-0 left-0 bg-added-main px-4 py-2 text-added-bg-primary text-sm hover:bg-added-bg-primary hover:text-added-main transition duration-500 ease-in-out cursor-pointer'>
                                                عکس
                                            </div>

                                            <div className='absolute top-0 right-0 bg-added-main px-4 text-added-bg-primary rounded-full h-12 w-12 flex flex-col items-center justify-center mt-3 mr-3 hover:bg-added-bg-primary hover:text-added-main transition duration-500 ease-in-out cursor-default text-xs'>
                                                <span className='font-bold'>{PersianDateParts[4].value}</span>
                                                <small>{PersianMonthWord}</small>
                                            </div>
                                        </div>
                                        <div className='px-2 py-2 cursor-default flex items-center justify-between flex-col sm:flex-row'>
                                            <div>
                                                <div className='font-semibold text-lg block sm:inline-block hover:text-added-main transition duration-500 ease-in-out text-center'>
                                                    {product[1].Name}
                                                </div>
                                                <p className='text-gray-500 text-sm'>
                                                    {product[1].Price.toLocaleString("fa-IR") + " "}تـومان
                                                </p>
                                            </div>
                                            <div className='flex items-center gap-1 mt-3 sm:mt-0'>
                                                <div
                                                    className='p-1 rounded-full bg-added-main border border-added-main hover:bg-transparent hover:text-added-main cursor-pointer text-added-bg-primary transition-all duration-300'
                                                    onClick={() => {
                                                        setSelectedProduct({ target: product, job: "EDIT" })
                                                        setValuesForEdit({
                                                            ImgSrce: product[1].ImgSrce,
                                                            Name: product[1].Name,
                                                            Price: product[1].Price,
                                                        })
                                                    }}
                                                >
                                                    <RiEdit2Line className='text-inherit' />
                                                </div>
                                                <div
                                                    className='p-1 rounded-full bg-added-main border border-added-main hover:bg-transparent hover:text-added-main cursor-pointer text-added-bg-primary transition-all duration-300'
                                                    onClick={() => {
                                                        setSelectedProduct({ target: product, job: "DELETE" })
                                                    }}
                                                >
                                                    <RiDeleteBin2Line className='text-inherit' />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex items-center text-xs text-added-text-secondary gap-1.5 p-2 cursor-default'>
                                            <LuClock className='text-inherit' />
                                            <span className='mt-0.5'>
                                                <TimeAgo date={product[1].Date} />
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className='text-center pb-10'>
                            <span className='border-b border-added-main inline-block mb-2 pb-1.5 md:text-lg lg:text-xl'>
                                درحال حاضر محصولی موجود نمی باشد!
                            </span>
                            <br />
                            <span className='text-xs text-added-text-secondary md:text-base lg:text-lg'>
                                بروزرسانی را امتحان کنید
                            </span>
                        </div>
                    )}
                </div>
            </div>
            {selectedProduct.job !== "IDLE" ? (
                <Portal>
                    <div className='relative p-4 w-full max-w-md max-h-full'>
                        <div className='relative bg-added-bg-primary rounded-lg shadow-md shadow-added-border'>
                            <button
                                type='button'
                                className='absolute top-3 end-2.5 bg-transparent hover:bg-added-border rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center group'
                                data-modal-hide='popup-modal'
                                onClick={() => setSelectedProduct(prv => ({ ...prv, job: "IDLE" }))}
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
                                <div className='h-12 flex items-center justify-center text-added-main'>
                                    {selectedProduct.job === "DELETE" ? (
                                        <RiDeleteBin2Line className='text-4xl text-inherit' />
                                    ) : (
                                        <RiEdit2Line className='text-4xl text-inherit' />
                                    )}
                                </div>
                                <h3 className='mb-5 text-lg font-normal text-added-text-primary'>
                                    {selectedProduct.job === "DELETE"
                                        ? "آیا از حذف محصول مورد نظر  اطمینان دارید؟"
                                        : "محصول مورد نظر را ویرایش کنید"}
                                </h3>
                                {selectedProduct.job === "EDIT" ? (
                                    <div className='mb-5 border rounded border-added-border p-2'>
                                        <form className='text-added-text-primary text-right dir-rtl'>
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
                                                    value={valuesForEdit.Name}
                                                    onChange={e => {
                                                        setValuesForEdit(prv => ({ ...prv, Name: e.target.value }))
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
                                                    type='text'
                                                    className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 bg-added-bg-secondary focus:border-added-main dir-ltr font-irSans'
                                                    id='getProductPrice'
                                                    placeholder='قیمت محصول را وارد کنید'
                                                    value={_ConvertValueToPersianFormat(valuesForEdit.Price)}
                                                    onChange={_HandleAddingPersianFormatToNormalAndSaveInState}
                                                />
                                            </div>
                                            <div className='flex'>
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
                                                        onDrop={e => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                            ;(e.target as HTMLElement).classList.remove("hovered")

                                                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                                                setCurrentImage(prv => ({
                                                                    ...prv,
                                                                    file: e.dataTransfer.files[0],
                                                                }))
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
                                                            id='getProductImage'
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
                                                    <div className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 flex justify-center items-center flex-col gap-2 bg-added-bg-secondary focus:border-added-main dir-rtl h-[131px] min-[303px]:h-[115px] sm:h-[106px] md:h-[115px] lg:h-[170px]'>
                                                        {CurrentImage.status === "running" ? (
                                                            "درحال بارگذاری " + ImageProgress_Ref.current + "%"
                                                        ) : (
                                                            <img
                                                                src={
                                                                    CurrentImage.link ? CurrentImage.link : valuesForEdit.ImgSrce
                                                                }
                                                                className='w-full h-full object-contain'
                                                                alt='product'
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                ) : null}
                                {selectedProduct.job === "DELETE" ? (
                                    <button
                                        data-modal-hide='popup-modal'
                                        type='button'
                                        className='text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center'
                                        onClick={_DeleteProduct}
                                    >
                                        بله کاملا
                                    </button>
                                ) : (
                                    <button
                                        data-modal-hide='popup-modal'
                                        type='button'
                                        className='text-white bg-added-main/80 hover:bg-added-main focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center disabled:bg-added-border disabled:border-added-border disabled:text-added-text-primary'
                                        onClick={_EditProduct}
                                        disabled={!formISvalid}
                                    >
                                        ارسال
                                        {formISvalid ? null : <FiLock className='mb-1' />}
                                    </button>
                                )}
                                <button
                                    data-modal-hide='popup-modal'
                                    type='button'
                                    className='py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
                                    onClick={() => setSelectedProduct(prv => ({ ...prv, job: "IDLE" }))}
                                >
                                    {selectedProduct.job === "DELETE" ? "نه، پشیمون شدم" : "نه، بیخیال"}
                                </button>
                            </div>
                        </div>
                    </div>
                </Portal>
            ) : null}
        </OutLetParent>
    )
}
export default Products
