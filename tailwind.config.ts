import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}","./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: { 950:"#020818", 900:"#050f2c", 800:"#0a1a3e", 700:"#0d2154", 600:"#122868" },
        gold: { 400:"#fbbf24", 500:"#f59e0b", 600:"#d97706" },
      },
    },
  },
  plugins: [],
};
export default config;
