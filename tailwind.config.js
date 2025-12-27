module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-primary": "#732c7c",
        "brand-secondary": "#ef56ff ",
        "brand-tertiary": "#F2CB07",

        "btn-primary": "#CBE896",
        "btn-secondary": "#C0C0C0",
      },
    },
  },
  plugins: [],
  darkMode: "class", // Enable class-based dark mode
};
