const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                'poppins': ['Poppins', 'sans-serif'],
                'montserrat': ['Montserrat', 'sans-serif'],
                'alice': ['Alice', 'serif'],
                'fraunces': ['Fraunces', 'serif'],
            },
            screens: {
                'print': {'raw': 'print'},
            },
        },
    },

    plugins: [require('@tailwindcss/forms')],
};
