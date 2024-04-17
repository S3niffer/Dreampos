import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { UnknownAction } from "@reduxjs/toolkit"
import { Get_Customers, GettAllCustomers } from "../Apps/Slices/Customers"
import OutLetParent from "../Components/OutLetParent"

const Customers = () => {
    const Dispatch = useDispatch()
    const Customers = useSelector(GettAllCustomers)
    useEffect(() => {
        Dispatch(Get_Customers() as unknown as UnknownAction)
    }, [])
    console.log(Customers)

    return <OutLetParent>Customers</OutLetParent>
}
export default Customers
