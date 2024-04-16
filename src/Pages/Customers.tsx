import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { UnknownAction } from "@reduxjs/toolkit"
import { Get_Customers, GettAllCustomers } from "../Apps/Slices/Customers"

const Customers = () => {
    const Dispatch = useDispatch()
    const Customers = useSelector(GettAllCustomers)
    useEffect(() => {
        Dispatch(Get_Customers() as unknown as UnknownAction)
    }, [])
    console.log(Customers)

    return <div>Customers</div>
}
export default Customers
