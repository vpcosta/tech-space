/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: "Roboto, sans-serif"
      },
      colors: {
        orange: {
          500: "#F27329",
          400: "#D48744"
        },
        black: {
          100: "#0D0D0D"
        },
        purple: {
          600: "#00004E",
          700: "#000041",
          800: "#00002A"
        }
      }
    },
  },
  plugins: [],
}

