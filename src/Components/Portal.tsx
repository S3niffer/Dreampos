import React from "react"
import ReactDOM from "react-dom"

const Portal = ({ children, closePortal }: { children: React.ReactNode; closePortal?: () => void }) => {
    const ModalTag = document.getElementById("modal") as HTMLDivElement

    const portalTag = (
        <div className='relative'>
            <div
                className='absolute top-0 left-0 h-screen w-screen z-[999] backdrop-blur-sm flex justify-center items-center'
                onClick={e => {
                    if (!closePortal) return

                    if (e.target === e.currentTarget) {
                        closePortal()
                    }
                }}
            >
                {children}
            </div>
        </div>
    )

    return ReactDOM.createPortal(portalTag, ModalTag)
}
export default Portal
