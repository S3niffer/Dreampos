import { RouteObject, useRoutes } from "react-router-dom"
import Login from "./Pages/Login"
import Dashboard from "./Pages/Dashboard"
import PrivateRoute from "./Components/PrivateRoute"
import Register from "./Pages/Register"
import Overview from "./Pages/Overview"
import Products from "./Pages/Products"
import AddProducts from "./Pages/AddProducts"
import Customers from "./Pages/Customers"
import AddCustomer from "./Pages/AddCustomers"
import Profile from "./Pages/Profile"

const Routes: RouteObject[] = [
    { path: "/signin", element: <Login /> },
    { path: "/signup", element: <Register /> },
    {
        path: "/",
        element: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        ),
        children: [
            { path: "", element: <Overview /> },
            { path: "products", element: <Products /> },
            { path: "add-product", element: <AddProducts /> },
            { path: "customers", element: <Customers /> },
            { path: "add-customer", element: <AddCustomer /> },
            { path: "profile", element: <Profile /> },
        ],
    },
]

const RouteProvider = () => useRoutes(Routes)

export default RouteProvider
