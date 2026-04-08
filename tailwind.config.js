/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "scale-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "scale-in": "scale-in 0.3s ease-out",
      },
      fontFamily: {
        // Map the CSS variable from layout.tsx
        cuprum: ["var(--font-cuprum)", "sans-serif"],
      },
    },
  },
  plugins: [],
};