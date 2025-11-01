/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        navBreak: '855px',
      },
      colors: {
        'custom-red': {
          DEFAULT: '#dc2626',
          hover: '#b91c1c',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'logo-slide-fast': 'logoSlide 20s linear infinite',
        'shimmer-slide': 'shimmerSlide var(--speed,3s) ease-in-out infinite alternate',
        'spin-around': 'spinAround calc(var(--speed,3s) * 2) infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        logoSlide: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmerSlide: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(100cqw - 100%))' },
        },
        spinAround: {
          '0%': { transform: 'rotate(0deg)' },
          '15%': { transform: 'rotate(90deg)' },
          '35%': { transform: 'rotate(90deg)' },
          '65%': { transform: 'rotate(270deg)' },
          '85%': { transform: 'rotate(270deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  safelist: [
    {
      pattern: /(from|to|via)-(red|orange|amber|yellow|green|emerald|teal|cyan|blue|indigo|purple|pink|rose)-(100|200|300|400|500|600|700|800)/,
    },
  ],
  plugins: [],
}
