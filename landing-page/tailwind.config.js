/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#8D4004",
                background: "#F2AC57",
                surface: "#FFF8E1",
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Roboto"', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
