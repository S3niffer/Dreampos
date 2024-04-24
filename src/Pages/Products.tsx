import { useDispatch, useSelector } from "react-redux"
import { Get_Products, GettAllProducts } from "../Apps/Slices/Products"
import { UnknownAction } from "@reduxjs/toolkit"
import OutLetParent from "../Components/OutLetParent"
import { IoRefresh } from "react-icons/io5"
import { LuClock } from "react-icons/lu"
import { formatDistanceToNow } from "date-fns-jalali"

function TimeAgo({ date }: { date: Date }) {
    const timeAgo = formatDistanceToNow(new Date(date))

    return <span> {timeAgo} پیش اضافه شده</span>
}

const Products = () => {
    const Dispatch = useDispatch()
    const Products = useSelector(GettAllProducts)
    const _GetProducts_Handler = () => {
        Dispatch(Get_Products() as unknown as UnknownAction)
    }

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
                        <IoRefresh className='text-inherit' />
                        بروزرسانی
                    </button>
                </div>
                <div className='mt-8'>
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
                                        <div className='px-2 py-2 cursor-default'>
                                            <div className='font-semibold text-lg inline-block hover:text-added-main transition duration-500 ease-in-out'>
                                                {product[1].Name}
                                            </div>
                                            <p className='text-gray-500 text-sm'>
                                                {product[1].Price.toLocaleString("fa-IR") + " "}تـومان
                                            </p>
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
                        <div className='text-center'>
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
        </OutLetParent>
    )
}
export default Products
