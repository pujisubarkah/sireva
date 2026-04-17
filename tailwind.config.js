export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,vue}',
    './components/**/*.{js,ts,jsx,tsx,vue}',
    './pages/**/*.{js,ts,jsx,tsx,vue}',
    './plugins/**/*.{js,ts,jsx,tsx,vue}',
    './layouts/**/*.{js,ts,jsx,tsx,vue}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
