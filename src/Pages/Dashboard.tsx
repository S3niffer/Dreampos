import { useState } from "react"
import TopBar from "../Components/TopBar"
import SideBar from "../Components/SideBar"
import { Outlet } from "react-router-dom"

const Dashboard = () => {
    const [sideBar, setSideBar] = useState(false)

    return (
        <div className='relative'>
            <div className={`sticky top-0 w-full bg-added-bg-secondary z-50 h-topBarHeight shadow`}>
                <TopBar
                    setSideBar={setSideBar}
                    sideBar={sideBar}
                />
            </div>
            <div className='flex relative'>
                <div
                    className={`w-sideBarWidth fixed md:sticky bg-added-bg-secondary transition-all duration-300 bottom-0 shadow-lg z-40 ${
                        sideBar ? "right-0" : `-right-sideBarWidth`
                    }`}
                >
                    <SideBar />
                </div>

                <Outlet />
            </div>
        </div>
    )
}
export default Dashboard
