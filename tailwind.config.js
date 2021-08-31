// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require("tailwindcss/colors");

module.exports = {
  purge: [
    "./src/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      ...colors,
      primary: {
        1: "#2c2c2c",
      },
      accent: {
        1: "#ffaa32",
      },
      eerie: {
        DEFAULT: "#1b1b1b",
        0: "#7D7D7D",
        50: "#6D6D6D",
        100: "#5D5D5D",
        200: "#4D4D4D",
        300: "#3C3C3C",
        400: "#2C2C2C",
        500: "#1B1B1B",
        600: "#1A1A1A",
        700: "#181818",
        800: "#161616",
        900: "#141414",
      },
    },
    extend: {
      fontSize: {
        xxl: "12rem",
      },
      zIndex: {
        "-10": "-10",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
