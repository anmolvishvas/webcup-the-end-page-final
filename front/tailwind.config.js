/**  @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Roboto', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
      },
      colors: {
        'primary': {
          DEFAULT: '#1a1a2e',
          'light': '#2d2d44',
        },
        'secondary': {
          DEFAULT: '#e94560',
          'light': '#ff6b81',
        },
        'accent': '#16213e',
      },
    },
  },
  plugins: [],
};
 