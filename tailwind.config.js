/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0d0f0e",
        bg2: "#141614",
        bg3: "#1c1f1c",
        card: "#1e211e",
        border1: "#2a2e2a",
        border2: "#333733",
        accent: "#b8f566",
        accent2: "#7ed957",
        text1: "#e8ece4",
        text2: "#8a9186",
        text3: "#5a5f58",
        danger: "#f56666",
        warn: "#f5c166",
        info: "#66c4f5",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        serif: ["var(--font-instrument-serif)", "serif"],
      },
      borderRadius: {
        card: "14px",
        sm: "8px",
      },
    },
  },
  plugins: [],
};
