/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        secondary: '#8B5CF6',
        accent: '#EC4899',
        surface: '#FFFFFF',
        background: '#F9FAFB',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        'surface-50': '#f8fafc',
        'surface-100': '#f1f5f9',
        'surface-200': '#e2e8f0',
        'surface-300': '#cbd5e1',
        'surface-400': '#94a3b8',
        'surface-500': '#64748b',
        'surface-600': '#475569',
        'surface-700': '#334155',
        'surface-800': '#1e293b',
        'surface-900': '#0f172a'
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      scale: {
        '102': '1.02',
        '105': '1.05'
      }
    },
  },
  plugins: [],
}