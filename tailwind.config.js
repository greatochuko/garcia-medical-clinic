const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
                poppins: ["Poppins", "sans-serif"],
                montserrat: ["Montserrat", "sans-serif"],
                alice: ["Alice", "serif"],
                fraunces: ["Fraunces", "serif"],
            },
            screens: {
                print: { raw: "print" },
            },
            colors: {
                accent: {
                    DEFAULT: "#15475B",
                    100: "#F8FAFC",
                    200: "#EFF7F8",
                    300: "#DDE8E9",
                    400: "#B9C8CE",
                    500: "#59889C",
                    600: "#15475B",
                },
                "accent-orange": "#FF8000",
            },
        },
    },

    plugins: [require("@tailwindcss/forms")],
};
