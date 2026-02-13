/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        card: "0 1px 0 rgba(16,24,40,.04), 0 1px 2px rgba(16,24,40,.08)"
      }
    }
  },
  plugins: []
};
