module.exports = {
  purge: ["./src/**/*.html", "./src/**/*.js", "./src/**/*.jsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        xxl: "12rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
