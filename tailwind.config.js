/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'Georgia', 'serif'],
        dm: ['var(--font-dm)', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#FAF6F1',
        'cream-dark': '#F0E8DF',
        gold: '#C9956A',
        'gold-light': '#E8C9A8',
        'gold-dark': '#A0714A',
        charcoal: '#1E1C1A',
        'warm-gray': '#6B6560',
        blush: '#EED5C2',
      },
    },
  },
  plugins: [],
}
