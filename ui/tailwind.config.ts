import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        "ellipse-pattern": "url('/ellipse-pattern.png')",
        cardLinear: "linear-gradient(135deg, #f3f3f3 0%, #f9f9f9 100%)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        themeYellow: {
          100: "#fffbe0",
          200: "#fff5ca",
          300: "#ffea99",
          400: "#ffdf62",
          500: "#ffd536",
          600: "#ffcf19",
          700: "#ffcc01",
          800: "#e3b400",
          900: "#ca9f00",
        },
        themeBlack: {
          100: "#f5f5f5",
          200: "#e7e7e7",
          300: "#cdcdcd",
          400: "#b2b2b2",
          500: "#9a9a9a",
          600: "#8b8b8b",
          700: "#848484",
          800: "#717171",
          900: "#262626",
        },
        themeGreen: {
          100: "#f5fde6",
          200: "#ecf6d5",
          300: "#d7eaae",
          400: "#c3df84",
          500: "#b1d560",
          600: "#a5cf46",
          700: "#9fcc3b",
          800: "#8ab32c",
          900: "#79a023",
        },
        themeRed: {
          100: "#ffeaea",
          200: "#fdd4d4",
          300: "#f4a7a8",
          400: "#EB7171",
          500: "#e54f4f",
          600: "#e13535",
          700: "#e12828",
          800: "#c81a1b",
          900: "#b31317",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
