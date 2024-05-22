import { Link } from "react-router-dom"
import error404Pic from "../assets/Pics/error-404.png"
const Error404 = () => {
    return (
        <div className='h-screen w-screen overflow-hidden flex justify-center flex-col items-center px-2 gap-1 bg-added-bg-primary'>
            <img
                src={error404Pic}
                alt='error404'
                className='w-5/12  lg:w-auto'
            />
            <div className='text-center grid grid-rows-3 mt-2 sm:gap-y-1.5 lg:gap-y-3'>
                <p className='font-bold sm:text-lg md:text-2xl lg:text-3xl'>عه! یه جای کار میلنگه </p>
                <p className='text-added-text-secondary text-sm sm:text-base sm:mb-2 md:text-xl lg:text-2xl lg:mb-3'>
                    متاسفانه صفحه مورد نظر پیدا نشد
                </p>
                <div>
                    <Link
                        to={"/"}
                        className='bg-added-main text-white rounded-md px-1.5 py-0.5 transition-all duration-300 hover:bg-[#ff8d1f] text-xs sm:text-base md:text-xl lg:text-2xl'
                    >
                        صفحه اصلی
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default Error404
