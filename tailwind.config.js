/** @type {import('tailwindcss').Config} */
export default {
  // ✅ Tailwind scanne ces fichiers pour générer uniquement
  // les classes CSS utilisées (pas de CSS inutile en prod)
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // 🎨 Tes couleurs personnalisées (identiques au HTML demo)
      colors: {
        bg: {
          DEFAULT: '#0a0a0f',
          2: '#111118',
          3: '#1a1a24',
        },
        accent: {
          DEFAULT: '#7c6af7',
          2: '#5eead4',
        },
        muted: '#7a7890',
      },

      // 🔤 Tes polices Google Fonts
      fontFamily: {
        head: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },

      // ✨ Animations personnalisées
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)' },
          '50%':       { opacity: '0.5', transform: 'scale(1.3)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'pulse-dot': 'pulse 2s infinite',
      },
    },
  },

  plugins: [],
}
