/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E7D32',
          dark: '#1B5E20',
          light: '#E8F5E9',
        },
        secondary: '#66BB6A',
        light: '#E8F5E9',
        accent: {
          DEFAULT: '#F9A825',
          light: '#FFF8E1',
        },
        background: '#F7F9F5',
        ink: '#1F2937',
        muted: '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(31, 41, 55, 0.06)',
        'card-hover': '0 6px 24px rgba(31, 41, 55, 0.10)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
