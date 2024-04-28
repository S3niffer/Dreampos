import { IconType } from "react-icons"
import Store from "./Apps/Store"
import { StatusPossibility } from "./Apps/Slices/User"

declare global {
    // Store
    type T_StoreItems = ReturnType<typeof Store.getState>

    // Theme
    type T_Theme = "light" | "dark"

    type T_ThemeChangerAction = { type: string; payload: T_Theme }

    // User
    type StatusPossibilityOBJ = {
        [K in keyof typeof StatusPossibility]: { value: K; message: (typeof StatusPossibility)[K] }
    }[keyof typeof StatusPossibility]

    type T_UserIntialState = {
        status: StatusPossibilityOBJ
        user: {} | I_UserInLocal
        users: T_Users
    }

    type T_Users = [string, T_UserInDB][]

    interface I_UserInLocal {
        Email: string
        Password: string
        ImgSrc: string
        Name: string
        Id: string
    }

    type T_UserInDB = Omit<I_UserInLocal, "Id">

    interface I_LoginUserById {
        id: string
        setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
    }

    interface I_EditUserById {
        id: string
        newUser: T_UserInDB
        _func: () => void
    }

    type EditAdminReducer = {
        type: keyof Omit<I_UserInLocal, "Id">
        payload: string
    }

    // inputTag props
    type T_InputTagProps = React.ComponentProps<"input"> & {
        label: string
        Icon: IconType
        FunctionOnIcon?: React.MouseEventHandler<HTMLDivElement>
        minLengthCondition?: number
    }

    // userLoginParameters
    interface I_UserLoginParameter {
        Email: T_UserInDB["Email"]
        Password: T_UserInDB["Password"]
    }

    // userRegisterParameter
    interface I_UserRegisterParameters {
        Name: T_UserInDB["Name"]
        Email: T_UserInDB["Email"]
        Password: T_UserInDB["Password"]
    }

    // SidebarLik Component
    type T_SideBarLinkComponentProps = { Icon: IconType; title: string } & React.ComponentProps<typeof NavLink>

    // uploadImageHandler
    type T_UploadImageHandler = (
        date: string,
        file: File,
        setState: React.Dispatch<React.SetStateAction<I_CurrentImage>>,
        progressRef: number,
        basketNmae: ImageBaskets
    ) => void

    // currentImage
    interface I_CurrentImage {
        link: string
        name: string
        file: File | undefined
        status: "running" | "paused" | "failed" | "idle"
    }

    // ImagesUploaded
    type ImageBaskets = "Products" | "CustomerAvatar" | "AdminAvatar"

    type T_UploadedImage<T extends ImageBaskets> = {
        name: string
        link: string
        kind: T
    } & (
        | {
              status: "unUsed"
          }
        | {
              status: "Used"
              id: string
          }
    )

    // AddProducts Values
    interface I_ProductInlocal {
        Id: string
        AdminId: string
        ImgSrce: string
        Price: number
        Name: string
        Date: Date
    }

    type T_ProductsInDB = Omit<I_ProductInlocal, "Id">

    type T_ProductsInDBWithoutDate = Omit<T_ProductsInDB, "Date">

    type T_Product = [string, T_ProductsInDB]

    type T_Products = T_Product[]

    type T_AddProductsAction =
        | {
              type: "ImgSrce" | "Name"
              payload: string
          }
        | {
              type: "Price"
              payload: number
          }
        | {
              type: "REST"
          }

    type AddProductActionReducer = { data: T_ProductsInDB; func: () => void }

    type DeleteProductActionReducer = { id: T_Product[0]; func: () => void }

    interface EditOrDeleteProduct {
        target: T_Product | null
        job: "DELETE" | "EDIT" | "IDLE"
    }

    type EditProductActionReducer = { id: T_Product[0]; newData: T_ProductsInDB; _func: () => void }
    //   ADDcustomer
    interface I_CustomerInLocal {
        Id: string
        AdminId: string
        Email: string
        ImgSrce: string
        Name: string
        Date: Date
        Password: string
    }

    type T_CustomerInDB = Omit<I_CustomerInLocal, "Id">
    type T_CustomerInDBWithoutDate = Omit<T_CustomerInDB, "Date">
    type T_Customers = T_Customer[]
    type T_Customer = [string, T_CustomerInDB]

    type T_AddCustomerAction =
        | {
              type: "ImgSrce" | "Name" | "Password" | "Email"
              payload: string
          }
        | {
              type: "REST"
          }

    type AddCustomerActionReducer = { data: T_CustomerInDB; func: () => void }


    interface EditOrDeleteCustomer {
        target: T_Customer | null
        job: "DELETE" | "EDIT" | "IDLE"
    }

    type DeleteCustomerActionReducer = {
        id: T_Customer[0],
        func: () => void
    }
}

export {}
