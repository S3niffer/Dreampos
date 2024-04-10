import { RouteObject, useRoutes } from "react-router-dom"
import Login from "./Pages/Login"
import Dashboard from "./Pages/Dashboard"
import PrivateRoute from "./Components/PrivateRoute"
import Register from "./Pages/Register"
import Overview from "./Components/Overview"
import Products from "./Components/Products"
import AddProducts from "./Components/AddProducts"
import Users from "./Components/Users"
import AddUser from "./Components/AddUser"
import Profile from "./Components/Profile"

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
            { path: "users-list", element: <Users /> },
            { path: "add-user", element: <AddUser /> },
            { path: "profile", element: <Profile /> },
        ],
    },
]

const RouteProvider = () => useRoutes(Routes)

export default RouteProvider
