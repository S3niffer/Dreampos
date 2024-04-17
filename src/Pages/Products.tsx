import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Get_Products, GettAllProducts } from "../Apps/Slices/Products"
import { UnknownAction } from "@reduxjs/toolkit"
import OutLetParent from "../Components/OutLetParent"

const Products = () => {
    const Dispatch = useDispatch()
    const Products = useSelector(GettAllProducts)
    useEffect(() => {
        Dispatch(Get_Products() as unknown as UnknownAction)
    }, [])
    console.log(Products)
    return <OutLetParent>Products</OutLetParent>
}
export default Products
