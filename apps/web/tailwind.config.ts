import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1efff",
          100: "#e4dfff",
          300: "#b7a8ff",
          400: "#a78bfa",
          500: "#8b74ff",
          600: "#7c6cff",
          700: "#6a5bff",
        },
        surface: {
          DEFAULT: "#12121a",
          2: "#1a1a24",
        },
        ink: {
          DEFAULT: "#f4f4f7",
          muted: "#9a9aa8",
          faint: "#6b6b7a",
        },
        line: "#262633",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(124,108,255,0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
