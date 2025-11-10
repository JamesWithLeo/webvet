// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
    // ... (other configurations)

    // ADD THIS SAFELIST BLOCK:
    safelist: [
        // This forces Tailwind to generate the active link background color
        "[data-active]:bg-[#043343]",
        // If you want white text on active:
        "[data-active]:text-white",
        // And to ensure the active color persists on hover:
        "[data-active]:hover:bg-[#043343]",
        "[data-active]:hover:text-white",
    ],

    // ... (rest of the config)
};
