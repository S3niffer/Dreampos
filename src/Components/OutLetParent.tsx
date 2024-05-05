import { ComponentProps, ReactNode } from "react"

const OutLetParent = (props: ComponentProps<"div"> & { children: ReactNode; DRef?: React.LegacyRef<HTMLDivElement> }) => {
    return (
        <div
            className={`dir-ltr overflow-auto h-full w-full bg-added-bg-primary
                    `}
            ref={props.DRef}
        >
            <div className='dir-rtl text-right relative'>{props.children}</div>
        </div>
    )
}
export default OutLetParent
