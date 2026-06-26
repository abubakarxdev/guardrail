/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: "#09090b",
          800: "#18181b",
          700: "#27272a",
          600: "#3f3f46",
        },
        accent: {
          cyan: "#22d3ee",
          emerald: "#10b981",
          rose: "#f43f5e",
          amber: "#f59e0b",
          indigo: "#6366f1",
        }
      },
      animation: {
        "fade-in-up": "fadeInUp 0.3s ease-out forwards",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        }
      }
    },
  },
  plugins: [],
}
