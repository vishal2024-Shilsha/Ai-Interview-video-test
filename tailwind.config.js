module.exports = {
  plugins: [require("tailwindcss-animate")],
  theme: {
    extend: {
      keyframes: {
        "trail": {
          "0%": { "--angle": "0deg" },
          "100%": { "--angle": "360deg" },
        },
      },
      animation: {
        "trail": "trail var(--duration) linear infinite",
      },
    }
  }
};
