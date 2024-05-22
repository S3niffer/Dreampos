import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from "chart.js"
import { ComponentProps, useMemo } from "react"
import { Line } from "react-chartjs-2"

const CustomersChart = ({ customers, theme }: { customers: T_Customers; theme: T_Theme }) => {
    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler)

    const persianMonths = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]
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
    const textColor = theme === "light" ? "hsla(208deg, 13%, 45%,1)" : "hsla(207deg, 17%, 62%,1)"

    const customersDatas = useMemo<Array<string>>(() => {
        let customersDatas: Array<string> = []
        let customersPerMonth: {
            [month in (typeof persianMonths)[number]]: number
        } = {
            آبان: 0,
            آذر: 0,
            اردیبهشت: 0,
            اسفند: 0,
            بهمن: 0,
            تیر: 0,
            خرداد: 0,
            دی: 0,
            شهریور: 0,
            فروردین: 0,
            مرداد: 0,
            مهر: 0,
        }

        if (customers.length === 0) return customersDatas

        customers.forEach(customer => {
            const customerDate = customer[1].Date
            const PersianDateParts = new Intl.DateTimeFormat("fa-IR").formatToParts(new Date(customerDate))
            const PersianMonthWord = persianMonths[Number(_removePersianDigitsAndSeparators(PersianDateParts[2].value)) - 1]

            customersPerMonth[PersianMonthWord] = customersPerMonth[PersianMonthWord] + 1
        })

        for (let i = 0; i < persianMonths.length; ++i) {
            customersDatas[i] = String(customersPerMonth[persianMonths[i]])
        }
        return customersDatas
    }, [customers])

    const options: ComponentProps<typeof Line>["options"] = {
        scales: {
            x: {
                ticks: {
                    color: textColor,
                    font: {
                        family: "irSans",
                        size: 14,
                        weight: "bold",
                    },
                },
                grid: {
                    color: "hsla(210deg, 13%, 62%, 0.32)",
                },
            },
            y: {
                grid: {
                    color: "hsla(210deg, 13%, 62%, 0.32)",
                },
                ticks: {
                    color: textColor,
                    font: {
                        family: "irSans",
                        size: 14,
                        weight: "bold",
                    },
                    callback: value => {
                        return new Intl.NumberFormat("fa-IR").format(+value)
                    },
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: value => {
                        return `${value.dataset.label}: ${new Intl.NumberFormat("fa-IR").format(+(value.raw as string))}`
                    },
                },
            },
        },
    }
    const data: ComponentProps<typeof Line>["data"] = {
        labels: persianMonths,
        datasets: [
            {
                label: "کاربران",
                data: customersDatas,
                backgroundColor: "hsl(29, 100%, 70%)",
                borderColor: "hsl(29, 100%, 63%)",
                pointRadius: 5,
                pointHitRadius: 10,
                pointBackgroundColor: "hsl(29, 100%, 63%)",
                pointBorderColor: "hsl(29, 100%, 63%)",
                pointHoverBackgroundColor: "hsl(29, 100%, 63%)",
                pointHoverBorderColor: "hsl(29, 100%, 63%)",
                fill: true,
                tension: 0.4,
                animation: {
                    duration: 500,
                    easing: "linear",
                    delay: 100,
                },
            },
        ],
    }

    return (
        <div className='overflow-x-auto w-full'>
            <div className='border-2 border-added-border rounded-md mb-0 sm:m-6 md:m-8 p-3 min-w-[400px]'>
                <p className='text-added-text-secondary text-center'>کاربران</p>
                <Line
                    options={options}
                    data={data}
                />
            </div>
        </div>
    )
}

export default CustomersChart
