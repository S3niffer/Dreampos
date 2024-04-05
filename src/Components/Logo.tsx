import L_logo from "../assets/Pics/logo.png"
import D_logo from "../assets/Pics/logo(Dark).png"
import sD_logo from "../assets/Pics/logo-small(Dark).png"
import sL_logo from "../assets/Pics/logo-small.png"
import { useSelector } from "react-redux"
import { Get_Theme } from "../Apps/Slices/Theme"
import { Link } from "react-router-dom"

const Logo = ({ className, small }: { className?: string; small?: boolean }) => {
    const Theme = useSelector(Get_Theme)

    const lightLogoAddress = small ? sL_logo : L_logo
    const darkLogoAddress = small ? sD_logo : D_logo

    return (
        <Link to={"/"}>
            <img
                src={Theme === "dark" ? darkLogoAddress : lightLogoAddress}
                alt='logo'
                className={className + " cursor-pointer hover:scale-105 transition-all duration-300"}
            />
        </Link>
    )
}
export default Logo
