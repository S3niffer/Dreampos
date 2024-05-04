import Portal from "./Portal"

const ImagePortal = ({ imageSrc, _CloseHandler }: { imageSrc: string; _CloseHandler: () => void }) => {
    return (
        <Portal closePortal={_CloseHandler}>
            <div className='relative'>
                <div className='relative bg-added-bg-primary rounded-lg shadow-md shadow-added-border max-w-full max-h-[calc(100vh-16px)] my-auto overflow-y-auto px-4'>
                    <button
                        type='button'
                        className='absolute top-3 end-2.5 bg-transparent hover:bg-added-border rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center group'
                        data-modal-hide='popup-modal'
                        onClick={_CloseHandler}
                    >
                        <svg
                            className='w-3 h-3 text-added-text-secondary group-hover:text-added-main'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 14 14'
                        >
                            <path
                                stroke='currentColor'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                            />
                        </svg>
                        <span className='sr-only'>Close modal</span>
                    </button>
                    <div className='mt-12'>
                        <img
                            src={imageSrc}
                            alt='pic'
                            className='h-60 md:h-96 mb-4 aspect-square object-fill border-2 border-added-main rounded-md'
                        />
                    </div>
                </div>
            </div>
        </Portal>
    )
}
export default ImagePortal
