/**
 * Valora Lenis Smooth Scroll React Integration Provider
 *
 * Provides a React context for accessing the active Lenis instance,
 * controlling scroll programmatically, and safely mounting smooth scroll on
 * marketing and content pages without forcing it on analytical dashboards.
 */

import { useEffect, useState, useMemo, type ReactNode } from 'react'
import type Lenis from 'lenis'
import {
  initSmoothScroll,
  destroySmoothScroll,
  getSmoothScroll,
  isTouchOrMobileDevice,
  prefersReducedMotion,
  type SmoothScrollOptions,
} from './lenis'
import { SmoothScrollContext, type SmoothScrollContextValue } from './useSmoothScroll'

export interface SmoothScrollProviderProps {
  children: ReactNode
  options?: SmoothScrollOptions
  /**
   * If true, enables smooth scroll. When false, smooth scroll is completely bypassed.
   * Default: true
   */
  enabled?: boolean
}

export function SmoothScrollProvider({
  children,
  options,
  enabled = true,
}: SmoothScrollProviderProps) {
  // Initialize lenis directly from the singleton external system
  const [lenis] = useState<Lenis | null>(() => (enabled ? initSmoothScroll(options) : null))
  const isMobile = useMemo(() => isTouchOrMobileDevice(), [])
  const isReducedMotion = useMemo(() => prefersReducedMotion(), [])

  useEffect(() => {
    if (!enabled) {
      destroySmoothScroll()
      return
    }

    // Ensure the external singleton is initialized
    initSmoothScroll(options)

    return () => {
      destroySmoothScroll()
    }
  }, [enabled, options])

  const contextValue = useMemo<SmoothScrollContextValue>(
    () => ({
      lenis,
      scrollTo: (
        target: number | string | HTMLElement,
        scrollOptions?: Parameters<Lenis['scrollTo']>[1],
      ) => {
        const active = getSmoothScroll()
        if (active) {
          active.scrollTo(target, scrollOptions)
        } else if (typeof window !== 'undefined') {
          if (typeof target === 'number') {
            window.scrollTo({ top: target, behavior: 'smooth' })
          } else if (typeof target === 'string') {
            const el = document.querySelector(target)
            el?.scrollIntoView({ behavior: 'smooth' })
          } else if (target instanceof HTMLElement) {
            target.scrollIntoView({ behavior: 'smooth' })
          }
        }
      },
      isMobile,
      isReducedMotion,
    }),
    [lenis, isMobile, isReducedMotion],
  )

  return (
    <SmoothScrollContext.Provider value={contextValue}>{children}</SmoothScrollContext.Provider>
  )
}
