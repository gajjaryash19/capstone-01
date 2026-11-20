/**
 * Valora Lenis Smooth Scroll React Context
 */

import { createContext, useContext } from 'react'
import type Lenis from 'lenis'

export interface SmoothScrollContextValue {
  lenis: Lenis | null
  scrollTo: (
    target: number | string | HTMLElement,
    options?: Parameters<Lenis['scrollTo']>[1],
  ) => void
  isMobile: boolean
  isReducedMotion: boolean
}

export const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  scrollTo: () => {},
  isMobile: false,
  isReducedMotion: false,
})

/**
 * Hook to access smooth-scroll state and control functions.
 */
export function useSmoothScroll(): SmoothScrollContextValue {
  return useContext(SmoothScrollContext)
}
