/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rm: {
          bg: "#e5e5e5",
          darkGreen: "#003227",
          red: "#D51F1F",
          grassGreen: "#2B9209",
          footerBg: "#282828",
        },
        ufy: {
          bg: "#f7f4fc",
          darkViolet: "#140529",
          primary: "#7629f0",
          brightViolet: "#8e48ff",
          footerBg: "#0d0519",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        grotesk: ["'Plus Jakarta Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
