/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#2d8a52',
          DEFAULT: '#1a6b3c',
          dark: '#0d3b1e',
        },
        accent: {
          DEFAULT: '#f5a623',
        }
      },
      fontFamily: {
        bengali: ['"Hind Siliguri"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
