/**
 * Design tokens for Valence CLV Intelligence Platform.
 * Single source of truth for analytical charts, visualization scales, and TypeScript consumption.
 */

export const designTokens = {
  colors: {
    background: 'var(--background)',
    foreground: 'var(--foreground)',
    foregroundMuted: 'var(--foreground-muted)',
    foregroundSubtle: 'var(--foreground-subtle)',
    card: 'var(--card)',
    cardForeground: 'var(--card-foreground)',
    primary: 'var(--primary)',
    primaryHover: 'var(--primary-hover)',
    primaryLight: 'var(--primary-light)',
    primarySurface: 'var(--primary-surface)',
    border: 'var(--border)',
    borderSubtle: 'var(--border-subtle)',
    borderStrong: 'var(--border-strong)',
    destructive: 'var(--destructive)',
    success: 'var(--success)',
    warning: 'var(--warning)',
  },
  charts: {
    series1: 'var(--chart-1)', // Primary / Observed CLV
    series2: 'var(--chart-2)', // ML Forecast / Predicted LTV
    series3: 'var(--chart-3)', // High-Tier Expansion
    series4: 'var(--chart-4)', // Mid-Tier Cohort
    series5: 'var(--chart-5)', // Churn Risk
    grid: 'var(--chart-grid)',
    hex: {
      series1: '#0d9488', // Teal-600
      series2: '#0284c7', // Sky-600
      series3: '#6366f1', // Indigo-500
      series4: '#d97706', // Amber-600
      series5: '#e11d48', // Rose-600
      grid: '#e2e8f0', // Slate-200
    },
  },
  typography: {
    fontSans: 'var(--font-sans)',
    fontMono: 'var(--font-mono)',
  },
  radii: {
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
    normal: '200ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
} as const

export type DesignTokens = typeof designTokens
