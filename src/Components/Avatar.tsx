import IconeBox from "./IconeBox"
import DefaultAvatar from "../assets/Pics/Default Avatar.png"
import { LuLogOut, LuShirt } from "react-icons/lu"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import Portal from "./Portal"
import { Get_UserINFo, LogOut } from "../Apps/Slices/User"

const Avatar = ({ className }: { className?: string }) => {
    const [isPortalActive, setIsPortalActive] = useState(false)
    const Dispatch = useDispatch()
    const UserInfo = useSelector(Get_UserINFo)
    const User = UserInfo.user as I_UserInLocal

    return (
        <div className='flex items-center  gap-2 hover:bg-added-border cursor-pointer rounded-lg group relative'>
            <IconeBox className={className}>
                <img
                    src={User.ImgSrc ? User.ImgSrc : DefaultAvatar}
                    alt='Avatar'
                    className='h-full w-full'
                />
            </IconeBox>
            <span className='hidden sm:block text-[0.7rem] leading-[0.7rem] md:text-[0.75rem] md:leading-[0.8rem] lg:text-[0.85rem] lg:leading-4  xl:text-[0.9rem] xl:leading-[1.2rem] pl-2'>
                <span className='text-[0.6rem] md:text-[0.7rem] lg:text-[0.75rem] xl:text-[0.78rem] text-added-text-secondary block pb-1.5'>
                    خوش آمدید
                </span>
                {User.Name}
            </span>
            <div className='absolute opacity-0 -left-1 top-4 -z-50 hidden group-hover:block transition-all duration-300 group-hover:opacity-100 group-hover:z-0 sm:top-6 md:top-8 md:left-12 md:w-full lg:top-10 xl:top-11 lg:left-9'>
                <div className='bg-transparent w-20 pt-2 p-1 min-[450px]:w-24 sm:w-36 md:w-48 '>
                    <div className='bg-added-bg-secondary rounded-sm shadow-md shadow-added-border flex flex-col overflow-hidden'>
                        <Link
                            to={"/profile"}
                            className='flex items-center gap-1.5 hover:bg-added-border p-1.5 md:p-2 lg:p-2.5'
                        >
                            <LuShirt className='text-xs sm:text-lg md:text-xl lg:text-2xl xl:text-3xl' />
                            <span className='text-[0.5rem] sm:text-xs md:text-sm lg:text-base xl:text-lg'>پروفایل من</span>
                        </Link>
                        <div
                            onClick={() => setIsPortalActive(true)}
                            className='flex items-center gap-1.5 text-red-600 hover:bg-added-border p-1.5 md:p-2 lg:p-2.5'
                        >
                            <LuLogOut className='text-xs text-inherit sm:text-lg md:text-xl lg:text-2xl xl:text-3xl' />
                            <span className='text-[0.5rem] sm:text-xs md:text-sm lg:text-base xl:text-lg'>خروج</span>
                        </div>
                    </div>
                </div>
            </div>
            {isPortalActive ? (
                <Portal>
                    <div className='relative p-4 w-full max-w-md max-h-full'>
                        <div className='relative bg-added-bg-primary rounded-lg shadow-md shadow-added-border'>
                            <button
                                type='button'
                                className='absolute top-3 end-2.5 bg-transparent hover:bg-added-border rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center group'
                                data-modal-hide='popup-modal'
                                onClick={() => setIsPortalActive(false)}
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
                                <div className='h-12 flex items-center justify-center'>
                                    <LuLogOut className='text-4xl' />
                                </div>
                                <h3 className='mb-5 text-lg font-normal text-added-text-primary'>
                                    آیا مطمئن هستید که میخواهید خارج شوید؟
                                </h3>
                                <button
                                    data-modal-hide='popup-modal'
                                    type='button'
                                    className='text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center'
                                    onClick={() => Dispatch(LogOut())}
                                >
                                    بله کاملا
                                </button>
                                <button
                                    data-modal-hide='popup-modal'
                                    type='button'
                                    className='py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
                                    onClick={() => setIsPortalActive(false)}
                                >
                                    نه، پشیمون شدم
                                </button>
                            </div>
                        </div>
                    </div>
                </Portal>
            ) : null}
        </div>
    )
}
export default Avatar
