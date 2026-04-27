import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts,js}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1a2238',
          dark:    '#0b1733',
          muted:   '#475069',
          subtle:  '#8089a0',
          faint:   '#5a637d',
        },
        accent:  '#1f6feb',
        surface: {
          DEFAULT: '#f6f7fb',
          card:    '#ffffff',
          hover:   '#f9fafd',
          muted:   '#f1f3f9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      maxWidth: {
        content: '1100px',
      },
    },
  },
  plugins: [],
} satisfies Config
