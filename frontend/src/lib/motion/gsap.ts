/**
 * Valora GSAP Registration & Configuration Module
 *
 * Centralizes GSAP plugin registration, global defaults, and tick rate optimization.
 * Avoids redundant plugin registrations and ensures consistent easing and motion defaults.
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let isConfigured = false

/**
 * Configure and register GSAP plugins globally once.
 * Safe to call multiple times in SSR or client-side environments.
 */
export function configureGsap(): typeof gsap {
  if (typeof window === 'undefined') {
    return gsap
  }

  if (!isConfigured) {
    gsap.registerPlugin(ScrollTrigger)

    // Set production-grade global defaults
    gsap.defaults({
      ease: 'power2.out',
      duration: 0.6,
    })

    // Configure ScrollTrigger default tolerances
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true,
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    })

    isConfigured = true
  }

  return gsap
}

// Auto-initialize when imported on client
if (typeof window !== 'undefined') {
  configureGsap()
}

export { gsap, ScrollTrigger }
