import { useLocation, useNavigate } from "react-router-dom"
import ThemeHandler from "./Components/ThemeHandler"
import RouteProvider from "./Routes"
import { useDispatch, useSelector } from "react-redux"
import { Get_UserINFo, LogintUserByID } from "./Apps/Slices/User"
import { useEffect, useState } from "react"
import { UnknownAction } from "@reduxjs/toolkit"
import Loading from "./Components/Loading"

function App() {
    const location = useLocation()
    const userInfo = useSelector(Get_UserINFo)
    const Navigate = useNavigate()
    const Dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!Object.keys(userInfo.user).includes("Email") && userInfo.status.value !== "Logged_In") return

        if (location.pathname.includes("sign")) {
            Navigate("/")
        }
    }, [userInfo, location])

    useEffect(() => {
        const getUserID_fromLocal = localStorage.getItem("userID")
        const userID = getUserID_fromLocal ? (JSON.parse(getUserID_fromLocal) as string) : undefined
        const isLogggedIn = Object.keys(userInfo.user).includes("Email")

        if (!isLogggedIn && userID) {
            setIsLoading(true)
            Dispatch(LogintUserByID({ id: userID, setIsLoading }) as unknown as UnknownAction)
        }
    }, [])

    return (
        <div className='font-irSans text-added-text-primary dir-rtl'>
            <ThemeHandler />
            {isLoading ? <Loading /> : <RouteProvider />}
        </div>
    )
}

export default App
