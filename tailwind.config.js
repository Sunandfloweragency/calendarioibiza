/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-black': '#090909',
        'brand-dark': '#121212',
        'brand-surface': '#181818',
        'brand-surface-variant': '#232323',
        'brand-gold': '#DDA95D',
        'brand-gold-light': '#F8E3C1',
        'brand-orange': '#FF9000',
        'brand-orange-light': '#FFB344',
        'brand-purple': '#7F00FF',
        'brand-purple-light': '#A366FF',
        'brand-light': '#F0F0F0',
        'brand-gray': '#A0A0A0',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        display: ['Unbounded', 'cursive'],
        mono: ['Space Mono', 'monospace'],
      },
      boxShadow: {
        'luxury': '0px 10px 30px rgba(0, 0, 0, 0.1), 0 0 10px rgba(221, 169, 93, 0.05)',
        'luxury-hover': '0px 20px 40px rgba(0, 0, 0, 0.15), 0 0 15px rgba(221, 169, 93, 0.1)',
        'main-card': '0px 4px 20px rgba(0, 0, 0, 0.15), 0 0 8px rgba(255, 144, 0, 0.05), 0 0 6px rgba(127, 0, 255, 0.04)',
        'main-card-hover': '0px 10px 30px rgba(0, 0, 0, 0.2), 0 0 12px rgba(255, 144, 0, 0.08), 0 0 10px rgba(127, 0, 255, 0.06)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
        'neon-glow': '0 0 5px rgba(221, 169, 93, 0.2), 0 0 20px rgba(221, 169, 93, 0.1), 0 0 30px rgba(221, 169, 93, 0.05)',
        'purple-glow': '0 0 5px rgba(127, 0, 255, 0.2), 0 0 20px rgba(127, 0, 255, 0.1), 0 0 30px rgba(127, 0, 255, 0.05)',
        'orange-glow': '0 0 5px rgba(255, 144, 0, 0.2), 0 0 20px rgba(255, 144, 0, 0.1), 0 0 30px rgba(255, 144, 0, 0.05)',
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #090909 0%, #1e1e1e 100%)',
        'gradient-gold': 'linear-gradient(135deg, #DDA95D 0%, #F8E3C1 100%)',
        'gradient-purple': 'linear-gradient(135deg, #7F00FF 0%, #A366FF 100%)',
        'gradient-orange': 'linear-gradient(135deg, #FF9000 0%, #FFB344 100%)',
        'gradient-dark': 'linear-gradient(135deg, #121212 0%, #232323 100%)',
        'animated-gradient': 'linear-gradient(-45deg, rgba(10,10,10,0.95), rgba(20,0,34,0.95), rgba(34,16,0,0.95), rgba(12,6,0,0.95))',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-gentle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gradientBG': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up-fade': { 
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'elegant-fade-in-up': { 
          '0%': { opacity: '0', transform: 'translateY(25px) scale(0.99)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'scale-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'reveal-right': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-gentle': 'pulse-gentle 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'gradientBG': 'gradientBG 18s ease infinite',
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'slide-up-fade': 'slide-up-fade 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards',
        'elegant-fade-in-up': 'elegant-fade-in-up 1s cubic-bezier(0.19, 1, 0.22, 1) forwards',
        'rotate-slow': 'rotate-slow 20s linear infinite',
        'bounce-gentle': 'bounce-gentle 3s ease-in-out infinite',
        'scale-pulse': 'scale-pulse 3s ease-in-out infinite',
        'reveal-right': 'reveal-right 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      },
      backdropBlur: {
        'xxl': '30px',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      transitionDuration: {
        '2000': '2000ms',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    }
  },
  plugins: [],
} 