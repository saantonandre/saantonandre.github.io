/** @type {import('tailwindcss').Config} */

const themeColors = require("./src/theme.tailwind.json");

module.exports = {
  // Just in time compiler enabled for tsx
  darkMode: "class",
  mode: "jit",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    corePlugins: {
      // Removes tailwind base styles
      preflight: false,
    },
    extend: {
      animation: {
        wavepulse: "wavepulse 2s infinite",
        "down-up": "down-up 0.5s",
        "down-up-strong": "down-up-strong 0.5s",
        "fade-in": "fade-in 0.5s",
        "fade-out": "fade-out 0.5s",
        "fade-in-height": "fade-in-height linear 0.3s",
        blink: "blink 20s infinite",
        grow: "grow 0.5s",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: themeColors,
    },
    plugins: [require("@tailwindcss/forms")],
  },
  plugins: [],
};
