// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    // Configure Tailwind to use Mantine's data attribute for dark mode
    darkMode: ["class", '[data-mantine-color-scheme="dark"]'],
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],

    theme: {
        extend: {},
    },
    plugins: [],
};
