/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Add custom colors, spacing, fonts here for pixel-perfect matching
      colors: {
        highlight: '#fff727',
        primaryGreen: '#00b779',
        primaryBlue: '#0070f3',
      },
      spacing: {
        // Example: '18': '4.5rem',
      },
      fontFamily: {
        // Example: 'custom': ['YourFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}; 