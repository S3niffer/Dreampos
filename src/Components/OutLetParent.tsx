import { ComponentProps, ReactNode } from "react"

const OutLetParent = (props: ComponentProps<"div"> & { children: ReactNode; DRef?: React.LegacyRef<HTMLDivElement> }) => {
    return (
        <div
            className={`dir-ltr overflow-auto h-[calc(100vh-var(--topBarHeight))] bg-added-bg-primary w-full md:w-[calc(100vw-var(--sideBarWidth))]
                    `}
            ref={props.DRef}
        >
            <div className='dir-rtl text-right relative'>{props.children}</div>
        </div>
    )
}
export default OutLetParent
