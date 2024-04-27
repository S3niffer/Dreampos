import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { UnknownAction } from "@reduxjs/toolkit"
import { Get_Customers, GettAllCustomers } from "../Apps/Slices/Customers"
import OutLetParent from "../Components/OutLetParent"
import { IoRefresh } from "react-icons/io5"
import Loading from "../Components/Loading"

const Customers = () => {
    const Dispatch = useDispatch()
    const Customers = useSelector(GettAllCustomers)
    const [isShowLoading, setIsShowLoading] = useState<boolean>(false)
    const [isShowAlert, setIsShowAlert] = useState<{ status: boolean; job: "DELETE" | "EDIT" }>({ status: false, job: "DELETE" })

    const _GetProducts_Handler = () => {
        setIsShowLoading(true)
        const removeLoading = () => {
            setIsShowLoading(false)
        }
        Dispatch(Get_Customers(removeLoading) as unknown as UnknownAction)
    }

    return (
        <OutLetParent>
            <div className='p-4 md:p-5 lg:p-7'>
                <div className='flex items-center justify-between'>
                    <div className='text-sm md:text-base lg:text-lg'>
                        صفحه کاربران {""}
                        <br />
                        <span className='text-added-text-secondary text-xs md:text-sm lg:text-base'>کاربران را مشاهده کنید</span>
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

                    {Customers.length !== 0 ? (
                        "customers"
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
        </OutLetParent>
    )
}
export default Customers
