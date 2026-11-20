/**
 * Valora Lenis & GSAP ScrollTrigger Synchronization Engine
 *
 * Ensures a single shared RAF loop drives both Lenis smooth scrolling
 * and GSAP ScrollTrigger position updates, preventing scroll jitter,
 * frame mismatches, and memory leaks.
 */

import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

export interface SmoothScrollOptions {
  /**
   * Linear interpolation (0 to 1). Lower = smoother/slower, Higher = tighter/snappier.
   * Default: 0.1 for restrained, natural smoothness without heavy inertia.
   */
  lerp?: number
  /**
   * Scroll duration in seconds if using duration-based easing.
   */
  duration?: number
  /**
   * Smooth wheel events.
   * Default: true
   */
  smoothWheel?: boolean
  /**
   * Whether to sync touch interactions. Kept false for native mobile touch responsiveness.
   * Default: false
   */
  syncTouch?: boolean
  /**
   * Respect system prefers-reduced-motion.
   * Default: true
   */
  respectReducedMotion?: boolean
  /**
   * Auto-bind anchor clicks (e.g. href="#features").
   * Default: true
   */
  anchors?: boolean
  /**
   * Multiplier for wheel sensitivity.
   * Default: 1
   */
  wheelMultiplier?: number
}

let lenisInstance: Lenis | null = null
let rafCallback: ((time: number) => void) | null = null
let scrollUpdateCallback: (() => void) | null = null

/**
 * Check if the current user agent is on a mobile/tablet screen or touch device.
 */
export function isTouchOrMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(max-width: 768px)').matches ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  )
}

/**
 * Check if user prefers reduced motion.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Initializes the singleton Lenis smooth-scroll instance and binds it with ScrollTrigger.
 */
export function initSmoothScroll(options: SmoothScrollOptions = {}): Lenis | null {
  if (typeof window === 'undefined') return null

  // If instance already exists, return current instance
  if (lenisInstance) {
    return lenisInstance
  }

  const isReduced = prefersReducedMotion()
  const isMobile = isTouchOrMobileDevice()

  // On mobile or reduced-motion, allow Lenis to operate in native/instant mode or restrained mode
  lenisInstance = new Lenis({
    lerp: options.lerp ?? (isMobile ? 0.2 : 0.1),
    duration: options.duration,
    smoothWheel: options.smoothWheel ?? !isReduced,
    syncTouch: options.syncTouch ?? false,
    wheelMultiplier: options.wheelMultiplier ?? 1,
    respectReducedMotion: options.respectReducedMotion ?? true,
    anchors: options.anchors ?? true,
    autoToggle: true,
  })

  // Synchronize ScrollTrigger with Lenis updates
  scrollUpdateCallback = () => {
    ScrollTrigger.update()
  }
  lenisInstance.on('scroll', scrollUpdateCallback)

  // Drive Lenis from GSAP's central ticker so there is strictly one RAF loop in the app
  rafCallback = (time: number) => {
    // gsap.ticker time is in seconds; Lenis.raf expects milliseconds
    lenisInstance?.raf(time * 1000)
  }
  gsap.ticker.add(rafCallback)
  // Turn off lagSmoothing in ticker to avoid jumps when ScrollTrigger performs pinning calculations
  gsap.ticker.lagSmoothing(0)

  return lenisInstance
}

/**
 * Retrieves the current active Lenis singleton, if initialized.
 */
export function getSmoothScroll(): Lenis | null {
  return lenisInstance
}

/**
 * Cleans up and destroys the Lenis instance and detaches from GSAP ticker.
 */
export function destroySmoothScroll(): void {
  if (rafCallback) {
    gsap.ticker.remove(rafCallback)
    rafCallback = null
  }

  if (lenisInstance) {
    if (scrollUpdateCallback) {
      lenisInstance.off('scroll', scrollUpdateCallback)
      scrollUpdateCallback = null
    }
    lenisInstance.destroy()
    lenisInstance = null
  }

  // Refresh ScrollTrigger to reset native scroll positions
  if (typeof window !== 'undefined') {
    ScrollTrigger.refresh()
  }
}
