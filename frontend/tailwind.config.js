/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#FFFCF2",     // Light cream
                primary: "#2B2D42",        // Deep indigo
                secondary: "#EF8354",      // Warm vintage orange
                highlight: "#D9BF77",      // Faded yellow
                text: "#1B1B1E",           // Nearly black
            },
            fontFamily: {
                sans: ["'Space Grotesk'", "sans-serif"],
            },
            boxShadow: {
                sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
            },
            spacing: {
                'section': '6rem',
                'card-padding': '1.5rem',
            },
            maxWidth: {
                'content': '42rem',
            },
        },
    },
    plugins: [],
};
