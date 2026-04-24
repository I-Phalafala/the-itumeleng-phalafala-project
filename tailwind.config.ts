import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy colors kept for backward compatibility
        primary: "#1E3A5F",
        secondary: "#4A90D9",
        accent: "#F5A623",
        background: "#020617",
        foreground: "#E2E8F0",

        // Cyberpunk neon palette
        bg: "#020617",
        surface: "rgba(255,255,255,0.05)",
        surfaceStrong: "rgba(255,255,255,0.08)",
        border: "rgba(255,255,255,0.12)",
        neonBlue: "#00D9FF",
        neonPink: "#FF2E9F",
        neonPurple: "#8B5CF6",
        textPrimary: "#E2E8F0",
        textSecondary: "#94A3B8",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Arial", "Helvetica", "sans-serif"],
        heading: ["var(--font-heading)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "Courier New", "monospace"],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      boxShadow: {
        neonBlue: "0 0 20px rgba(0,217,255,0.4), 0 0 40px rgba(0,217,255,0.1)",
        neonPink: "0 0 20px rgba(255,46,159,0.4), 0 0 40px rgba(255,46,159,0.1)",
        neonPurple: "0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.1)",
        glowBlue: "0 0 30px rgba(0,217,255,0.2)",
        glowPink: "0 0 30px rgba(255,46,159,0.2)",
      },
      backgroundImage: {
        "cyber-gradient": "linear-gradient(135deg, #020617 0%, #0a1628 50%, #020617 100%)",
        "neon-gradient": "linear-gradient(90deg, #00D9FF, #FF2E9F)",
        "neon-gradient-purple": "linear-gradient(90deg, #8B5CF6, #00D9FF)",
      },
      animation: {
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "scan": "scan 4s linear infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
