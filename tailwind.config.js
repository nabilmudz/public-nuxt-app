/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app.vue",
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./composables/**/*.{js,ts}",
    "./app/**/*.{vue,js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1B7BFF",
        "primary-light": "#A0C8FF",
      },
    },
  },
  plugins: [],
}