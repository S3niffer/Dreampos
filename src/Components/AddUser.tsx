import { useSelector } from "react-redux"
import { Get_UserINFo } from "../Apps/Slices/User"
import UploadSVG from "../assets/Pics/upload.svg"
import { useState } from "react"
import { FiEye, FiEyeOff } from "react-icons/fi"

const AddUser = () => {
    const the_Date = new Date()
    const UserInfo = useSelector(Get_UserINFo)
    const userID = (UserInfo.user as I_UserInLocal).Id
    const [passwordVisibility, setPasswordVisibility] = useState(false)

    return (
        <div className='p-4 md:p-5 lg:p-7'>
            <div className='text-sm md:text-base lg:text-lg'>
                افزودن کاربر {""}
                <br />
                <span className='text-added-text-secondary text-xs md:text-sm lg:text-base'>کابر جدید را اضافه کنید</span>
            </div>

            <div className='bg-added-bg-secondary rounded-md shadow-sm p-2 md:p-4 lg:p-6 mt-5 md:mt-7 lg:mt-10 border border-added-border'>
                <form>
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
                            />
                        </div>
                        <div className='flex flex-col gap-2.5 p-1'>
                            <label
                                htmlFor='getCustomerPassword1'
                                className='cursor-pointer'
                            >
                                رمزعبور
                            </label>
                            <div className='logininputContainer border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 bg-added-bg-secondary focus:border-added-main relative'>
                                <input
                                    type={passwordVisibility ? "text" : "password"}
                                    className='outline-none w-[90%] h-full'
                                    id='getCustomerPassword1'
                                    placeholder='رمزعبور کاربر را وارد کنید'
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
                                htmlFor='getCustomerPassword2'
                                className='cursor-pointer'
                            >
                                تکرار رمزعبور
                            </label>
                            <div className='logininputContainer border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 bg-added-bg-secondary focus:border-added-main relative'>
                                <input
                                    type={passwordVisibility ? "text" : "password"}
                                    className='outline-none w-[90%] h-full'
                                    id='getCustomerPassword2'
                                    placeholder='رمزعبور کاربر دوباره را وارد کنید'
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
                                value={String(new Intl.DateTimeFormat("fa-IR").format(the_Date))}
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
                            >
                                <input
                                    type='file'
                                    className='hidden'
                                    id='getCustomerImage'
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
                                <img
                                    src={UploadSVG}
                                    className='w-full h-full'
                                    alt='product'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='mt-4 flex justify-between items-center'>
                        <button className='bg-added-text-secondary hover:bg-added-text-primary/90 text-white rounded-md p-2'>
                            پاک کردن ورودی ها
                        </button>
                        <button
                            className='transition-all duration-300 bg-added-main border border-added-main hover:bg-added-bg-secondary
                        hover:text-added-main text-white rounded-md p-2 w-28'
                        >
                            ارسال
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default AddUser
