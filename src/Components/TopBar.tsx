import { RiCloseFill, RiMenuFoldLine } from "react-icons/ri"
import Logo from "./Logo"
import ThemeChanger from "./ThemeChanger"
import Avatar from "./Avatar"

const TopBar = ({ sideBar, setSideBar }: { sideBar: boolean; setSideBar: (value: React.SetStateAction<boolean>) => void }) => {
    return (
        <div className='flex justify-between items-center h-topBarHeight px-2 min-[450px]:px-5'>
            <div className='md:hidden w-1/3'>
                {sideBar ? (
                    <RiCloseFill
                        onClick={() => setSideBar(prv => !prv)}
                        className='aspect-square text-4xl text-added-main cursor-pointer'
                    />
                ) : (
                    <RiMenuFoldLine
                        onClick={() => setSideBar(prv => !prv)}
                        className='aspect-square text-4xl text-added-main cursor-pointer'
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
                    className='w-9 lg:w-10 xl:w-13'
                    IconClass='text-xl'
                />
                <Avatar className='w-9 lg:w-10 xl:w-13 overflow-hidden' />
            </div>
        </div>
    )
}
export default TopBar
