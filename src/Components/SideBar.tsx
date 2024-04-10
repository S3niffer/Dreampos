import { RiDashboard2Line } from "react-icons/ri"
import { LuLogOut, LuPackage, LuPackagePlus, LuShirt, LuUser, LuUserPlus } from "react-icons/lu"
import SideBarLink from "./SideBarLink"

const SideBar = () => {

    return (
        <div className={`h-[calc(100vh-var(--topBarHeight))] text-added-text-secondary sideBarContainer`}>
            <div className='dir-ltr overflow-y-auto h-[calc(100%-60px)]'>
                <div className='dir-rtl flex flex-col gap-1.5 pt-1.5 sm:pt-2'>
                    <SideBarLink
                        Icon={RiDashboard2Line}
                        title='صفحه اصلی'
                        to={"/"}
                    />
                    <SideBarLink
                        Icon={LuPackage}
                        title='محصولات'
                        to={"/products"}
                    />
                    <SideBarLink
                        Icon={LuPackagePlus}
                        title='اضافه کردن محصول'
                        to={"/add-product"}
                    />
                    <SideBarLink
                        Icon={LuUser}
                        title='کاربران'
                        to={"/users-list"}
                    />
                    <SideBarLink
                        Icon={LuUserPlus}
                        title='اضافه کردن کاربر'
                        to={"/add-user"}
                    />
                    <SideBarLink
                        Icon={LuShirt}
                        title='پروفایل من'
                        to={"/profile"}
                    />
                </div>
            </div>
            <div className='h-[60px] border-t-2 border-t-added-border  flex flex-col justify-center'>
                <div className='p-2 pr-2 flex gap-2 items-center hover:bg-added-text-primary/80 hover:text-added-bg-primary cursor-pointer  rounded-bl-3xl rounded-tl-3xl group transition-all duration-300 '>
                    <LuLogOut className='text-2xl text-inherit' />
                    <span>{"خروج"}</span>
                </div>
            </div>
        </div>
    )
}
export default SideBar
