/**
 * Valora Client Motion & Device Detection Utilities
 *
 * Lightweight detection helpers that execute without dragging
 * GSAP, ScrollTrigger, or Lenis animation runtimes into bundles.
 */

/**
 * Check if the current user agent is on a mobile/tablet screen or touch device.
 */
export function isTouchOrMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(max-width: 768px)').matches ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  )
}

/**
 * Check if user prefers reduced motion.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
