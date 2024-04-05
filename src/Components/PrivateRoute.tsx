import { ReactNode } from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { Get_UserINFo } from "../Apps/Slices/User"

const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const { user } = useSelector(Get_UserINFo)

    if (Object.keys(user).includes("Email")) {
        return children
    } else return <Navigate to={"/signin"} />
}
export default PrivateRoute
