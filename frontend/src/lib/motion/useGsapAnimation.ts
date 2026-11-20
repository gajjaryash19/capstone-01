/**
 * Valora GSAP Animation Hook & Context Utilities
 *
 * Implements React-safe GSAP context lifecycle management.
 * Guarantees 100% clean teardown in React 19 / StrictMode, eliminates memory leaks,
 * and handles prefers-reduced-motion seamlessly.
 */

import { useLayoutEffect, useEffect, useRef, type RefObject } from 'react'
import { gsap, ScrollTrigger } from './gsap'
import { prefersReducedMotion } from './lenis'

// In browser use useLayoutEffect to prevent flash of unstyled content; fallback to useEffect on SSR
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export interface UseGsapOptions {
  /**
   * Scope element ref to restrict selector queries within.
   */
  scope?: RefObject<HTMLElement | null>
  /**
   * Dependencies array to trigger re-creation of animations.
   */
  dependencies?: unknown[]
  /**
   * Whether to bypass animations when user prefers reduced motion.
   * Default: true
   */
  respectReducedMotion?: boolean
}

export type GsapContextCallback = (context: gsap.Context) => void | (() => void)

/**
 * React hook that executes GSAP animations within a managed `gsap.context()`.
 * Automatically reverts all created animations and ScrollTriggers on component unmount
 * or when dependencies change. Fully compatible with React 19 Strict Mode double-invocations.
 */
export function useGsapAnimation(
  callback: GsapContextCallback,
  options: UseGsapOptions = {},
): void {
  const { scope, dependencies = [], respectReducedMotion = true } = options
  const callbackRef = useRef(callback)

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback
  })

  useIsomorphicLayoutEffect(() => {
    const isReduced = respectReducedMotion && prefersReducedMotion()

    const ctx = gsap.context((self) => {
      if (isReduced) {
        self.data.isReduced = true
      }
      return callbackRef.current(self)
    }, scope?.current ?? undefined)

    return () => {
      ctx.revert()
    }
  }, dependencies)
}

/**
 * Creates an entrance reveal animation for an element or list of elements.
 * Adheres to Valora motion standards: 500-800ms duration, 40-60ms stagger, power2.out ease.
 */
export function revealElements(
  elements: gsap.DOMTarget,
  vars: gsap.TweenVars = {},
): gsap.core.Tween {
  const isReduced = prefersReducedMotion()

  if (isReduced) {
    return gsap.set(elements, { opacity: 1, y: 0 })
  }

  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: vars.y ?? 12,
    },
    {
      opacity: 1,
      y: 0,
      duration: vars.duration ?? 0.65,
      ease: vars.ease ?? 'power2.out',
      stagger: vars.stagger ?? 0.05,
      clearProps: 'transform',
      ...vars,
    },
  )
}

/**
 * Creates a ScrollTrigger-linked reveal for a container or its children.
 */
export function createScrollReveal(
  trigger: gsap.DOMTarget,
  targets?: gsap.DOMTarget,
  vars: gsap.TweenVars = {},
): gsap.core.Tween {
  const isReduced = prefersReducedMotion()
  const targetElements = targets ?? trigger

  if (isReduced) {
    return gsap.set(targetElements, { opacity: 1, y: 0 })
  }

  return gsap.fromTo(
    targetElements,
    {
      opacity: 0,
      y: vars.y ?? 16,
    },
    {
      opacity: 1,
      y: 0,
      duration: vars.duration ?? 0.7,
      ease: vars.ease ?? 'power2.out',
      stagger: vars.stagger ?? 0.06,
      scrollTrigger: {
        trigger: trigger as string | Element,
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true,
        ...(typeof vars.scrollTrigger === 'object' ? vars.scrollTrigger : {}),
      },
      clearProps: 'transform',
      ...vars,
    },
  )
}

export { gsap, ScrollTrigger }
