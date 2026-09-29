/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ige: {
          bg: '#0A0D14',
          card: '#121624',
          border: '#1F263B',
          accent: '#6366F1',
          cyan: '#06B6D4',
          emerald: '#10B981',
          rose: '#F43F5E',
          purple: '#8B5CF6',
          amber: '#F59E0B'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-gradient': 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
      }
    },
  },
  plugins: [],
}
