import { RiDashboard2Line } from "react-icons/ri"
import { LuPackage } from "react-icons/lu"

const SideBar = () => {
    return (
        <div className='dir-rtl'>
            <div className='flex flex-col pt-3 px-0 gap-1.5 text-added-text-secondary'>
                <div className='p-2 pr-2 flex gap-2 items-center hover:bg-added-text-primary hover:text-added-bg-primary group cursor-pointer rounded-bl-3xl rounded-tl-3xl'>
                    <RiDashboard2Line className='text-2xl text-inherit' />
                    <span>صفحه اصلی</span>
                </div>
                <div className='p-2 pr-2 flex gap-2 items-center hover:bg-added-text-primary hover:text-added-bg-primary group cursor-pointer rounded-bl-3xl rounded-tl-3xl'>
                    <LuPackage className='text-2xl text-inherit' />
                    <span>محصولات</span>
                </div>
            </div>
        </div>
    )
}
export default SideBar
