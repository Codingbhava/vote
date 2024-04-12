/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        
        c0: "#101010",
        c1: "#131313",
        c2: "#202329",
        c3: "#8B8D93",
        c4: "#6b8afd",
        c5: "#2E343D",
        me_background: '#050816',
        common_text: '#AABBC3',
        common_primary: '#1E88E5',
        common_secondary: '#64B5F6',
        common_accent: '#FBC02D',
        user_background: '#191D28',
        chat_background:'#002B36',
        
    },
    animation:{
      slideup: 'slideup 1s ease-in-out',
      slidedown: 'slidedown 1s ease-in-out',
      slideleft: 'slideleft 1s ease-in-out',
      slideright: 'slideright 1s ease-in-out',
      wave: 'wave 1.2s linear infinite',
      slowfade: 'slowfade 2.2s ease-in-out',
    },
    keyframes:{
      slowfade: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      slideup: {
        from: { opacity: 0, transform: 'translateY(25%)' },
        to: { opacity: 1, transform: 'none' },
      },
      slidedown: {
        from: { opacity: 0, transform: 'translateY(-25%)' },
        to: { opacity: 1, transform: 'none' },
      },
      slideleft: {
        from: { opacity: 0, transform: 'translateX(-20px)' },
        to: { opacity: 1, transform: 'translateX(0)' },
      },
      slideright: {
        from: { opacity: 0, transform: 'translateX(20px)' },
        to: { opacity: 1, transform: 'translateX(0)' },
      },
      wave: {
        '0%': { transform: 'scale(0)' },
        '50%': { transform: 'scale(1)' },
        '100%': { transform: 'scale(0)' },
      },
    },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
