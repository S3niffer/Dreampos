/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: "1rem",
                md: 0,
            },
        },
        extend: {
            colors: {
                added: {
                    main: "hsl(var(--main), <alpha-value>)",
                    bg: {
                        primary: "hsl(var(--bg), <alpha-value>)",
                        secondary: "hsl(var(--bg-secondary), <alpha-value>)",
                    },
                    text: {
                        primary: "hsl(var(--text), <alpha-value>)",
                        secondary: "hsl(var(--text-secondary), <alpha-value>)",
                    },
                    border: "hsla(var(--border))",
                },
            },
            width: {
                sideBarWidth: "var(--sideBarWidth)",
            },
            height: {
                topBarHeight: "var(--topBarHeight)",
            },
            inset: {
                sideBarWidth: "var(--sideBarWidth)",
                topBarHeight: "var(--topBarHeight)",
            },
            fontFamily: {
                irSans: "irSans",
            },
        },
    },
    plugins: [],
}
