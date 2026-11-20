/**
 * Design tokens for Valora Customer Intelligence Platform.
 * Single source of truth for analytical charts, visualization scales, and TypeScript consumption.
 */

import { chartThemes, useChartTheme, type ChartThemeColors } from '@/hooks/useChartTheme'
import { DURATION_MS, EASINGS, MOTION_CLASSES } from './motion'

export { chartThemes, useChartTheme, type ChartThemeColors }
export * from './motion'

export const designTokens = {
  colors: {
    background: 'var(--background)',
    surface: 'var(--surface)',
    card: 'var(--card)',
    cardForeground: 'var(--card-foreground)',
    popover: 'var(--popover)',
    popoverForeground: 'var(--popover-foreground)',
    foreground: 'var(--foreground)',
    foregroundMuted: 'var(--foreground-muted)',
    foregroundSubtle: 'var(--foreground-subtle)',
    primary: 'var(--primary)',
    primaryHover: 'var(--primary-hover)',
    primaryLight: 'var(--primary-light)',
    primarySurface: 'var(--primary-surface)',
    accent: 'var(--accent)',
    accentHover: 'var(--accent-hover)',
    accentMuted: 'var(--accent-muted)',
    accentForeground: 'var(--accent-foreground)',
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
    axis: 'var(--chart-axis)',
    /**
     * Dark-first fallback hex palette for static / non-React contexts.
     * React components should prefer `useChartTheme()` for dynamic reactivity on theme toggle.
     */
    hex: chartThemes.dark,
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
    xl: '0.75rem',
    full: '9999px',
  },
  transitions: {
    fast: `${DURATION_MS.fast}ms cubic-bezier(${EASINGS.out.join(', ')})`,
    normal: `${DURATION_MS.normal}ms cubic-bezier(${EASINGS.out.join(', ')})`,
    moderate: `${DURATION_MS.moderate}ms cubic-bezier(${EASINGS.out.join(', ')})`,
  },
  motion: MOTION_CLASSES,
} as const

export type DesignTokens = typeof designTokens
