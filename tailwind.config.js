/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'lato': ['Lato', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
        'dancing': ['Dancing Script', 'cursive'],
      },
      screens: {
        'xs': '350px',
      },
    },
  },
  plugins: [
    // Add scrollbar support
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
        },
        '.scrollbar-thumb-green-600\\/70': {
          'scrollbar-color': 'rgba(34, 197, 94, 0.7) rgba(0, 0, 0, 0.1)',
        },
        '.scrollbar-track-black\\/10': {
          'scrollbar-color': 'rgba(34, 197, 94, 0.7) rgba(0, 0, 0, 0.1)',
        },
        '.scrollbar-thin::-webkit-scrollbar': {
          'height': '8px',
          'border-radius': '4px',
          'background': 'rgba(0, 0, 0, 0.1)',
        },
        '.scrollbar-thin::-webkit-scrollbar-track': {
          'background': 'rgba(0, 0, 0, 0.1)',
          'border-radius': '4px',
          'margin': '0 10px',
        },
        '.scrollbar-thin::-webkit-scrollbar-thumb': {
          'background': 'rgba(34, 197, 94, 0.7)',
          'border-radius': '4px',
          'transition': 'background-color 0.2s ease',
          'min-width': '20px',
          'border': '1px solid rgba(34, 197, 94, 0.3)',
        },
        '.scrollbar-thin::-webkit-scrollbar-thumb:hover': {
          'background': 'rgba(34, 197, 94, 0.9)',
          'border-color': 'rgba(34, 197, 94, 0.5)',
        },
        '.scrollbar-thin::-webkit-scrollbar-thumb:active': {
          'background': '#22c55e',
          'border-color': '#22c55e',
        },
      })
    }
  ],
}
