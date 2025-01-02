/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    './node_modules/shadcn-ui/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'custom-bg': '#252b2d', // Custom background color
      },
      fontFamily: {
        'sour-gummy': ['"Sour Gummy"', 'sans-serif'], // Custom font family
      },
    },
  },
  plugins: [],
};
