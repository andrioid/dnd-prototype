/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         aria: {},
         gridTemplateColumns: {
            "8plus": "repeat(8, minmax(8rem, 1fr))",
         },
      },
   },
   plugins: [],
};
