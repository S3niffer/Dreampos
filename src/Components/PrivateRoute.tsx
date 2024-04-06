import { ReactNode } from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { Get_UserINFo } from "../Apps/Slices/User"

const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const isLogggedIn = Object.keys(useSelector(Get_UserINFo).user).includes("Email")

    if (isLogggedIn) {
        return children
    } else return <Navigate to={"/signin"} />
}
export default PrivateRoute
