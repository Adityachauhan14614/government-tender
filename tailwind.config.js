/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060B18',
          900: '#0B1224', // Primary background
          850: '#0E172F',
          800: '#111C35', // Secondary background
          750: '#152243',
          700: '#1A2952',
          600: '#23376B',
        },
        electric: {
          400: '#3B82F6',
          500: '#2563EB', // Primary accent
          600: '#1D4ED8',
          700: '#1E40AF',
        },
        violet: {
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED', // Secondary accent
          700: '#6D28D9',
        },
        teal: {
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E', // Success
          800: '#115E59',
        },
        surface: {
          50: '#F8FAFC',
          100: '#F1F5F9', // Light surface
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
        },
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#36a8f6',
          500: '#0c8de6',
          600: '#006fc4',
          700: '#01599f',
          800: '#054b83',
          900: '#0a3f6d',
          950: '#072747',
        },
        india: {
          saffron: '#FF671F',
          white: '#FFFFFF',
          green: '#046A38',
          navy: '#06038D',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(37, 99, 235, 0.25)',
        'glow-violet': '0 0 25px -5px rgba(124, 58, 237, 0.25)',
        'glow-teal': '0 0 25px -5px rgba(15, 118, 110, 0.25)',
        'enterprise': '0 4px 20px -2px rgba(11, 18, 36, 0.08), 0 2px 6px -1px rgba(11, 18, 36, 0.04)',
      }
    },
  },
  plugins: [],
}
