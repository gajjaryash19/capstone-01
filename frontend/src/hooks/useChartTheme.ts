import { useTheme, type ResolvedTheme } from '@/hooks/useTheme'

export interface ChartThemeColors {
  series1: string
  series2: string
  series3: string
  series4: string
  series5: string
  grid: string
  axis: string
  axisSubtle: string
  cursor: string
  tooltipBg: string
  tooltipBorder: string
  positive: string
  neutral: string
  warning: string
  negative: string
}

export const chartThemes: Record<ResolvedTheme, ChartThemeColors> = {
  dark: {
    series1: '#e4e4e7', // Crisp Silver / Observed CLV
    series2: '#a1a1aa', // Muted Zinc / ML Projected
    series3: '#71717a', // Deep Neutral / High-Tier
    series4: '#d4d4d8', // Light Silver / Mid-Tier
    series5: '#ef4444', // Semantic Red / Churn Risk
    grid: '#27292d',
    axis: '#96989d',
    axisSubtle: '#62656b',
    cursor: 'rgba(255, 255, 255, 0.04)',
    tooltipBg: '#18191c',
    tooltipBorder: '#27292d',
    positive: '#10b981',
    neutral: '#96989d',
    warning: '#f59e0b',
    negative: '#ef4444',
  },
  light: {
    series1: '#18181b', // Zinc-900 / Observed
    series2: '#52525b', // Zinc-600 / Projected
    series3: '#71717a', // Zinc-500 / High-Tier
    series4: '#a1a1aa', // Zinc-400 / Mid-Tier
    series5: '#ef4444', // Red-500 / Churn Risk
    grid: '#e4e4e7',
    axis: '#71717a',
    axisSubtle: '#a1a1aa',
    cursor: 'rgba(0, 0, 0, 0.04)',
    tooltipBg: '#ffffff',
    tooltipBorder: '#e4e4e7',
    positive: '#059669',
    neutral: '#71717a',
    warning: '#d97706',
    negative: '#ef4444',
  },
}

/**
 * Returns reactive, monochromatic theme-aware hex colors for Recharts SVG rendering.
 * Automatically updates when the active theme toggles between Dark and Light.
 */
export function useChartTheme(): ChartThemeColors {
  const { resolvedTheme } = useTheme()
  return chartThemes[resolvedTheme]
}

export default useChartTheme
