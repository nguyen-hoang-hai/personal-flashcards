/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        en: {
          light: '#eef2ff',
          DEFAULT: '#4f46e5',
          dark: '#3730a3',
          border: '#c7d2fe',
        },
        ja: {
          light: '#fff1f2',
          DEFAULT: '#e11d48',
          dark: '#9f1239',
          border: '#fecdd3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        japanese: ['"Noto Sans JP"', '"Hiragino Kaku Gothic ProN"', '"Meiryo"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
