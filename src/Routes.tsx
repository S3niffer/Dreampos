import { RouteObject, useRoutes } from "react-router-dom"
import Login from "./Pages/Login"
import Dashboard from "./Pages/Dashboard"
import PrivateRoute from "./Components/PrivateRoute"
import Register from "./Pages/Register"

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
    },
]

const RouteProvider = () => useRoutes(Routes)

export default RouteProvider
