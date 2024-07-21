module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
        'cursive': ['Playfair Display', 'serif'],
      },
    },
  },

  
  variants: {
    extend: {
      backfaceVisibility: ['hover', 'focus'],
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}