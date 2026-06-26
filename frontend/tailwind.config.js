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
          900: "#090B0F",
          800: "#0F131A",
          700: "#171D26",
          600: "#222B38",
        },
        accent: {
          cyan: "#00F0FF",
          emerald: "#10B981",
          rose: "#EF4444",
          amber: "#F59E0B",
          indigo: "#6366F1",
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "pulse-glow": "pulseGlow 2s infinite alternate",
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
      },
      keyframes: {
        pulseGlow: {
          "0%": { boxShadow: "0 0 5px rgba(99, 102, 241, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(99, 102, 241, 0.6)" },
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        }
      }
    },
  },
  plugins: [],
}
