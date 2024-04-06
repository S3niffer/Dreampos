import loginPic from "../Assets/Pics/login.jpg"
import { HiOutlineMail } from "react-icons/hi"
import { FiEye, FiEyeOff, FiLock, FiX } from "react-icons/fi"
import { useEffect, useState } from "react"
import ThemeChanger from "../Components/ThemeChanger"
import Logo from "../Components/Logo"
import InputTag from "../Components/InputTag"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { ChangeStatus, GetUsers, Get_UserINFo, LogIn } from "../Apps/Slices/User"
import { UnknownAction } from "@reduxjs/toolkit"
import { TiTickOutline } from "react-icons/ti"
import Portal from "../Components/Portal"
import { MdErrorOutline } from "react-icons/md"

const Login = () => {
    const [passwordVisibility, setPasswordVisibility] = useState(false)

    const [loginParameters, setLoginParameters] = useState<I_UserLoginParameter>({ Email: "", Password: "" })

    const [formIsValid, setFormIsValid] = useState<boolean>(false)
    const [isShowModal, setIsShowModal] = useState<boolean>(false)

    const Dispatch = useDispatch()
    const UserState = useSelector(Get_UserINFo)

    // checking the form inputs and change the status of formIsValid
    const _FormChangerHandler = (e: React.FormEvent<HTMLFormElement>) => {
        if (
            (e.target as HTMLFormElement).form.elements[0].value === "" ||
            (e.target as HTMLFormElement).form.elements[1].value.length < 8
        ) {
            setFormIsValid(false)
        } else {
            setFormIsValid(true)
        }
    }

    // just getting the users
    const _LoginHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!formIsValid) return

        setIsShowModal(true)
        Dispatch(GetUsers() as unknown as UnknownAction)
    }

    // checking for status
    useEffect(() => {
        if (UserState.status.value === "Users_Saved") {
            Dispatch(LogIn({ Email: loginParameters.Email, Password: loginParameters.Password }))
        }
    }, [UserState.status])

    return (
        <>
            <div className='login flex'>
                <div className='flex-1 bg-added-bg-primary p-6 pt-9 pb-2 min-h-screen'>
                    <div className='flex justify-between items-center h-10'>
                        <Logo className='w-40' />
                        <ThemeChanger className='w-7 scale-125 md:scale-150' />
                    </div>
                    <div className='mt-8 text-2xl'>ورود</div>
                    <span className='block mt-6 text-added-text-secondary'>لطفا وارد حساب کاربری خود شوید</span>
                    <form
                        onSubmit={_LoginHandler}
                        onChange={_FormChangerHandler}
                    >
                        <InputTag
                            label='ایمیل'
                            name='email'
                            type='email'
                            Icon={HiOutlineMail}
                            placeholder='ایمیل خودتون را وارد کنید'
                            maxLength={30}
                            onChange={e => {
                                setLoginParameters((prv): I_UserLoginParameter => {
                                    return {
                                        ...prv,
                                        Email: e.target.value,
                                    }
                                })
                            }}
                            value={loginParameters.Email}
                        />
                        <InputTag
                            label='رمزعبور'
                            name='passowrd'
                            type={passwordVisibility ? "text" : "password"}
                            Icon={passwordVisibility ? FiEye : FiEyeOff}
                            placeholder='رمزعبور خودتون را وارد کنید'
                            max={16}
                            minLengthCondition={8}
                            FunctionOnIcon={() => setPasswordVisibility(prv => !prv)}
                            onChange={e => {
                                setLoginParameters((prv): I_UserLoginParameter => {
                                    return {
                                        ...prv,
                                        Password: e.target.value,
                                    }
                                })
                            }}
                            value={loginParameters.Password}
                        />
                        <button
                            type='submit'
                            className={`w-full border rounded-md p-2.5 mt-4  transition-all duration-500 cursor-pointer ${
                                formIsValid
                                    ? "text-white border-added-main bg-added-main hover:bg-added-bg-secondary hover:text-added-main"
                                    : "bg-added-border border-added-border text-added-text-primary"
                            } `}
                            disabled={!formIsValid}
                        >
                            <span className='flex items-center justify-center gap-1'>
                                ورود
                                {formIsValid ? null : <FiLock />}
                            </span>
                        </button>
                        <div className='mt-6'>
                            حساب کاربری نداری؟
                            <Link
                                to={"/signup"}
                                className='text-added-main'
                            >
                                {" "}
                                از اینجا{" "}
                            </Link>
                            یکی بساز!
                        </div>
                    </form>
                </div>
                <img
                    src={loginPic}
                    className='hidden lg:block w-[60%] min-h-screen'
                ></img>
            </div>
            {isShowModal ? (
                <Portal>
                    <div className='relative p-4 w-full max-w-md max-h-full'>
                        <div className='relative bg-added-bg-primary rounded-lg shadow'>
                            <button
                                type='button'
                                className='absolute top-3 end-2.5 bg-transparent hover:bg-added-border rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center group'
                                data-modal-hide='popup-modal'
                                onClick={() => {
                                    setIsShowModal(false)
                                    if (UserState.status.value === "NotFound") {
                                        Dispatch(ChangeStatus("Idle"))
                                        setLoginParameters({ Email: "", Password: "" })
                                        setFormIsValid(false)
                                    }
                                    if (UserState.status.value === "InValidPassword") {
                                        Dispatch(ChangeStatus("Idle"))
                                        setLoginParameters(prv => ({ ...prv, Password: "" }))
                                        setFormIsValid(false)
                                    }
                                }}
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
                            <div className='p-4 md:p-5  text-center'>
                                <div role='status'>
                                    {UserState.status.value === "Logged_In" ? (
                                        <TiTickOutline className='inline w-14 h-14 text-added-border fill-green-600' />
                                    ) : UserState.status.value === "NotFound" ? (
                                        <MdErrorOutline className='inline w-14 h-14 text-added-border fill-yellow-500' />
                                    ) : UserState.status.value === "InValidPassword" ? (
                                        <FiX className='inline w-14 h-14 text-red-600' />
                                    ) : (
                                        <svg
                                            aria-hidden='true'
                                            className='inline w-12 aspect-square text-added-border animate-spin fill-added-main'
                                            viewBox='0 0 100 101'
                                            fill='none'
                                            xmlns='http://www.w3.org/2000/svg'
                                        >
                                            <path
                                                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                                                fill='currentColor'
                                            />
                                            <path
                                                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                                                fill='currentFill'
                                            />
                                        </svg>
                                    )}
                                    <span className='sr-only'>Loading...</span>
                                </div>
                                <h3 className='text-lg font-normal text-added-text-primary mt-3'>{UserState.status.message}</h3>
                            </div>
                        </div>
                    </div>
                </Portal>
            ) : null}
        </>
    )
}
export default Login
