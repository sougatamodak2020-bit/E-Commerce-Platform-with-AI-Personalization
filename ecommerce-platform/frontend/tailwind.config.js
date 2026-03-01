/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Royal Gold Palette
        'royal-gold': {
          DEFAULT: '#D4AF37',
          light: '#F4D160',
          dark: '#B8960C',
          50: '#FDF8E8',
          100: '#FCF0C8',
          200: '#F9E08F',
          300: '#F4D160',
          400: '#E8C234',
          500: '#D4AF37',
          600: '#B8960C',
          700: '#8F7409',
          800: '#665307',
          900: '#3D3204',
        },
        // Royal Purple Palette
        'royal-purple': {
          DEFAULT: '#1A0A2E',
          light: '#2D1B4E',
          dark: '#0D0518',
          50: '#E8E4F0',
          100: '#D1C9E1',
          200: '#A393C3',
          300: '#755DA5',
          400: '#4A3078',
          500: '#2D1B4E',
          600: '#1A0A2E',
          700: '#0D0518',
          800: '#060209',
          900: '#020103',
        },
        // Cream & Ivory
        'royal-cream': '#FDF8F0',
        'royal-ivory': '#FFFEF9',
        'royal-champagne': '#F7E7CE',
        // Accent Colors
        'royal-burgundy': '#722F37',
        'royal-wine': '#4A1C24',
        'royal-charcoal': '#1A1A2E',
        'royal-slate': '#2E2E4A',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        elegant: ['Cormorant Garamond', 'serif'],
        body: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'fade-in-left': 'fadeInLeft 0.6s ease-out forwards',
        'fade-in-right': 'fadeInRight 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s infinite',
        'shimmer': 'shimmer 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'gradient': 'gradient-shift 5s ease infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-royal': 'linear-gradient(135deg, #D4AF37 0%, #F4D160 50%, #D4AF37 100%)',
        'gradient-purple': 'linear-gradient(135deg, #1A0A2E 0%, #2D1B4E 50%, #1A0A2E 100%)',
        'gradient-luxury': 'linear-gradient(135deg, #0D0518 0%, #1A0A2E 25%, #2D1B4E 50%, #1A0A2E 75%, #0D0518 100%)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(212, 175, 55, 0.3)',
        'gold-lg': '0 10px 40px rgba(212, 175, 55, 0.4)',
        'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner-gold': 'inset 0 2px 4px 0 rgba(212, 175, 55, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
