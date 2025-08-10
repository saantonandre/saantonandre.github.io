import tailwindForms from "@tailwindcss/forms";
import themeColors from "./src/configs/theme.tailwind.json";
import { Config } from "tailwindcss";
/** @type {import('tailwindcss').Config} */
const config: Config = {
  // Just in time compiler enabled for tsx
  darkMode: "class",
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    corePlugins: {
      // Removes tailwind base styles
      preflight: false,
    },
    extend: {
      "webkit-box": "",
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        monospace: ["Lucida Grande", "monospace"],
      },
      colors: themeColors,
    },
    plugins: [tailwindForms],
  },
};
export default config;
