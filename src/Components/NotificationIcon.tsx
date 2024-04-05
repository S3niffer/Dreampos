import { RiNotification3Line } from "react-icons/ri"
import IconeBox from "./IconeBox"

const NotificationIcon = ({ className, IconClass }: { className?: string; IconClass?: string }) => {
    return (
        <IconeBox className={className}>
            <RiNotification3Line className={IconClass} />
        </IconeBox>
    )
}
export default NotificationIcon
