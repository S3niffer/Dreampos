import { Reducer, useEffect, useReducer, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { UnknownAction } from "@reduxjs/toolkit"
import { DeleteCustomer, EditCustomer, Get_Customers, GettAllCustomers } from "../Apps/Slices/Customers"
import OutLetParent from "../Components/OutLetParent"
import { IoRefresh } from "react-icons/io5"
import Loading from "../Components/Loading"
import UploadSVG from "../assets/Pics/upload.svg"
import { RiArrowLeftDoubleFill, RiArrowRightDoubleFill, RiDeleteBin2Line, RiEdit2Line } from "react-icons/ri"
import Portal from "../Components/Portal"
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi"
import { getDownloadURL, uploadBytesResumable, ref } from "firebase/storage"
import { storage } from "../Firebase"
import IconeBox from "../Components/IconeBox"
import ImagePortal from "../Components/ImagePortal"

const Customers = () => {
    const [selectedCustomer, setSelectedCustomer] = useState<EditOrDeleteCustomer>({
        target: null,
        job: "IDLE",
    })
    const Dispatch = useDispatch()
    const Customers = useSelector(GettAllCustomers)
    const [isShowLoading, setIsShowLoading] = useState<boolean>(false)
    const [isShowAlert, setIsShowAlert] = useState<{ status: boolean; job: "DELETE" | "EDIT" }>({ status: false, job: "DELETE" })
    const Page_Ref = useRef<HTMLDivElement>(null)
    const ImageProgress_Ref = useRef(0)
    const [formISvalid, setFormIsvalid] = useState<boolean>(false)
    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const [ImgSrc4ImagePOrtal, setImgSrc4ImagePOrtal] = useState("")
    const persianMonths = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]
    const [CurrentImage, setCurrentImage] = useState<I_CurrentImage>({ link: "", name: "", file: undefined, status: "idle" })
    const [valuesForEdit, setValuesForEdit] = useState<EditCustomer>({ Email: "", ImgSrce: "", Name: "", Password: "" })
    const [PaginationValues, setPaginationValues] = useState<T_PaginationStuff<T_Customers>>({
        ItemsPerPage: 6,
        Page: 1,
        Items: [],
        totalPages: 1,
    })
    const [filterByDateOptions, setFilterByDateOption] = useState<filterByTimeOption>({
        options: [
            { id: 0, text: "روز گذشته", countDay: 1 },
            { id: 1, text: "روز گذشته", countDay: 7 },
            { id: 2, text: "روز گذشته", countDay: 30 },
            { id: 3, text: "فرقی نمیکنه", countDay: null },
        ],
        selectedOptionIndex: 3,
        status: "CLOSE",
    })
    const [filterByText, setFilterByText] = useState("")
    const initialFilterOption: {
        items: T_Customers
        filterBy: "text" | "date" | "both" | "none"
    } = {
        items: [],
        filterBy: "none",
    }
    const FilterOptionHandler: Reducer<
        typeof initialFilterOption,
        { type: `filterBy_${typeof initialFilterOption.filterBy}` }
    > = (state, action) => {
        const filterDateCount = filterByDateOptions.options[filterByDateOptions.selectedOptionIndex].countDay
        switch (action.type) {
            case "filterBy_text":
                return {
                    filterBy: "text",
                    items: [...Customers].filter(item => item[1].Name.includes(filterByText)),
                }
            case "filterBy_date":
                if (filterDateCount === null) {
                    return state
                } else {
                    return {
                        filterBy: "date",
                        items: [...Customers].filter(item => {
                            const ItemDate = new Date(item[1].Date)
                            const TodayDate = new Date()
                            const Diff = Math.abs(ItemDate.getTime() - TodayDate.getTime())
                            const DiffConveredToDayFormat = Math.ceil(Diff / (1000 * 3600 * 24))

                            if (DiffConveredToDayFormat > filterDateCount) {
                                return false
                            } else {
                                return true
                            }
                        }),
                    }
                }
            case "filterBy_both":
                if (filterDateCount === null) {
                    return {
                        filterBy: "text",
                        items: [...Customers].filter(item => item[1].Name.includes(filterByText)),
                    }
                } else {
                    return {
                        filterBy: "both",
                        items: [...Customers]
                            .filter(item => item[1].Name.includes(filterByText))
                            .filter(item => {
                                const ItemDate = new Date(item[1].Date)
                                const TodayDate = new Date()
                                const Diff = Math.abs(ItemDate.getTime() - TodayDate.getTime())
                                const DiffConveredToDayFormat = Math.ceil(Diff / (1000 * 3600 * 24))

                                if (DiffConveredToDayFormat > filterDateCount) {
                                    return false
                                } else {
                                    return true
                                }
                            }),
                    }
                }
            case "filterBy_none":
                return {
                    filterBy: "none",
                    items: [...Customers],
                }
            default:
                return {
                    filterBy: "none",
                    items: [...Customers],
                }
        }
    }
    const [FilterOption, FilterOptionDispatcher] = useReducer(FilterOptionHandler, initialFilterOption)

    const _UploadImageHandler: T_UploadImageHandler = (date, file, setState, progressRef, basketName) => {
        const storageRef = ref(storage, String(`${basketName}/(${date})${file.name}`))
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on(
            "state_changed",
            snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                progressRef = progress

                switch (snapshot.state) {
                    case "paused":
                        setState(prv => ({ ...prv, status: "paused" }))
                        break
                    case "running":
                        setState(prv => ({ ...prv, status: "running" }))
                        break
                    case "canceled":
                    case "error":
                        setState(prv => ({ ...prv, file: undefined, status: "failed" }))
                        break
                }
            },
            error => {
                setState(prv => ({ ...prv, file: undefined, status: "failed" }))
                console.log(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                    const ImageData: T_UploadedImage<typeof basketName> = {
                        status: "unUsed",
                        link: downloadURL,
                        name: `(${date})${file.name}`,
                        kind: `${basketName}`,
                    }
                    setState({ link: downloadURL, name: ImageData.name, file: undefined, status: "idle" })
                    progressRef = 0
                })
            }
        )
    }

    const _GetCustomers_Handler = () => {
        setIsShowLoading(true)
        const removeLoading = () => {
            setIsShowLoading(false)
        }
        Dispatch(Get_Customers(removeLoading) as unknown as UnknownAction)
        FilterOptionDispatcher({ type: "filterBy_none" })
        setFilterByDateOption(prv => ({ ...prv, status: "CLOSE", selectedOptionIndex: 3 }))
        setFilterByText("")
    }

    const _removePersianDigitsAndSeparators = (str: string) => {
        return str.replace(/[۰-۹٫]/g, match => {
            switch (match) {
                case "۰":
                    return "0"
                case "۱":
                    return "1"
                case "۲":
                    return "2"
                case "۳":
                    return "3"
                case "۴":
                    return "4"
                case "۵":
                    return "5"
                case "۶":
                    return "6"
                case "۷":
                    return "7"
                case "۸":
                    return "8"
                case "۹":
                    return "9"
                case "٫":
                    return "."
                default:
                    return ""
            }
        })
    }

    const _DateFormatter = (date: Date): string => {
        return `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date
            .getDate()
            .toString()
            .padStart(2, "0")}_${
            date.getHours() === 0 ? "12am" : date.getHours() > 12 ? date.getHours() - 12 + "pm" : date.getHours() + "am"
        }${date.getMinutes().toString().padStart(2, "0")}min`
    }

    const _DeleteCustomer = () => {
        const _AfterDelete = () => {
            setTimeout(() => {
                setSelectedCustomer(prv => ({ ...prv, job: "IDLE" }))
                setIsShowAlert({ status: true, job: "DELETE" })
                setCurrentImage({ file: undefined, link: "", name: "", status: "idle" })
                _GetCustomers_Handler()
            }, 300)
        }
        if (!selectedCustomer.target) return
        Dispatch(DeleteCustomer({ id: selectedCustomer.target[0], func: _AfterDelete }) as unknown as UnknownAction)
    }

    const _EditCustomer = () => {
        const { ImgSrce, Name, Email, Password } = valuesForEdit
        if (!ImgSrce || !Name || !Email || !Password || !selectedCustomer.target) return

        const newData: T_CustomerInDB = {
            AdminId: selectedCustomer.target[1].AdminId,
            Date: selectedCustomer.target[1].Date,
            Email,
            ImgSrce,
            Name,
            Password,
        }

        const _AfterEdit = () => {
            setTimeout(() => {
                setSelectedCustomer(prv => ({ ...prv, job: "IDLE" }))
                setIsShowAlert({ status: true, job: "EDIT" })
                setCurrentImage({ file: undefined, link: "", name: "", status: "idle" })
                _GetCustomers_Handler()
            }, 300)
        }

        Dispatch(EditCustomer({ id: selectedCustomer.target[0], _func: _AfterEdit, newData }) as unknown as UnknownAction)
    }

    useEffect(() => {
        if (isShowAlert.status) {
            Page_Ref.current?.scrollTo({ top: 0, behavior: "smooth" })
            const FiveSecondsTimeOut = setTimeout(() => {
                setIsShowAlert({ status: false, job: "DELETE" })
            }, 5000)
            return () => clearTimeout(FiveSecondsTimeOut)
        }
    }, [isShowAlert.status])

    useEffect(() => {
        if (!CurrentImage.file) return

        _UploadImageHandler(_DateFormatter(new Date()), CurrentImage.file, setCurrentImage, ImageProgress_Ref.current, "Products")
    }, [CurrentImage.file])

    useEffect(() => {
        if (CurrentImage.link === "" || CurrentImage.name === "") return

        setValuesForEdit(prv => ({ ...prv, ImgSrce: CurrentImage.link }))
    }, [CurrentImage.link, CurrentImage.name])

    useEffect(() => {
        if (valuesForEdit.ImgSrce && valuesForEdit.Name && valuesForEdit.Email && valuesForEdit.Password) {
            setFormIsvalid(true)
        } else {
            setFormIsvalid(false)
        }
    }, [valuesForEdit])

    useEffect(() => {
        if (!FilterOption.items.length) return
        const endPoint = PaginationValues.Page * PaginationValues.ItemsPerPage
        const startPoint = endPoint - PaginationValues.ItemsPerPage
        const totalPages = Math.ceil(FilterOption.items.length / PaginationValues.ItemsPerPage)

        const ordredItems = [...FilterOption.items].slice(startPoint, endPoint)

        if (PaginationValues.Page > totalPages) {
            setPaginationValues(prv => ({ ...prv, Items: ordredItems, totalPages, Page: totalPages }))
        } else {
            setPaginationValues(prv => ({ ...prv, Items: ordredItems, totalPages }))
        }
    }, [FilterOption.items, PaginationValues.Page, PaginationValues.ItemsPerPage])

    useEffect(() => {
        FilterOptionDispatcher({ type: "filterBy_none" })
    }, [Customers])

    useEffect(() => {
        let DateStatus = filterByDateOptions.selectedOptionIndex !== 3 ? true : false
        let TextStatus = filterByText ? true : false

        if (TextStatus && DateStatus) {
            FilterOptionDispatcher({ type: "filterBy_both" })
        } else if (TextStatus) {
            FilterOptionDispatcher({ type: "filterBy_text" })
        } else if (DateStatus) {
            FilterOptionDispatcher({ type: "filterBy_date" })
        } else {
            FilterOptionDispatcher({ type: "filterBy_none" })
        }
    }, [filterByDateOptions.selectedOptionIndex, filterByText])

    return (
        <OutLetParent DRef={Page_Ref}>
            <div className='p-4 md:p-5 lg:p-7'>
                <div className='flex items-center justify-between'>
                    <div className='text-sm md:text-base lg:text-lg'>
                        صفحه کاربران {""}
                        <br />
                        <span className='text-added-text-secondary text-xs md:text-sm lg:text-base'>کاربران را مشاهده کنید</span>
                    </div>

                    <button
                        className='outline-none bg-added-main text-added-bg-primary border border-added-main rounded-md px-2 py-1 flex items-center  flex-row-reverse gap-1 hover:text-added-main hover:bg-transparent transition-all duration-300'
                        onClick={_GetCustomers_Handler}
                    >
                        <IoRefresh className='text-inherit text-xl' />
                        بروزرسانی
                    </button>
                </div>
                <div className='mt-16 relative'>
                    {isShowAlert.status ? (
                        <div className={`absolute -top-14 w-full left-0 addCustomerAlert ${isShowAlert ? "active" : ""}`}>
                            <div
                                className='bg-green-100 border-green-400 text-green-700 border  px-4 py-3 rounded relative'
                                role='alert'
                            >
                                <div className='bell absolute top-0 bg-green-400 h-1 right-0'></div>
                                <div className='flex items-center text-right dir-rtl text-sm sm:text-base'>
                                    <strong className='font-bold'>موفق!</strong>
                                    <span className='pr-1'>
                                        کاربر مورد نظر با موفقیت{" "}
                                        <strong className='font-bold underline underline-offset-8'>
                                            {isShowAlert.job === "DELETE" ? "حذف" : "ویرایش"}
                                        </strong>{" "}
                                        شد .
                                    </span>
                                </div>
                                <span className='absolute top-0 bottom-0 left-0 px-2 py-2.5 sm:px-4 sm:py-3'>
                                    <svg
                                        className='fill-current h-6 w-6 text-green-500'
                                        role='button'
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 20 20'
                                        onClick={() => {
                                            setIsShowAlert({ status: false, job: "DELETE" })
                                        }}
                                    >
                                        <title>Close</title>
                                        <path d='M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z' />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    ) : null}

                    {isShowLoading ? (
                        <div className='absolute w-full h-full z-30 backdrop-blur-[2px] left-0 top-0 rounded overflow-hidden'>
                            <div className='flex h-full items-center justify-center'>
                                <div className='-translate-x-1/2 -translate-y-1/2'>
                                    <Loading />
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {Customers.length !== 0 ? (
                        <>
                            <div className='relative overflow-x-auto sm:rounded-lg p-1 min-h-40'>
                                <div className='flex flex-column sm:flex-row flex-wrap items-center justify-between gap-2.5 pb-2.5 p-1'>
                                    <div className='relative'>
                                        <button
                                            className='items-center text-added-text-secondary bg-transparent border border-added-border hover:bg-added-bg-secondary font-medium rounded-md text-sm flex h-7 px-1.5 w-32 justify-between'
                                            type='button'
                                            onClick={() => {
                                                if (filterByDateOptions.status === "CLOSE") {
                                                    setFilterByDateOption(prv => ({ ...prv, status: "OPEN" }))
                                                } else {
                                                    setFilterByDateOption(prv => ({ ...prv, status: "CLOSE" }))
                                                }
                                            }}
                                            onBlur={() => {
                                                setTimeout(() => {
                                                    setFilterByDateOption(prv => ({ ...prv, status: "CLOSE" }))
                                                }, 100)
                                            }}
                                        >
                                            <div className='flex items-center gap-1.5'>
                                                <svg
                                                    className='w-3 h-3 text-added-text-secondary'
                                                    aria-hidden='true'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    fill='currentColor'
                                                    viewBox='0 0 20 20'
                                                >
                                                    <path d='M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z' />
                                                </svg>
                                                {filterByDateOptions.options[
                                                    filterByDateOptions.selectedOptionIndex
                                                ].countDay?.toLocaleString("fa-IR")}
                                                {" " + filterByDateOptions.options[filterByDateOptions.selectedOptionIndex].text}
                                            </div>
                                            <svg
                                                className='w-2.5 h-2.5 ms-2.5'
                                                aria-hidden='true'
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 10 6'
                                            >
                                                <path
                                                    stroke='currentColor'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth='2'
                                                    d='m1 1 4 4 4-4'
                                                />
                                            </svg>
                                        </button>

                                        <div
                                            className={`z-10 absolute w-full bg-added-bg-primary border border-added-border rounded-lg shadow overflow-hidden ${
                                                filterByDateOptions.status === "CLOSE" ? "hidden" : ""
                                            }`}
                                        >
                                            <ul className='text-sm text-added-text-primary'>
                                                {filterByDateOptions.options.map(option => {
                                                    return (
                                                        <li
                                                            className='cursor-pointer'
                                                            key={option.id}
                                                            onClick={() => {
                                                                setFilterByDateOption(prv => ({
                                                                    ...prv,
                                                                    selectedOptionIndex: option.id,
                                                                    status: "CLOSE",
                                                                }))
                                                            }}
                                                        >
                                                            <div className='flex items-center p-1 rounded hover:bg-added-bg-secondary cursor-pointer'>
                                                                <input
                                                                    id={`filterByTimeOption${option.id}`}
                                                                    type='radio'
                                                                    value=''
                                                                    name='filter-radio'
                                                                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer'
                                                                    checked={
                                                                        option.id === filterByDateOptions.selectedOptionIndex
                                                                    }
                                                                />
                                                                <label
                                                                    htmlFor={`filterByTimeOption${option.id}`}
                                                                    className='w-full ms-2 text-sm font-medium text-added-text-secondary rounded cursor-pointer'
                                                                >
                                                                    {option.countDay?.toLocaleString("fa-IR")}
                                                                    {" " + option.text}
                                                                </label>
                                                            </div>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className='relative w-48 border  rounded-md h-7 border-added-border hover:bg-added-bg-secondary hasINput'>
                                        <div className='absolute left-0.5 flex items-center top-1/2 -translate-y-1/2 overflow-hidden'>
                                            <svg
                                                className='w-5 h-5 text-added-text-secondary cursor-pointer'
                                                aria-hidden='true'
                                                fill='currentColor'
                                                viewBox='0 0 20 20'
                                                xmlns='http://www.w3.org/2000/svg'
                                            >
                                                <path
                                                    fillRule='evenodd'
                                                    d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                                                    clipRule='evenodd'
                                                ></path>
                                            </svg>
                                        </div>
                                        <input
                                            type='text'
                                            id='table-search'
                                            className='w-10/12 h-full outline-none p-1 bg-transparent text-added-text-secondary'
                                            placeholder='جستجو'
                                            value={filterByText}
                                            onChange={e => {
                                                setFilterByText(e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>

                                <table className='min-w-[550px] md:min-w-[600px] w-full m-auto text-left text-added-text-secondary outline outline-added-border rounded-md overflow-hidden text-sm md:text-base lg:text-lg xl:text-xl'>
                                    <thead className='text-added-text-primary uppercase bg-added-border'>
                                        <tr>
                                            <th
                                                scope='col'
                                                className='p-2.5 text-center'
                                            >
                                                تصویر
                                            </th>
                                            <th
                                                scope='col'
                                                className='p-2.5 text-center'
                                            >
                                                عنوان
                                            </th>
                                            <th
                                                scope='col'
                                                className='p-2.5 text-center'
                                            >
                                                ایمیل
                                            </th>
                                            <th
                                                scope='col'
                                                className='p-2.5 text-center'
                                            >
                                                تاریخ افزودن
                                            </th>
                                            <th
                                                scope='col'
                                                className='p-2.5 text-center'
                                            >
                                                ویرایش/حذف
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {FilterOption.items.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className='py-4'
                                                >
                                                    با این مشخصات کاربری موجود نمیباشد
                                                </td>
                                            </tr>
                                        ) : (
                                            PaginationValues.Items.map(customer => {
                                                const customerDate = customer[1].Date
                                                const PersianDateParts = new Intl.DateTimeFormat("fa-IR").formatToParts(
                                                    new Date(customerDate)
                                                )
                                                const PersianMonthWord =
                                                    persianMonths[
                                                        Number(_removePersianDigitsAndSeparators(PersianDateParts[2].value)) - 1
                                                    ]
                                                return (
                                                    <tr
                                                        key={customer[0]}
                                                        className='bg-added-bg-secondary hover:bg-added-bg-primary'
                                                    >
                                                        <td className='text-center p-2.5'>
                                                            <IconeBox
                                                                className='w-9 lg:w-10 xl:w-13 mx-auto rounded-lg overflow-hidden'
                                                                onClick={() => {
                                                                    setImgSrc4ImagePOrtal(customer[1].ImgSrce)
                                                                }}
                                                            >
                                                                <img
                                                                    src={customer[1].ImgSrce}
                                                                    alt='Avatar'
                                                                    className='h-full w-full object-cover'
                                                                />
                                                            </IconeBox>
                                                        </td>
                                                        <th
                                                            scope='row'
                                                            className='text-center p-2.5 font-medium text-added-text-primary/75 whitespace-nowrap '
                                                        >
                                                            {customer[1].Name}
                                                        </th>
                                                        <td className='text-center p-2.5 dir-ltr'>{customer[1].Email}</td>
                                                        <td className='text-center p-2.5'>
                                                            <small>{PersianDateParts[4].value.padStart(2, "۰")}</small>/
                                                            <small>{PersianMonthWord}</small>/
                                                            <small>{PersianDateParts[0].value}</small>
                                                        </td>
                                                        <td className='text-center p-2.5'>
                                                            <div className='flex items-center gap-1 justify-center'>
                                                                <div
                                                                    onClick={() => {
                                                                        setSelectedCustomer({ job: "EDIT", target: customer })
                                                                        setValuesForEdit({
                                                                            Email: customer[1].Email,
                                                                            ImgSrce: customer[1].ImgSrce,
                                                                            Name: customer[1].Name,
                                                                            Password: customer[1].Password,
                                                                        })
                                                                    }}
                                                                    className='lg:w-9 lg:pt-1.5 lg:pr-2 aspect-square md:pt-[5px] md:w-7 md:pr-[5px] p-1 w-6 pr-[5px] rounded-full bg-added-main border border-added-main hover:bg-transparent hover:text-added-main cursor-pointer text-added-bg-primary transition-all duration-300'
                                                                >
                                                                    <RiEdit2Line className='text-inherit lg:text-xl' />
                                                                </div>
                                                                <div
                                                                    onClick={() => {
                                                                        setSelectedCustomer({ job: "DELETE", target: customer })
                                                                    }}
                                                                    className='lg:w-9 lg:pt-1.5 lg:pr-2 aspect-square md:pt-[5px] md:w-7 md:pr-[5px] p-1 w-6 rounded-full bg-added-main border border-added-main hover:bg-transparent hover:text-added-main cursor-pointer text-added-bg-primary transition-all duration-300'
                                                                >
                                                                    <RiDeleteBin2Line className='text-inherit lg:text-xl' />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {PaginationValues.totalPages > 1 ? (
                                <div className='mt-6 text-center xl:text-lg'>
                                    <div className='flex items-center justify-center gap-1'>
                                        {[...Array.from({ length: PaginationValues.totalPages }, (v, k) => k + 1)].map(button => (
                                            <button
                                                className={`${
                                                    button === PaginationValues.Page ? "bg-added-main" : "bg-[#585858]"
                                                } text-[#fff] aspect-square w-8 rounded-md leading-8 hover:bg-added-main transition-all duration-300 p-0.5 pb-0 cursor-pointer xl:text-xl xl:w-10 xl:leading-10`}
                                                onClick={() => {
                                                    setPaginationValues(prv => ({ ...prv, Page: button }))
                                                }}
                                                key={button}
                                            >
                                                {(+button).toLocaleString("fa-IR")}
                                            </button>
                                        ))}
                                    </div>
                                    <div className='flex items-center gap-2 mt-2 justify-center'>
                                        <button
                                            className='flex items-center bg-[#585858] hover:bg-added-main p-1.5 rounded text-white cursor-pointer disabled:bg-added-border disabled:text-added-text-primary'
                                            onClick={() => {
                                                setPaginationValues(prv => ({ ...prv, Page: prv.Page - 1 }))
                                            }}
                                            disabled={PaginationValues.Page === 1}
                                        >
                                            {PaginationValues.Page === 1 ? <FiLock className='text-inherit' /> : null}
                                            <RiArrowRightDoubleFill className='text-inherit' />
                                            صفحه قبلی
                                        </button>
                                        <button
                                            className='flex items-center bg-[#585858] hover:bg-added-main p-1.5 rounded text-white cursor-pointer disabled:bg-added-border disabled:text-added-text-primary'
                                            onClick={() => {
                                                setPaginationValues(prv => ({ ...prv, Page: prv.Page + 1 }))
                                            }}
                                            disabled={PaginationValues.Page === PaginationValues.totalPages}
                                        >
                                            صفحه بعدی <RiArrowLeftDoubleFill className='text-inherit' />
                                            {PaginationValues.Page === PaginationValues.totalPages ? (
                                                <FiLock className='text-inherit' />
                                            ) : null}
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <div className='text-center pb-10'>
                            <span className='border-b border-added-main inline-block mb-2 pb-1.5 md:text-lg lg:text-xl'>
                                درحال حاضر کاربری موجود نمی باشد!
                            </span>
                            <br />
                            <span className='text-xs text-added-text-secondary md:text-base lg:text-lg'>
                                بروزرسانی را امتحان کنید
                            </span>
                        </div>
                    )}
                </div>
            </div>
            {selectedCustomer.job !== "IDLE" ? (
                <Portal>
                    <div className='relative'>
                        <div className='relative bg-added-bg-primary rounded-lg shadow-md shadow-added-border max-w-full max-h-[calc(100vh-16px)] my-auto overflow-y-auto px-4'>
                            <button
                                type='button'
                                className='absolute top-3 end-2.5 bg-transparent hover:bg-added-border rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center group'
                                data-modal-hide='popup-modal'
                                onClick={() => {
                                    setSelectedCustomer(prv => ({ ...prv, job: "IDLE" }))
                                    setCurrentImage({ file: undefined, link: "", name: "", status: "idle" })
                                    setValuesForEdit({ Email: "", ImgSrce: "", Name: "", Password: "" })
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
                            <div className='p-4 md:p-5 text-center'>
                                <div className='h-12 flex items-center justify-center text-added-main'>
                                    {selectedCustomer.job === "DELETE" ? (
                                        <RiDeleteBin2Line className='text-4xl text-inherit' />
                                    ) : (
                                        <RiEdit2Line className='text-4xl text-inherit' />
                                    )}
                                </div>
                                <h3 className='mb-5 text-lg font-normal text-added-text-primary'>
                                    {selectedCustomer.job === "DELETE"
                                        ? "آیا از حذف کاربر مورد نظر  اطمینان دارید؟"
                                        : "کاربر مورد نظر را ویرایش کنید"}
                                </h3>
                                {selectedCustomer.job === "EDIT" ? (
                                    <div className='mb-5 border rounded border-added-border p-2'>
                                        <form className='text-added-text-primary text-right dir-rtl'>
                                            <div className='flex flex-col gap-1'>
                                                <div className='flex flex-col md:flex-row md:flex-wrap'>
                                                    <div className='flex flex-col gap-2.5 p-1 md:w-1/2'>
                                                        <label
                                                            htmlFor='getCustomerName'
                                                            className='cursor-pointer'
                                                        >
                                                            نام
                                                        </label>
                                                        <input
                                                            type='text'
                                                            className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 bg-added-bg-secondary focus:border-added-main'
                                                            id='getCustomerName'
                                                            placeholder='عنوان محصول را وارد کنید'
                                                            value={valuesForEdit.Name}
                                                            onChange={e => {
                                                                setValuesForEdit(prv => ({ ...prv, Name: e.target.value }))
                                                            }}
                                                        />
                                                    </div>
                                                    <div className='flex flex-col gap-2.5 p-1 md:w-1/2'>
                                                        <label
                                                            htmlFor='getCustomerEmail'
                                                            className='cursor-pointer'
                                                        >
                                                            ایمیل
                                                        </label>
                                                        <input
                                                            type='email'
                                                            className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 bg-added-bg-secondary focus:border-added-main'
                                                            id='getCustomerEmail'
                                                            placeholder='ایمیل کاربر را وارد کنید'
                                                            value={valuesForEdit.Email}
                                                            onChange={e => {
                                                                setValuesForEdit(prv => ({ ...prv, Email: e.target.value }))
                                                            }}
                                                        />
                                                    </div>
                                                    <div className='flex flex-col gap-2.5 p-1 md:w-1/2'>
                                                        <label
                                                            htmlFor='getCustomerPassword'
                                                            className='cursor-pointer'
                                                        >
                                                            گذرواژه
                                                        </label>
                                                        <div className='logininputContainer border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 bg-added-bg-secondary focus:border-added-main relative'>
                                                            <input
                                                                type={passwordVisibility ? "text" : "password"}
                                                                className='outline-none w-[90%] h-full bg-transparent'
                                                                id='getCustomerPassword'
                                                                placeholder='گذرواژه کاربر را وارد کنید'
                                                                value={valuesForEdit.Password}
                                                                onChange={e => {
                                                                    setValuesForEdit(prv => ({
                                                                        ...prv,
                                                                        Password: e.target.value,
                                                                    }))
                                                                }}
                                                            />
                                                            <div
                                                                onClick={() => setPasswordVisibility(prv => !prv)}
                                                                className='absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer'
                                                            >
                                                                {passwordVisibility ? (
                                                                    <FiEyeOff className='md:text-lg lg:text-xl' />
                                                                ) : (
                                                                    <FiEye className='md:text-lg lg:text-xl' />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex'>
                                                    <div className='flex flex-col gap-2.5 p-1 w-3/6 sm:w-4/6'>
                                                        <label
                                                            htmlFor='getCustomerImage'
                                                            className='cursor-pointer w-28'
                                                        >
                                                            تصویر کاربر
                                                        </label>
                                                        <label
                                                            htmlFor='getCustomerImage'
                                                            className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 cursor-pointer flex justify-center items-center flex-col gap-2 bg-added-bg-secondary focus:border-added-main hover:bg-added-border h-[131px] min-[303px]:h-[115px] sm:h-[106px] md:h-[115px] lg:h-[146px]'
                                                            onDrop={e => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                ;(e.target as HTMLElement).classList.remove("hovered")

                                                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                                                    setCurrentImage(prv => ({
                                                                        ...prv,
                                                                        file: e.dataTransfer.files[0],
                                                                    }))
                                                                }
                                                            }}
                                                            onDragEnter={e => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                ;(e.target as HTMLElement).classList.add("hovered")
                                                            }}
                                                            onDragOver={e => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                ;(e.target as HTMLElement).classList.add("hovered")
                                                            }}
                                                            onDragLeave={e => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                ;(e.target as HTMLElement).classList.remove("hovered")
                                                            }}
                                                        >
                                                            <input
                                                                type='file'
                                                                className='hidden'
                                                                id='getCustomerImage'
                                                                accept='image/*'
                                                                onChange={e => {
                                                                    const files = e.target.files
                                                                    if (!files) return
                                                                    setCurrentImage(prv => ({ ...prv, file: files[0] }))
                                                                }}
                                                                disabled={CurrentImage.status !== "idle"}
                                                            />
                                                            <img
                                                                src={UploadSVG}
                                                                alt='Icon'
                                                                className='sm:w-12 lg:w-16'
                                                            />
                                                            <span className='text-added-text-secondary text-xs text-center md:text-sm lg:text-base'>
                                                                بکشید و رها کنید برای انتخاب عکس <br /> یا کلیک کنید
                                                            </span>
                                                        </label>
                                                    </div>
                                                    <div className='w-3/6 sm:w-2/6 p-1'>
                                                        <div className='pb-2.5'>پیش نمایش</div>
                                                        <div className='border border-added-border rounded-md p-1.5 py-2 outline-none lg:py-3 lg:p-2.5 flex justify-center items-center flex-col gap-2 bg-added-bg-secondary focus:border-added-main dir-rtl h-[131px] min-[303px]:h-[115px] sm:h-[106px] md:h-[115px] lg:h-[146px]'>
                                                            {CurrentImage.status === "running" ? (
                                                                "درحال بارگذاری " + ImageProgress_Ref.current + "%"
                                                            ) : (
                                                                <img
                                                                    src={
                                                                        CurrentImage.link
                                                                            ? CurrentImage.link
                                                                            : valuesForEdit.ImgSrce
                                                                    }
                                                                    className='w-full h-full object-contain'
                                                                    alt='CustomerAvatar'
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                ) : null}
                                {selectedCustomer.job === "DELETE" ? (
                                    <button
                                        data-modal-hide='popup-modal'
                                        type='button'
                                        className='text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center'
                                        onClick={_DeleteCustomer}
                                    >
                                        بله کاملا
                                    </button>
                                ) : (
                                    <button
                                        data-modal-hide='popup-modal'
                                        type='button'
                                        className='text-white bg-added-main/80 hover:bg-added-main focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center disabled:bg-added-border disabled:border-added-border disabled:text-added-text-primary'
                                        onClick={_EditCustomer}
                                        disabled={!formISvalid}
                                    >
                                        ارسال
                                        {formISvalid ? null : <FiLock className='mb-1' />}
                                    </button>
                                )}
                                <button
                                    data-modal-hide='popup-modal'
                                    type='button'
                                    className='py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
                                    onClick={() => {
                                        setSelectedCustomer(prv => ({ ...prv, job: "IDLE" }))
                                        setCurrentImage({ file: undefined, link: "", name: "", status: "idle" })
                                        setValuesForEdit({ Email: "", ImgSrce: "", Name: "", Password: "" })
                                    }}
                                >
                                    {selectedCustomer.job === "DELETE" ? "نه، پشیمون شدم" : "نه، بیخیال"}
                                </button>
                            </div>
                        </div>
                    </div>
                </Portal>
            ) : null}
            {ImgSrc4ImagePOrtal ? (
                <ImagePortal
                    imageSrc={ImgSrc4ImagePOrtal}
                    _CloseHandler={() => setImgSrc4ImagePOrtal("")}
                />
            ) : null}
        </OutLetParent>
    )
}
export default Customers
