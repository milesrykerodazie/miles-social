module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        quicksand: ["Quicksand", "sans-serif"],
        dancing: ["Dancing Script", "cursive"],
        libre: ["Libre Caslon Display", "serif"],
        satisfy: ["Satisfy", "cursive"],
        charm: ["Charm", "cursive"],
        rancho: ["Rancho", "cursive"],
      },
      colors: {
        sm1: "#E0AAFF",
        sm2: "#C77DFF",
        sm3: "#9D4EDD",
        sm4: "#7B2CBF",
        sm5: "#5A189A",
        sm6: "#3C096C",
        sm7: "#240046",
        sm8: "#10002B",
      },
      screens: {
        laptop: "1600px",
        monitor: "1680px",
        desktop: "1920px",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
        900: "900ms",
        1100: "1100ms",
        1200: "1200ms",
        1300: "1300ms",
        1400: "1400ms",
        1500: "1500ms",
        1600: "1600ms",
        1700: "1700ms",
        1800: "1800ms",
        1900: "1900ms",
        2000: "2000ms",
      },
      animation: {
        fastpulse: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        slowpulse: "pulse 4s cubic-bezier(0.4, 0, 0.8, 1) infinite",
      },
      keyframes: {
        fastpulse: {
          "0%, 100%": {
            opacity: 0,
          },
          "50%": {
            opacity: 1,
          },
        },
      },
    },
  },
  plugins: [],
};
