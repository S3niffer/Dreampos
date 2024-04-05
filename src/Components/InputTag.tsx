const InputTag = ({
    name,
    type,
    placeholder,
    maxLength,
    Icon,
    label,
    FunctionOnIcon,
    value,
    onChange,
    minLengthCondition,
}: T_InputTagProps) => {
    return (
        <div className='my-5 flex flex-col gap-4'>
            <label htmlFor={name + "Input"}>{label}</label>
            <div className='border border-added-border flex justify-between items-center rounded-md p-2.5 bg-added-bg-secondary relative logininputContainer'>
                <input
                    type={type}
                    name={name}
                    id={name + "Input"}
                    className='w-full outline-none bg-transparent text-sm min-[400px]:text-base dir-ltr text-added-text-secondary pt-1'
                    placeholder={placeholder}
                    maxLength={maxLength}
                    value={value}
                    onChange={onChange}
                />
                <div
                    className={`absolute top-1/2 right-3 -translate-y-1/2 text-lg  ${FunctionOnIcon ? " cursor-pointer" : ""}`}
                    onClick={FunctionOnIcon}
                >
                    <Icon />
                </div>
                {value && minLengthCondition ? (
                    value.toString().length < minLengthCondition ? (
                        <span className='absolute top-[108%] text-sm text-red-400'>
                            شما حداقل میبایست
                            {" " + minLengthCondition + " "}
                            کارکتر در کادر وارد کنید
                        </span>
                    ) : null
                ) : null}
            </div>
        </div>
    )
}
export default InputTag
