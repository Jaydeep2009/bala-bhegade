/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // BJP-Inspired Brand Palette
        saffron: {
          50: '#FFF9F2',
          100: '#FFEEDD',
          200: '#FFD8B5',
          300: '#FFBE82',
          400: '#F99D49',
          500: '#F58220', // Primary BJP Saffron
          600: '#D96A10', // Deep saffron for hover
          700: '#B8520A',
          800: '#94410E',
          900: '#78360F',
          950: '#431A05',
        },
        green: {
          50: '#F0FAF0',
          100: '#DCF5DC',
          200: '#B8EAB9',
          300: '#82D884',
          400: '#46BF49',
          500: '#138808', // Indian Green Accent
          600: '#0F7306',
          700: '#075E24', // Deep Green Accent
          800: '#084C1F',
          900: '#073F1B',
          950: '#02230D',
        },
        indianGreen: {
          50: '#F0FAF0',
          100: '#DCF5DC',
          200: '#B8EAB9',
          300: '#82D884',
          400: '#46BF49',
          500: '#138808', // Indian Green Accent
          600: '#0F7306',
          700: '#075E24', // Deep Green Accent
          800: '#084C1F',
          900: '#073F1B',
          950: '#02230D',
        },
        warmWhite: {
          DEFAULT: '#FFF9F2',
          50: '#FFFFFF',
          100: '#FFFDFB',
          200: '#FFF9F2',
          300: '#FDF3E7',
          400: '#F7E8D5',
          500: '#E8E2DA', // Light border
        },
        charcoal: {
          50: '#F9F9F9',
          100: '#F0EFEB',
          200: '#E8E2DA', // Light borders
          300: '#D4CFC7',
          400: '#999999',
          500: '#666666', // Secondary text
          600: '#4A4A4A',
          700: '#363636',
          800: '#2B2B2B',
          900: '#242424', // Main text
          950: '#181818', // Dark footer
        },
        // Backward-compatible mappings converting legacy forest/gold/ivory to the new BJP saffron & white theme
        forest: {
          50: '#FFF9F2',
          100: '#FFEEDD',
          200: '#FFD8B5',
          300: '#FFBE82',
          400: '#F99D49',
          500: '#F58220',
          600: '#D96A10',
          700: '#F58220',
          800: '#D96A10',
          900: '#242424',
          950: '#181818',
        },
        gold: {
          50: '#FFF9F2',
          100: '#FFEEDD',
          200: '#FFD8B5',
          300: '#FFBE82',
          400: '#F99D49',
          500: '#F58220',
          600: '#D96A10',
          700: '#B8520A',
          800: '#94410E',
          900: '#78360F',
          950: '#431A05',
        },
        ivory: {
          50: '#FFFFFF',
          100: '#FFFDFB',
          200: '#FFF9F2',
          300: '#FDF3E7',
          400: '#F7E8D5',
          500: '#E8E2DA',
          600: '#D6CFC5',
          700: '#B8AFA2',
          800: '#666666',
          900: '#242424',
          950: '#181818',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        marathi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'ticker': 'ticker 40s linear infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.04)' },
        },
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
