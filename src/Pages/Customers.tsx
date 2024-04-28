import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { UnknownAction } from "@reduxjs/toolkit"
import { DeleteCustomer, Get_Customers, GettAllCustomers } from "../Apps/Slices/Customers"
import OutLetParent from "../Components/OutLetParent"
import { IoRefresh } from "react-icons/io5"
import Loading from "../Components/Loading"
import { RiDeleteBin2Line, RiEdit2Line } from "react-icons/ri"
import Portal from "../Components/Portal"
import { FiLock } from "react-icons/fi"

const Customers = () => {
    const [selectedCustomer, setSelectedCustomer] = useState<EditOrDeleteCustomer>({
        target: null,
        job: "IDLE",
    })
    const Dispatch = useDispatch()
    const Customers = useSelector(GettAllCustomers)
    const [isShowLoading, setIsShowLoading] = useState<boolean>(false)
    const [isShowAlert, setIsShowAlert] = useState<{ status: boolean; job: "DELETE" | "EDIT" }>({ status: false, job: "DELETE" })
    const Page_Ref = useRef<HTMLDivElement>(null)
    const [formISvalid, setFormIsvalid] = useState<boolean>(false)
    const persianMonths = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]
    const [CurrentImage, setCurrentImage] = useState<I_CurrentImage>({ link: "", name: "", file: undefined, status: "idle" })

    const _GetCustomers_Handler = () => {
        setIsShowLoading(true)
        const removeLoading = () => {
            setIsShowLoading(false)
        }
        Dispatch(Get_Customers(removeLoading) as unknown as UnknownAction)
    }

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
        const _AfterDelete = () => {
            setTimeout(() => {
                setSelectedCustomer(prv => ({ ...prv, job: "IDLE" }))
                setIsShowAlert({ status: true, job: "DELETE" })
                setCurrentImage({ file: undefined, link: "", name: "", status: "idle" })
                _GetCustomers_Handler()
            }, 300)
        }
        if (!selectedCustomer.target) return
        Dispatch(DeleteCustomer({ id: selectedCustomer.target[0], func: _AfterDelete }) as unknown as UnknownAction)
    }
    const _EditProduct = () => {}

    useEffect(() => {
        if (isShowAlert.status) {
            Page_Ref.current?.scrollTo({ top: 0, behavior: "smooth" })
            const FiveSecondsTimeOut = setTimeout(() => {
                setIsShowAlert({ status: false, job: "DELETE" })
            }, 5000)
            return () => clearTimeout(FiveSecondsTimeOut)
        }
    }, [isShowAlert.status])

    return (
        <OutLetParent DRef={Page_Ref}>
            <div className='p-4 md:p-5 lg:p-7'>
                <div className='flex items-center justify-between'>
                    <div className='text-sm md:text-base lg:text-lg'>
                        صفحه کاربران {""}
                        <br />
                        <span className='text-added-text-secondary text-xs md:text-sm lg:text-base'>کاربران را مشاهده کنید</span>
                    </div>

                    <button
                        className='outline-none bg-added-main text-added-bg-primary border border-added-main rounded-md px-2 py-1 flex items-center  flex-row-reverse gap-1 hover:text-added-main hover:bg-transparent transition-all duration-300'
                        onClick={_GetCustomers_Handler}
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
                                        کاربر مورد نظر با موفقیت{" "}
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

                    {Customers.length !== 0 ? (
                        <div className='relative overflow-x-auto sm:rounded-lg p-1'>
                            <div className='flex flex-column sm:flex-row flex-wrap items-center justify-between gap-2.5 pb-2.5 p-1'>
                                <div className=''>
                                    <button
                                        className='items-center text-added-text-secondary bg-transparent border border-added-border hover:bg-added-bg-secondary font-medium rounded-md text-sm flex h-7 px-1.5'
                                        type='button'
                                    >
                                        <svg
                                            className='w-3 h-3 text-added-text-secondary me-3'
                                            aria-hidden='true'
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='currentColor'
                                            viewBox='0 0 20 20'
                                        >
                                            <path d='M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z' />
                                        </svg>
                                        Last 30 days
                                        <svg
                                            className='w-2.5 h-2.5 ms-2.5'
                                            aria-hidden='true'
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 10 6'
                                        >
                                            <path
                                                stroke='currentColor'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='m1 1 4 4 4-4'
                                            />
                                        </svg>
                                    </button>

                                    <div className='z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow'>
                                        <ul className='p-3 space-y-1 text-sm text-gray-700'>
                                            <li>
                                                <div className='flex items-center p-2 rounded hover:bg-gray-100'>
                                                    <input
                                                        id='filter-radio-example-1'
                                                        type='radio'
                                                        value=''
                                                        name='filter-radio'
                                                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300'
                                                    />
                                                    <label
                                                        htmlFor='filter-radio-example-1'
                                                        className='w-full ms-2 text-sm font-medium text-gray-900 rounded'
                                                    >
                                                        Last day
                                                    </label>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className='relative w-48 border  rounded-md h-7 border-added-border hover:bg-added-bg-secondary hasINput'>
                                    <div className='absolute left-0.5 flex items-center top-1/2 -translate-y-1/2 overflow-hidden'>
                                        <svg
                                            className='w-5 h-5 text-added-text-secondary cursor-pointer'
                                            aria-hidden='true'
                                            fill='currentColor'
                                            viewBox='0 0 20 20'
                                            xmlns='http://www.w3.org/2000/svg'
                                        >
                                            <path
                                                fillRule='evenodd'
                                                d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                                                clipRule='evenodd'
                                            ></path>
                                        </svg>
                                    </div>
                                    <input
                                        type='text'
                                        id='table-search'
                                        className='w-10/12 h-full outline-none p-1 bg-transparent text-added-text-secondary'
                                        placeholder='جستجو'
                                    />
                                </div>
                            </div>

                            <table className='min-w-[550px] md:min-w-[600px] w-full m-auto text-left text-added-text-secondary outline outline-added-border rounded-md overflow-hidden text-sm md:text-base lg:text-lg xl:text-xl'>
                                <thead className='text-added-text-primary uppercase bg-added-border'>
                                    <tr>
                                        <th
                                            scope='col'
                                            className='p-2.5 text-center'
                                        >
                                            تصویر
                                        </th>
                                        <th
                                            scope='col'
                                            className='p-2.5 text-center'
                                        >
                                            عنوان
                                        </th>
                                        <th
                                            scope='col'
                                            className='p-2.5 text-center'
                                        >
                                            ایمیل
                                        </th>
                                        <th
                                            scope='col'
                                            className='p-2.5 text-center'
                                        >
                                            تاریخ افزودن
                                        </th>
                                        <th
                                            scope='col'
                                            className='p-2.5 text-center'
                                        >
                                            ویرایش/حذف
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Customers.map(customer => {
                                        const productDate = customer[1].Date
                                        const PersianDateParts = new Intl.DateTimeFormat("fa-IR").formatToParts(
                                            new Date(productDate)
                                        )
                                        const PersianMonthWord =
                                            persianMonths[
                                                Number(_removePersianDigitsAndSeparators(PersianDateParts[2].value)) - 1
                                            ]
                                        return (
                                            <tr
                                                key={customer[0]}
                                                className='bg-added-bg-secondary hover:bg-added-bg-primary'
                                            >
                                                <td className='text-center p-2.5'>
                                                    <img
                                                        src={customer[1].ImgSrce}
                                                        alt='product'
                                                        className='aspect-square w-10'
                                                    />
                                                </td>
                                                <th
                                                    scope='row'
                                                    className='text-center p-2.5 font-medium text-added-text-primary/75 whitespace-nowrap '
                                                >
                                                    {customer[1].Name}
                                                </th>
                                                <td className='text-center p-2.5 dir-ltr'>{customer[1].Email}</td>
                                                <td className='text-center p-2.5'>
                                                    <small>{PersianDateParts[4].value.padStart(2, "۰")}</small>/
                                                    <small>{PersianMonthWord}</small>/<small>{PersianDateParts[0].value}</small>
                                                </td>
                                                <td className='text-center p-2.5'>
                                                    <div className='flex items-center gap-1 justify-center'>
                                                        <div
                                                            onClick={() => {
                                                                setSelectedCustomer({ job: "EDIT", target: customer })
                                                            }}
                                                            className='lg:w-9 lg:pt-1.5 lg:pr-2 aspect-square md:pt-[5px] md:w-7 md:pr-[5px] p-1 w-6 pr-[5px] rounded-full bg-added-main border border-added-main hover:bg-transparent hover:text-added-main cursor-pointer text-added-bg-primary transition-all duration-300'
                                                        >
                                                            <RiEdit2Line className='text-inherit lg:text-xl' />
                                                        </div>
                                                        <div
                                                            onClick={() => {
                                                                setSelectedCustomer({ job: "DELETE", target: customer })
                                                            }}
                                                            className='lg:w-9 lg:pt-1.5 lg:pr-2 aspect-square md:pt-[5px] md:w-7 md:pr-[5px] p-1 w-6 rounded-full bg-added-main border border-added-main hover:bg-transparent hover:text-added-main cursor-pointer text-added-bg-primary transition-all duration-300'
                                                        >
                                                            <RiDeleteBin2Line className='text-inherit lg:text-xl' />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className='text-center pb-10'>
                            <span className='border-b border-added-main inline-block mb-2 pb-1.5 md:text-lg lg:text-xl'>
                                درحال حاضر کاربری موجود نمی باشد!
                            </span>
                            <br />
                            <span className='text-xs text-added-text-secondary md:text-base lg:text-lg'>
                                بروزرسانی را امتحان کنید
                            </span>
                        </div>
                    )}
                </div>
            </div>
            {selectedCustomer.job !== "IDLE" ? (
                <Portal>
                    <div className='relative p-4 w-full max-w-md max-h-full'>
                        <div className='relative bg-added-bg-primary rounded-lg shadow-md shadow-added-border'>
                            <button
                                type='button'
                                className='absolute top-3 end-2.5 bg-transparent hover:bg-added-border rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center group'
                                data-modal-hide='popup-modal'
                                onClick={() => setSelectedCustomer(prv => ({ ...prv, job: "IDLE" }))}
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
                                    {selectedCustomer.job === "DELETE" ? (
                                        <RiDeleteBin2Line className='text-4xl text-inherit' />
                                    ) : (
                                        <RiEdit2Line className='text-4xl text-inherit' />
                                    )}
                                </div>
                                <h3 className='mb-5 text-lg font-normal text-added-text-primary'>
                                    {selectedCustomer.job === "DELETE"
                                        ? "آیا از حذف کاربر مورد نظر  اطمینان دارید؟"
                                        : "کاربر مورد نظر را ویرایش کنید"}
                                </h3>
                                {selectedCustomer.job === "EDIT" ? (
                                    <div className='mb-5 border rounded border-added-border p-2'></div>
                                ) : null}
                                {selectedCustomer.job === "DELETE" ? (
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
                                    onClick={() => setSelectedCustomer(prv => ({ ...prv, job: "IDLE" }))}
                                >
                                    {selectedCustomer.job === "DELETE" ? "نه، پشیمون شدم" : "نه، بیخیال"}
                                </button>
                            </div>
                        </div>
                    </div>
                </Portal>
            ) : null}
        </OutLetParent>
    )
}
export default Customers
