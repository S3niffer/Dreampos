import { useDispatch, useSelector } from "react-redux"
import { DeleteProduct, Get_Products, GettAllProducts } from "../Apps/Slices/Products"
import { UnknownAction } from "@reduxjs/toolkit"
import OutLetParent from "../Components/OutLetParent"
import { IoRefresh } from "react-icons/io5"
import { LuClock } from "react-icons/lu"
import { formatDistanceToNow } from "date-fns-jalali"
import { RiDeleteBin2Line, RiEdit2Line } from "react-icons/ri"
import { useEffect, useState } from "react"
import Portal from "../Components/Portal"
import { DeleteSingleImage } from "../Apps/Slices/UploadedImage"
import Loading from "../Components/Loading"

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

    const _DeleteProduct = () => {
        const _AfterDelete = (id: T_Product[0]) => {
            setTimeout(() => {
                Dispatch(DeleteSingleImage({ basket: "Products", id }))
                setSelectedProduct(prv => ({ ...prv, job: "IDLE" }))
                setIsShowAlert({ status: true, job: "DELETE" })
                _GetProducts_Handler()
            }, 300)
        }
        if (!selectedProduct.target) return
        Dispatch(DeleteProduct({ id: selectedProduct.target[0], func: _AfterDelete }) as unknown as UnknownAction)
    }

    const _EditProduct = () => {}

    useEffect(() => {
        if (isShowAlert) {
            const FiveSecondsTimeOut = setTimeout(() => {
                setIsShowAlert({ status: false, job: "DELETE" })
            }, 5000)
            return () => clearTimeout(FiveSecondsTimeOut)
        }
    }, [isShowAlert])

    return (
        <OutLetParent>
            <div className='p-4 md:p-5 lg:p-7'>
                <div className='flex items-center justify-between'>
                    <div className='text-sm md:text-base lg:text-lg'>
                        صفحه محصولات {""}
                        <br />
                        <span className='text-added-text-secondary text-xs md:text-sm lg:text-base'>محصولات رو مشاهده کنید</span>
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
                                        محصول مورد نظر با موفقیت {isShowAlert.job === "DELETE" ? "حذف" : "بروزرسانی"} شد .
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
                                        className='text-white bg-added-main/80 hover:bg-added-main focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center'
                                        onClick={_EditProduct}
                                    >
                                        ارسال
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
