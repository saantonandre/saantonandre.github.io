import twColors from "tailwindcss/colors";
import customTheme from "./theme.tailwind.json";

const warn = console.warn;
console.warn = () => false;
export const theme = customTheme;
export const merged = { ...twColors, ...theme };
console.warn = warn;
export default merged;
