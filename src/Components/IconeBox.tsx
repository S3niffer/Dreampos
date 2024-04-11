const IconeBox = ({ children, onClick, className }: React.ComponentProps<"div">) => {
    return (
        <div
            className={
                "border sm:border-2 border-added-border rounded-lg aspect-square flex items-center justify-center cursor-pointer  hover:border-added-main transition-all duration-300 group-hover:border-added-main " +
                className
            }
            onClick={onClick}
        >
            {children}
        </div>
    )
}
export default IconeBox
