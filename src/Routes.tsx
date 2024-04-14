import { RouteObject, useRoutes } from "react-router-dom"
import Login from "./Pages/Login"
import Dashboard from "./Pages/Dashboard"
import PrivateRoute from "./Components/PrivateRoute"
import Register from "./Pages/Register"
import Overview from "./Components/Overview"
import Products from "./Components/Products"
import AddProducts from "./Components/AddProducts"
import Users from "./Components/Users"
import AddCustomer from "./Components/AddCustomers"
import Profile from "./Components/Profile"
import OutLetParent from "./Components/OutLetParent"

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
            {
                path: "",
                element: (
                    <OutLetParent>
                        <Overview />
                    </OutLetParent>
                ),
            },
            {
                path: "products",
                element: (
                    <OutLetParent>
                        <Products />
                    </OutLetParent>
                ),
            },
            { path: "add-product", element: <AddProducts /> },
            {
                path: "users-list",
                element: (
                    <OutLetParent>
                        <Users />
                    </OutLetParent>
                ),
            },
            { path: "add-customer", element: <AddCustomer /> },
            {
                path: "profile",
                element: (
                    <OutLetParent>
                        <Profile />
                    </OutLetParent>
                ),
            },
        ],
    },
]

const RouteProvider = () => useRoutes(Routes)

export default RouteProvider
