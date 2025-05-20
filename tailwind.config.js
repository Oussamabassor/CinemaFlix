/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E50914",
          dark: "#B81D24",
          light: "#F5222D",
        },
        dark: {
          DEFAULT: "#141414",
          lighter: "#181818",
          light: "#232323",
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      spacing: {
        128: "32rem",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      gridTemplateColumns: {
        fluid: "repeat(auto-fill, minmax(160px, 1fr))",
        "fluid-md": "repeat(auto-fill, minmax(200px, 1fr))",
        "fluid-lg": "repeat(auto-fill, minmax(240px, 1fr))",
      },
    },
  },
  plugins: [
    // Add line-clamp functionality
    function ({ addUtilities }) {
      const newUtilities = {
        ".line-clamp-1": {
          overflow: "hidden",
          display: "-webkit-box",
          "-webkit-box-orient": "vertical",
          "-webkit-line-clamp": "1",
        },
        ".line-clamp-2": {
          overflow: "hidden",
          display: "-webkit-box",
          "-webkit-box-orient": "vertical",
          "-webkit-line-clamp": "2",
        },
        ".line-clamp-3": {
          overflow: "hidden",
          display: "-webkit-box",
          "-webkit-box-orient": "vertical",
          "-webkit-line-clamp": "3",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
