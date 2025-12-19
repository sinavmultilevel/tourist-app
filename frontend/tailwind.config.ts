import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#0F766E", // Deep Teal
                    light: "#14B8A6",
                    dark: "#115E59",
                    50: "#F0FDFA",
                    100: "#CCFBF1",
                    900: "#134E4A"
                },
                secondary: {
                    DEFAULT: "#D97706", // Amber
                    light: "#FBBF24",
                    dark: "#B45309",
                },
                sand: {
                    50: "#FDFBF7",
                    100: "#FAF6E9",
                    200: "#EFE8D0",
                    900: "#3F3828"
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)"],
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            animation: {
                'wave': 'wave 1.2s ease-in-out infinite',
            }
        },
    },
    plugins: [],
};
export default config;
