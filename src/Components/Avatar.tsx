import IconeBox from "./IconeBox"
import avatarPic from "../assets/Pics/avator1.jpg"

const Avatar = ({ className }: { className?: string }) => {
    return (
        <IconeBox className={className}>
            <img
                src={avatarPic}
                alt='Avatar'
                className='h-full w-full'
            />
        </IconeBox>
    )
}
export default Avatar
