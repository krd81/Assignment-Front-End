/** @type {import('tailwindcss').Config} */
const path = require('path');

export default {

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'custom': ['Inter', 'sans-serif'],
      },
      colors: {
        // Custom colors
        'grey': '#c1c2be', // Example primary color
        'light-green': '#76bc79', // Example secondary color
        'dark-green': '#2c4754',
        'dark-blue': '#21336d',
        'washed-blue': '#455f6e',
      },
      backgroundImage: {
        'hero' : "url('/backgrounds/greybackground.jpg')",
        // 'hero' : `url(${backgroundImage})`,
        'water' : "url('./assets/backgrounds/top-view-clear-ocean-water-texture.jpg')",
        'blue' : "url('./assets/backgrounds/hi-tech-concepts-on-blue-background-hero-header.jpg')",
        '404error' : "url('/backgrounds/bluetrianglebackground.jpg')",

      },
      screens: {
        // // Breakpoints for screen sizes
        // 'sm': '1px', // Small
        // 'md': '450px', // Medium
        // 'lg': '1024px', // Large
      },
      padding: {
        'textarea-left': '4px',
        'textarea-right': '4px'
      }
    }
  },
    plugins: [
      path.join(path.dirname(require.resolve('@tailwindcss/forms')), '**/*.js'),
    ],
  }
