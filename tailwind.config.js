import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        // Courtside palette (tokens.ts)
        primary: {
          DEFAULT: '#974ca8',
          soft: '#f0e3f3',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#d7622c',
          soft: '#fbe3d3',
          foreground: '#ffffff',
        },
        ink: {
          DEFAULT: '#1b1a17',
          70: 'rgba(27,26,23,0.72)',
          50: 'rgba(27,26,23,0.5)',
          30: 'rgba(27,26,23,0.3)',
          15: 'rgba(27,26,23,0.15)',
        },
        paper: {
          DEFAULT: '#fbfaf6',
          deep: '#f3f0e8',
        },
        success: '#2d8659',
        danger: '#c03a3a',
        border: 'rgba(27,26,23,0.15)',
        input: 'rgba(27,26,23,0.15)',
        ring: '#974ca8',
        background: '#fbfaf6',
        foreground: '#1b1a17',
        muted: {
          DEFAULT: '#f3f0e8',
          foreground: 'rgba(27,26,23,0.72)',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1b1a17',
        },
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '10px',
        xl: '16px',
        full: '9999px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontVariantNumeric: {
        tabular: 'tabular-nums',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,.06), 0 2px 6px rgba(0,0,0,.04)',
        raised:
          '0 2px 6px rgba(0,0,0,.08), 0 12px 24px rgba(0,0,0,.08)',
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom, 0px)',
      },
    },
  },
  plugins: [animate],
};
