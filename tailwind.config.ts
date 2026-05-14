import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        tajawal: ['var(--font-tajawal)', 'sans-serif'],
      },
      colors: {
        primary: {
          blue: '#4B9EFF',
          purple: '#8B5CF6',
        },
        dark: {
          text: '#1A1A3E',
          bg: '#0D0D1A',
          surface: '#1A1A2E',
        },
        light: {
          bg: '#FFFFFF',
          surface: '#F5F5FF',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #4B9EFF, #8B5CF6)',
        'brand-gradient-hover': 'linear-gradient(135deg, #3B8EEF, #7B4CE6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
