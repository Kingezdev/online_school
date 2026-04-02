/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'abu-green': '#1a5f3f',
        'abu-dark': '#0d3d2a',
        'abu-light': '#e8f5f0',
        'abu-blue': '#2563eb',
        'abu-orange': '#f97316',
        'abu-red': '#dc2626',
      }
    },
  },
  plugins: [],
}
