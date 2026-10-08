/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#10212B',
          50: '#F0F4F7',
          100: '#D9E3EA',
          200: '#B4C7D5',
          300: '#8FAABF',
          400: '#698EAA',
          500: '#447295',
          600: '#345975',
          700: '#254055',
          800: '#1A2C3A',
          900: '#10212B',
          950: '#0A151C',
        },
        sage: {
          DEFAULT: '#8FA464',
          50: '#F5F8EF',
          100: '#E8EFD9',
          200: '#D2DFC1',
          300: '#BBCD9E',
          400: '#A5BC81',
          500: '#8FA464',
          600: '#758850',
          700: '#5C6C3E',
          800: '#434F2C',
          900: '#2B331C',
        },
        cream: {
          DEFAULT: '#EFFBDD',
          50: '#FAFEF6',
          100: '#EFFBDD',
          200: '#E2F7C2',
          300: '#D3F2A4',
          400: '#C2EB83',
          500: '#B0E361',
          600: '#94C745',
          700: '#729D30',
          800: '#527221',
          900: '#334814',
        },
        surface: {
          light: '#EFFBDD',
          card: '#FFFFFF',
          dark: '#10212B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'frame': '0.75rem',
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(16, 33, 43, 0.05)',
        'elevated': '0 10px 30px rgba(16, 33, 43, 0.08)',
      },
    },
  },
  plugins: [],
}
