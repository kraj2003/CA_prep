import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#0052CC",
        gold: "#FFD700",
      },
    },
  },
};

export default config;
