import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      primary: {
        default: "#005baa",
        high: "#1f4f8e",
        medium: "#298be0",
        background: "#f9fafb",
      },
      secondary: {
        default: "#333a3f",
        high: "#252525",
        medium: "#000000",
        soft: "#030303",
        container: "#555",
        background: "#ced0d1",
      },
      tertirary: {
        default: "#40ac70",
        background: "#40ac700f",
        high: "#4a98db",
      },
      table: {
        default: "#f4fafe",
        number: "#49a3f1",
        border: "#e8ecef",
      },
      tab: {
        primary: "#f5f7f9",
        border: "#e7ebee",
        background: "#fff",
      },
      surface: {
        default: "#f2f5f9",
      },
    },
    fontSize: {
      "text-display-large": [
        "47px",
        {
          lineHeight: "52px",
          // letterSpacing: '-0.01em',
          fontWeight: "700",
        },
      ],
      "text-display-medium": [
        "45px",
        {
          lineHeight: "52px",
          // letterSpacing: '-0.01em',
          fontWeight: "300",
        },
      ],
      "text-home-title": [
        "38px",
        {
          lineHeight: "52px",
          // letterSpacing: '-0.01em',
          fontWeight: "800",
        },
      ],
      "text-display-small": [
        "36px",
        {
          lineHeight: "44px",
          // letterSpacing: '-0.02em',
          fontWeight: "300",
        },
      ],
      "text-title-large": [
        "24px",
        {
          // lineHeight: "28px",
          fontWeight: "700",
          letterSpacing: "-1px",
        },
      ],
      "text-title-medium": [
        "20px",
        {
          fontWeight: "600",
          letterSpacing: "-1px",
        },
      ],
      "text-body-large": [
        "16px",
        {
          fontWeight: "400",
          letterSpacing: "-1px",
          lineHeight: "24px",
        },
      ],
      "text-body-medium": [
        "15px",
        {
          fontWeight: "400",
        },
      ],
      "text-body-medium2": [
        "14px",
        {
          fontWeight: "300",
          letterSpacing: "0.3px",
          lineHeight: "22px",
        },
      ],
      "text-body-small": [
        "13px",
        {
          fontWeight: "200",
          lineHeight: "1px",
        },
      ],
      "text-org-name": [
        "14px",
        {
          fontWeight: "400",
          lineHeight: "14px",
        },
      ],

      "text-organization-small": [
        "12px",
        {
          fontWeight: "200",
          lineHeight: "14px",
        },
      ],
      "text-table-small": [
        "10px",
        {
          fontWeight: "100",
          lineHeight: "1px",
        },
      ],
    },
  },
  plugins: [require("flowbite/plugin")],
};
export default config;
