import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFDF9",
          100: "#FAF7F2",
          200: "#F3EDE2",
          300: "#E8DDD0",
          400: "#D3C2B0",
        },
        espresso: {
          800: "#2D231E",
          900: "#1F1916",
          950: "#14100E",
        },
        champagne: {
          400: "#E5C875",
          500: "#D4AF37",
          600: "#C5A059",
        },
        rose: {
          50: "#FDF9F7",
          100: "#F7EFEA",
          200: "#E8D8CE",
          300: "#D4BCAD",
        },
        taupe: {
          500: "#8C827A",
          600: "#6E655F",
          700: "#544C47",
        }
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'soft-glow': '0 10px 30px -10px rgba(212, 175, 55, 0.15)',
        'luxury': '0 20px 40px -15px rgba(31, 25, 22, 0.08)',
        'card-hover': '0 20px 35px -10px rgba(45, 35, 30, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
