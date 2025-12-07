export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00f0ff',
          purple: '#b829ff',
          pink: '#ff006e',
          green: '#00ff88',
          yellow: '#ffea00',
        },
        dark: {
          900: '#0a0a0f',
          800: '#14141f',
          700: '#1e1e2e',
          600: '#2a2a3f',
        }
      },
      fontFamily: {
        game: ['"Press Start 2P"', 'cursive'],
        display: ['"Exo 2"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'zoom-in': 'zoom-in 0.3s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(184, 41, 255, 0.8)',
          },
        },
        'bounce-in': {
          '0%': { 
            transform: 'scale(0)',
            opacity: '0'
          },
          '50%': { 
            transform: 'scale(1.1)'
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: '1'
          },
        },
        'slide-up': {
          '0%': { 
            transform: 'translateY(20px)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1'
          },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
        'zoom-in': {
          '0%': { 
            transform: 'scale(0) rotate(-180deg)',
            opacity: '0'
          },
          '100%': { 
            transform: 'scale(1) rotate(0)',
            opacity: '1'
          },
        }
      }
    },
  },
  plugins: [],
}
