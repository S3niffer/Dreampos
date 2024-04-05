import { useDispatch, useSelector } from "react-redux"
import { Get_Theme, ThemeChanger } from "../Apps/Slices/Theme"
import { useEffect, useState } from "react"

const ThemeHandler = () => {
    const [TimesRendere, addRender] = useState<number>(1)
    const Theme = useSelector(Get_Theme)
    const dispatch = useDispatch()

    useEffect(() => {
        const localStorageValue = localStorage.getItem("theme")
        if (localStorageValue) {
            const new_Theme = localStorageValue as T_Theme
            dispatch(ThemeChanger(new_Theme))
        } else {
            localStorage.setItem("theme", Theme)
        }
    }, [])
    useEffect(() => {
        if (TimesRendere !== 1) {
            localStorage.setItem("theme", Theme)
        }

        addRender(prv => ++prv)
        if (Theme === "dark") {
            document.children[0].setAttribute("dark", "")
        } else {
            document.children[0].removeAttribute("dark")
        }
    }, [Theme])

    return null
}
export default ThemeHandler
