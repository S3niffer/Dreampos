import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5"
import { useDispatch, useSelector } from "react-redux"
import { Get_Theme, ThemeChanger as ThemeChangerHandler } from "../Apps/Slices/Theme"
import IconeBox from "./IconeBox"

const ThemeChanger = ({ className, IconClass }: { className?: string; IconClass?: string }) => {
    const Theme = useSelector(Get_Theme)
    const dispatch = useDispatch()

    return (
        <IconeBox
            onClick={() => {
                if (Theme === "dark") {
                    dispatch(ThemeChangerHandler("light"))
                } else {
                    dispatch(ThemeChangerHandler("dark"))
                }
            }}
            className={className}
        >
            {Theme === "light" ? <IoMoonOutline className={IconClass} /> : <IoSunnyOutline className={IconClass} />}
        </IconeBox>
    )
}
export default ThemeChanger
