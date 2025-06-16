/** @type {import('tailwindcss').Config} */
module.exports = {
  // presets: [require("nativewind/preset")],
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#768D85",
        },
        dark: {
          100: "#CFBFAD",
          200: "#252525",
          300: "#515E5A",
          400: "#2D2F2F",
          500: "#1E2021",
        },
        light: {
          100: "#1E2021",
          200: "#FFFFFF",
          300: "#BAC6C2",
          400: "#F1F4F3",
          500: "#FAFAFA",
        },
        border: {
          100: "#F5F5F5",
        },
      },
      fontFamily: {
        mthin: ["Montserrat-Thin", "sans-serif"],
        mextralight: ["Montserrat-ExtraLight", "sans-serif"],
        mlight: ["Montserrat-Light", "sans-serif"],
        mregular: ["Montserrat-Regular", "sans-serif"],
        mmedium: ["Montserrat-Medium", "sans-serif"],
        msemibold: ["Montserrat-SemiBold", "sans-serif"],
        mbold: ["Montserrat-Bold", "sans-serif"],
        mextrabold: ["Montserrat-ExtraBold", "sans-serif"],
        mblack: ["Montserrat-Black", "sans-serif"],
        jsemibold: ["JosefinSans-SemiBold", "sans-serif"],
      },
      // boxShadow: {
      //   "light-100":
      //     "0px 12px 20px 0px rgba(184, 184, 184, 0.03), 0px 6px 12px 0px rgba(184, 184, 184, 0.02), 0px 2px 4px 0px rgba(184, 184, 184, 0.03)",
      //   "light-200": "10px 10px 20px 0px rgba(218, 213, 213, 0.10)",
      //   "light-300": "-10px 10px 20px 0px rgba(218, 213, 213, 0.10)",
      //   "dark-100": "0px 2px 10px 0px rgba(46, 52, 56, 0.10)",
      //   "dark-200": "2px 0px 20px 0px rgba(39, 36, 36, 0.04)",
      // },
      // backgroundImage: {
      //   "auth-dark": "url('/assets/images/auth-dark.png')",
      //   "auth-light": "url('/assets/images/auth-light.png')",
      // },
      // screens: {
      //   xs: "420px",
      // },
      // keyframes: {
      //   "accordion-down": {
      //     from: { height: 0 },
      //     to: { height: "var(--radix-accordion-content-height)" },
      //   },
      //   "accordion-up": {
      //     from: { height: "var(--radix-accordion-content-height)" },
      //     to: { height: 0 },
      //   },
      // },
      // animation: {
      //   "accordion-down": "accordion-down 0.2s ease-out",
      //   "accordion-up": "accordion-up 0.2s ease-out",
      // },
    },
  },
  plugins: [],
};
