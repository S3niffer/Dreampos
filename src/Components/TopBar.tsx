import { RiCloseFill, RiMenuFoldLine } from "react-icons/ri"
import Logo from "./Logo"
import ThemeChanger from "./ThemeChanger"
import NotificationIcon from "./NotificationIcon"
import Avatar from "./Avatar"

const TopBar = ({ sideBar, setSideBar }: { sideBar: boolean; setSideBar: (value: React.SetStateAction<boolean>) => void }) => {
    return (
        <div className='flex justify-between items-center h-topBarHeight px-2 min-[450px]:px-5'>
            <div className='md:hidden w-1/3'>
                {sideBar ? (
                    <RiCloseFill
                        onClick={() => setSideBar(prv => !prv)}
                        className='aspect-square text-xl min-[450px]:text-2xl text-added-main cursor-pointer'
                    />
                ) : (
                    <RiMenuFoldLine
                        onClick={() => setSideBar(prv => !prv)}
                        className='aspect-square text-xl min-[450px]:text-2xl text-added-main cursor-pointer'
                    />
                )}
            </div>

            <div className='h-7 md:h-9 lg:h-10'>
                <Logo className='hidden sm:block h-full' />
                <Logo
                    className='sm:hidden h-full'
                    small
                />
            </div>
            <div className='flex items-center justify-end gap-2 w-1/3'>
                <ThemeChanger
                    className='w-5 min-[450px]:w-6 sm:w-7 md:w-9 lg:w-10 xl:w-13'
                    IconClass='sm:text-lg md:text-xl'
                />
                <NotificationIcon
                    className='w-5 min-[450px]:w-6 sm:w-7 md:w-9 lg:w-10 xl:w-13'
                    IconClass='sm:text-lg md:text-xl'
                />
                <Avatar className='w-5 min-[450px]:w-6 sm:w-7 md:w-9 lg:w-10 xl:w-13 overflow-hidden' />
                <span className='hidden sm:block text-[0.7rem] leading-[0.7rem] md:text-[0.75rem] md:leading-[0.8rem] lg:text-[0.85rem] lg:leading-4  xl:text-[0.9rem] xl:leading-[1.2rem]'>
                    <span className='text-[0.6rem] md:text-[0.7rem] lg:text-[0.75rem] xl:text-[0.78rem] text-added-text-secondary'>
                        خوش آمدید
                    </span>
                    <br />
                    محمد عرفان حیدر
                </span>
            </div>
        </div>
    )
}
export default TopBar
