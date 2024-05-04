import { LuBoxes, LuUsers } from "react-icons/lu"
import OutLetParent from "../Components/OutLetParent"

const Overview = () => {
    return (
        <OutLetParent>
            <div className='flex items-center justify-between p-4 sm:p-6 md:p-8 gap-8 sm:gap-12 md:gap-16 lg:justify-center'>
                <div className='w-[min(50%,200px)] bg-[#ff9f43] rounded-md p-4 px-2 sm:px-4 text-white flex items-center justify-between'>
                    <div className='flex flex-col'>
                        <span className='inline-block text-center font-bold text-lg leading-4'>
                            {(1).toLocaleString("fa-IR")}
                        </span>
                        کاربران
                    </div>
                    <LuUsers className='text-inherit text-5xl' />
                </div>
                <div className='w-[min(50%,200px)] bg-[#28c76f] rounded-md p-4 px-2 sm:px-4  text-white flex items-center justify-between'>
                    <div className='flex flex-col'>
                        <span className='inline-block text-center font-bold text-lg leading-4'>
                            {(1).toLocaleString("fa-IR")}
                        </span>
                        محصولات
                    </div>
                    <LuBoxes className='text-inherit text-5xl' />
                </div>
            </div>
        </OutLetParent>
    )
}
export default Overview
