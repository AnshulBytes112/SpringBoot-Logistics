/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#0b0f19',
        bgSecondary: '#131a29',
        accentSolid: '#00c3ff',
        accentHover: '#00e5ff',
        textPrimary: '#e2e8f0',
        textSecondary: '#94a3b8',
        glassBorder: 'rgba(255, 255, 255, 0.08)',
        statusPosted: '#eab308',
        statusBooked: '#3b82f6',
        statusAccepted: '#22c55e',
        statusCancelled: '#ef4444'
      }
    },
  },
  plugins: [],
}
