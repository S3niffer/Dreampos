import L_logo from "../assets/Pics/logo.png"
import D_logo from "../assets/Pics/logo(Dark).png"
import sD_logo from "../assets/Pics/logo-small(Dark).png"
import sL_logo from "../assets/Pics/logo-small.png"
import { useSelector } from "react-redux"
import { Get_Theme } from "../Apps/Slices/Theme"
import { Link, useLocation } from "react-router-dom"

const Logo = ({ className, small }: { className?: string; small?: boolean }) => {
    const Theme = useSelector(Get_Theme)
    const { pathname } = useLocation()

    const lightLogoAddress = small ? sL_logo : L_logo
    const darkLogoAddress = small ? sD_logo : D_logo

    return (
        <Link to={pathname.includes("/sign") ? pathname : "/"}>
            <img
                src={Theme === "dark" ? darkLogoAddress : lightLogoAddress}
                alt='logo'
                className={className + ` cursor-pointer transition-all duration-300 ${small ? 'hover:scale-[1.75] scale-150' : 'hover:scale-105'}`}
            />
        </Link>
    )
}
export default Logo
