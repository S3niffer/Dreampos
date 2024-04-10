import { IconType } from "react-icons"
import { NavLink } from "react-router-dom"

const SideBarLink = ({ Icon, title, to }: { Icon: IconType; title: string } & React.ComponentProps<typeof NavLink>) => {
    return (
        <NavLink
            className={link => `SideBarLinks ${link.isActive ? 'active' : 'inActive'}`}
            to={to}
        >
            <div className='p-2 pr-2 flex gap-2 items-center hover:bg-added-text-primary/80 hover:text-added-bg-primary cursor-pointer  rounded-bl-3xl rounded-tl-3xl transition-all duration-300 '>
                <Icon className='text-2xl text-inherit' />
                <span>{title}</span>
            </div>
        </NavLink>
    )
}
export default SideBarLink
