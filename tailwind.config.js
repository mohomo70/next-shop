module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['IRANSansX'] },
      keyframes: {
        glow: {
          '0%': { opacity: '1' },
          '100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
        },
      },
    },
    animation: { 'glow-hand': 'glow 2s linear infinite' },
  },
  plugins: [],
}
