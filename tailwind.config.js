module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal de la marca
        'brand-black': '#000000',
        'brand-dark': '#090909',
        'brand-surface': '#121212',
        'brand-surface-variant': '#1a1a1a',
        'brand-orange': '#ff9000',
        'brand-orange-light': '#ffb347',
        'brand-orange-dark': '#cc7300',
        'brand-purple': '#5b3ee4',
        'brand-purple-light': '#8b6ff7',
        'brand-purple-dark': '#4a2bb8',
        'brand-light': '#ffffff',
        'brand-gray': '#6b7280',
        'brand-gray-light': '#9ca3af',
        'brand-gray-dark': '#374151',
        
        // Colores adicionales para UI
        'surface-primary': '#1a1a1a',
        'surface-secondary': '#242424',
        'text-primary': '#ffffff',
        'text-secondary': '#e5e7eb',
        'text-muted': '#9ca3af',
        'accent-primary': '#ff9000',
        'accent-secondary': '#5b3ee4',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif'], // Nueva fuente para elementos de lujo
        display: ['Unbounded', 'cursive'], // Nueva fuente para títulos impactantes
        mono: ['Space Mono', 'monospace'], // Fuente monoespaciada para detalles técnicos
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'glass-hover': '0 12px 48px 0 rgba(0, 0, 0, 0.4)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 10px 30px rgba(0, 0, 0, 0.25)',
        'orange-glow': '0 0 20px rgba(255, 144, 0, 0.3), 0 0 40px rgba(255, 144, 0, 0.1)',
        'purple-glow': '0 0 20px rgba(91, 62, 228, 0.3), 0 0 40px rgba(91, 62, 228, 0.1)',
        'soft': '0 2px 10px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.15)',
        'strong': '0 8px 30px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #000000 0%, #121212 100%)',
        'gradient-surface': 'linear-gradient(135deg, #090909 0%, #1a1a1a 100%)',
        'gradient-orange': 'linear-gradient(135deg, #ff9000 0%, #ffb347 100%)',
        'gradient-purple': 'linear-gradient(135deg, #5b3ee4 0%, #8b6ff7 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'gradient-overlay': 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 100%)',
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