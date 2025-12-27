module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-primary": "#f21111",
        "brand-secondary": "#ba8888 ",
        "brand-tertiary": "#F2CB07",

        "btn-primary": "#CBE896",
        "btn-secondary": "#C0C0C0",
      },
    },
  },
  plugins: [],
  darkMode: "class", // Enable class-based dark mode
};
