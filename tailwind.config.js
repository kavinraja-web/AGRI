/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f8f4',
          100: '#e1efe4',
          500: '#2d6a4f',
          600: '#23533e',
          700: '#1a3d2e',
          900: '#0d2218'
        },
        fresh: {
          500: '#40916c',
          600: '#327355',
        },
        earth: {
          100: '#fdfbf7',
          200: '#f4ede4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
