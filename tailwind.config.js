/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#2563EB',
        secondary: '#1E293B',
        accent: '#22C55E',
        background: '#F8FAFC',
      },
    },
  },
  plugins: [],
}