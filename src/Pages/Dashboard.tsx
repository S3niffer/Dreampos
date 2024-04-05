import { useState } from "react"
import TopBar from "../Components/TopBar"
import SideBar from "../Components/SideBar"

const Dashboard = () => {
    const [sideBar, setSideBar] = useState(false)

    return (
        <div className='relative'>
            <div className={`sticky top-0 w-full bg-added-bg-secondary z-50 h-topBarHeight shadow`}>
                <TopBar
                    setSideBar={setSideBar}
                    sideBar={sideBar}
                />
            </div>
            <div className='flex relative'>
                <div
                    className={`w-sideBarWidth fixed md:sticky bg-added-bg-secondary transition-all duration-300 bottom-0 shadow-lg ${
                        sideBar ? "right-0" : `-right-sideBarWidth`
                    }`}
                >
                    <div className={`overflow-y-auto dir-ltr h-[calc(100vh-var(--topBarHeight))]`}>
                        <SideBar />
                    </div>
                </div>
                <div
                    className={`dir-ltr overflow-auto h-[calc(100vh-var(--topBarHeight))] bg-added-bg-primary w-full md:w-[calc(100vw-var(--sideBarWidth))]
                    `}
                >
                    <div className='dir-rtl text-right'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut omnis, fugiat necessitatibus numquam recusandae impedit ipsum sequi quo ab corporis? Eveniet rem incidunt laboriosam odit similique nulla accusantium optio, fuga deleniti. Voluptas ducimus quasi culpa quos dolores alias repellat quas? Incidunt quas magni tempore dolorem accusantium provident enim recusandae non consectetur ducimus explicabo sed saepe inventore impedit, nulla odio delectus. Fuga blanditiis vitae architecto maiores, ut quam aut eaque, quaerat laudantium iusto ratione illo. Quibusdam incidunt optio expedita unde reiciendis.
                        <br />
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut omnis, fugiat necessitatibus numquam recusandae impedit ipsum sequi quo ab corporis? Eveniet rem incidunt laboriosam odit similique nulla accusantium optio, fuga deleniti. Voluptas ducimus quasi culpa quos dolores alias repellat quas? Incidunt quas magni tempore dolorem accusantium provident enim recusandae non consectetur ducimus explicabo sed saepe inventore impedit, nulla odio delectus. Fuga blanditiis vitae architecto maiores, ut quam aut eaque, quaerat laudantium iusto ratione illo. Quibusdam incidunt optio expedita unde reiciendis.
                        <br />
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut omnis, fugiat necessitatibus numquam recusandae impedit ipsum sequi quo ab corporis? Eveniet rem incidunt laboriosam odit similique nulla accusantium optio, fuga deleniti. Voluptas ducimus quasi culpa quos dolores alias repellat quas? Incidunt quas magni tempore dolorem accusantium provident enim recusandae non consectetur ducimus explicabo sed saepe inventore impedit, nulla odio delectus. Fuga blanditiis vitae architecto maiores, ut quam aut eaque, quaerat laudantium iusto ratione illo. Quibusdam incidunt optio expedita unde reiciendis.
                        <br />
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut omnis, fugiat necessitatibus numquam recusandae impedit ipsum sequi quo ab corporis? Eveniet rem incidunt laboriosam odit similique nulla accusantium optio, fuga deleniti. Voluptas ducimus quasi culpa quos dolores alias repellat quas? Incidunt quas magni tempore dolorem accusantium provident enim recusandae non consectetur ducimus explicabo sed saepe inventore impedit, nulla odio delectus. Fuga blanditiis vitae architecto maiores, ut quam aut eaque, quaerat laudantium iusto ratione illo. Quibusdam incidunt optio expedita unde reiciendis.
                        <br />
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut omnis, fugiat necessitatibus numquam recusandae impedit ipsum sequi quo ab corporis? Eveniet rem incidunt laboriosam odit similique nulla accusantium optio, fuga deleniti. Voluptas ducimus quasi culpa quos dolores alias repellat quas? Incidunt quas magni tempore dolorem accusantium provident enim recusandae non consectetur ducimus explicabo sed saepe inventore impedit, nulla odio delectus. Fuga blanditiis vitae architecto maiores, ut quam aut eaque, quaerat laudantium iusto ratione illo. Quibusdam incidunt optio expedita unde reiciendis.
                        <br />
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut omnis, fugiat necessitatibus numquam recusandae impedit ipsum sequi quo ab corporis? Eveniet rem incidunt laboriosam odit similique nulla accusantium optio, fuga deleniti. Voluptas ducimus quasi culpa quos dolores alias repellat quas? Incidunt quas magni tempore dolorem accusantium provident enim recusandae non consectetur ducimus explicabo sed saepe inventore impedit, nulla odio delectus. Fuga blanditiis vitae architecto maiores, ut quam aut eaque, quaerat laudantium iusto ratione illo. Quibusdam incidunt optio expedita unde reiciendis.
                        <br />
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut omnis, fugiat necessitatibus numquam recusandae impedit ipsum sequi quo ab corporis? Eveniet rem incidunt laboriosam odit similique nulla accusantium optio, fuga deleniti. Voluptas ducimus quasi culpa quos dolores alias repellat quas? Incidunt quas magni tempore dolorem accusantium provident enim recusandae non consectetur ducimus explicabo sed saepe inventore impedit, nulla odio delectus. Fuga blanditiis vitae architecto maiores, ut quam aut eaque, quaerat laudantium iusto ratione illo. Quibusdam incidunt optio expedita unde reiciendis.
                        <br />
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut omnis, fugiat necessitatibus numquam recusandae impedit ipsum sequi quo ab corporis? Eveniet rem incidunt laboriosam odit similique nulla accusantium optio, fuga deleniti. Voluptas ducimus quasi culpa quos dolores alias repellat quas? Incidunt quas magni tempore dolorem accusantium provident enim recusandae non consectetur ducimus explicabo sed saepe inventore impedit, nulla odio delectus. Fuga blanditiis vitae architecto maiores, ut quam aut eaque, quaerat laudantium iusto ratione illo. Quibusdam incidunt optio expedita unde reiciendis.
                        <br />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Dashboard
