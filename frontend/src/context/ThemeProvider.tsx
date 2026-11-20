import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { ThemeContext } from './ThemeContext'
import {
  type Theme,
  type ResolvedTheme,
  STORAGE_KEY,
  getStoredTheme,
  getSystemTheme,
} from './theme-types'

function applyThemeToDOM(resolved: ResolvedTheme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.setAttribute('data-theme', resolved)
  root.classList.toggle('dark', resolved === 'dark')
  root.classList.toggle('light', resolved === 'light')
  root.style.colorScheme = resolved
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme)
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme)

  // Derived state: zero cascading setState within useEffect
  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme

  // Synchronize DOM attributes and localStorage on theme or resolvedTheme change
  useEffect(() => {
    applyThemeToDOM(resolvedTheme)

    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // In private browsing or quota exceeded
    }
  }, [theme, resolvedTheme])

  // System media query change listener
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
