import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from "chart.js"
import { ComponentProps, useMemo } from "react"
import { Line } from "react-chartjs-2"

const ProductsChart = ({ products, theme }: { products: T_Products; theme: T_Theme }) => {
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

    const ProductsDatas = useMemo<Array<string>>(() => {
        let ProductsDatas: Array<string> = []
        let ProductsPerMonth: {
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

        if (products.length === 0) return ProductsDatas

        products.forEach(product => {
            const productDate = product[1].Date
            const PersianDateParts = new Intl.DateTimeFormat("fa-IR").formatToParts(new Date(productDate))
            const PersianMonthWord = persianMonths[Number(_removePersianDigitsAndSeparators(PersianDateParts[2].value)) - 1]

            ProductsPerMonth[PersianMonthWord] = ProductsPerMonth[PersianMonthWord] + 1
        })

        for (let i = 0; i < persianMonths.length; ++i) {
            ProductsDatas[i] = String(ProductsPerMonth[persianMonths[i]])
        }
        return ProductsDatas
    }, [products])

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
                label: "محصولات",
                data: ProductsDatas,
                backgroundColor: "hsl(147, 67%, 55%)",
                borderColor: "hsl(147, 67%, 47%)",
                pointRadius: 5,
                pointHitRadius: 10,
                pointBackgroundColor: "hsl(147, 67%, 47%)",
                pointBorderColor: "hsl(147, 67%, 47%)",
                pointHoverBackgroundColor: "hsl(147, 67%, 47%)",
                pointHoverBorderColor: "hsl(147, 67%, 47%)",
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
                <p className='text-added-text-secondary text-center'>محصولات</p>
                <Line
                    options={options}
                    data={data}
                />
            </div>
        </div>
    )
}

export default ProductsChart
