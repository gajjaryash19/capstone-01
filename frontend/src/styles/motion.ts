/**
 * Valora Motion Design System
 *
 * Centralized motion tokens, easing curves, transition durations, and animation standards.
 * Follows an editorial, restrained motion language: fluid, calm, responsive, and precise.
 */

import type { Variants, Transition } from 'motion/react'

/** Standard cubic-bezier easing curves */
export const EASINGS = {
  /** Fluid, natural decelerating curve for entrances and micro-interactions */
  out: [0.16, 1, 0.3, 1] as const,
  /** Symmetrical curve for state switches and size morphing */
  inOut: [0.65, 0, 0.35, 1] as const,
  /** Precise, crisp curve for exits and dismissals */
  sharp: [0.4, 0, 0.2, 1] as const,
  /** GSAP-equivalent easing strings */
  gsap: {
    out: 'power2.out',
    inOut: 'power2.inOut',
    sharp: 'power3.in',
  },
} as const

/** Durations in seconds for Framer Motion & GSAP */
export const DURATION = {
  /** 120ms - Instant button presses, icon state flips */
  micro: 0.12,
  /** 180ms - Fast micro-interactions, tooltips, check toggles */
  fast: 0.18,
  /** 240ms - Standard UI transitions, tabs, dropdowns, card borders */
  normal: 0.24,
  /** 320ms - Modal openings, drawer slide-overs */
  moderate: 0.32,
  /** 600ms - Section reveals, major entrances */
  reveal: 0.6,
  /** 750ms - Cinematic / hero scroll reveals */
  revealSlow: 0.75,
  /** 600ms - Data visualization and chart series morphs */
  chart: 0.6,
} as const

/** Durations in milliseconds for CSS / Web Animations API */
export const DURATION_MS = {
  micro: 120,
  fast: 180,
  normal: 240,
  moderate: 320,
  reveal: 600,
  revealSlow: 750,
  chart: 600,
} as const

/** Stagger intervals in seconds */
export const STAGGER = {
  tight: 0.04,
  normal: 0.06,
  relaxed: 0.08,
} as const

/** Default spring configuration for tactile micro-interactions (no bounce) */
export const SPRING_PRECISE: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 35,
  mass: 0.8,
}

/** Standard micro-transition for interactive elements */
export const TRANSITION_MICRO: Transition = {
  duration: DURATION.micro,
  ease: EASINGS.out,
}

/** Standard normal transition for cards, dialogs, drawers */
export const TRANSITION_NORMAL: Transition = {
  duration: DURATION.normal,
  ease: EASINGS.out,
}

/**
 * Generates page-level entrance and exit motion variants.
 * Automatically eliminates spatial translation when reduced motion is preferred.
 */
export function getPageVariants(shouldReduceMotion: boolean | null | undefined = false): Variants {
  const isReduced = Boolean(shouldReduceMotion)
  return {
    initial: {
      opacity: 0,
      y: isReduced ? 0 : 6,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isReduced ? 0.01 : DURATION.normal,
        ease: EASINGS.out,
        when: 'beforeChildren',
      },
    },
    exit: {
      opacity: 0,
      y: isReduced ? 0 : -4,
      transition: {
        duration: isReduced ? 0.01 : DURATION.fast,
        ease: EASINGS.sharp,
      },
    },
  }
}

/**
 * Generates coordinated parent container variants for staggered children.
 */
export function getStaggerContainer(
  shouldReduceMotion: boolean | null | undefined = false,
  staggerDelay: number = STAGGER.tight,
): Variants {
  const isReduced = Boolean(shouldReduceMotion)
  return {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: isReduced ? 0 : staggerDelay,
        delayChildren: isReduced ? 0 : 0.02,
      },
    },
  }
}

/**
 * Generates coordinated child item variants.
 */
export function getItemVariants(shouldReduceMotion: boolean | null | undefined = false): Variants {
  const isReduced = Boolean(shouldReduceMotion)
  return {
    hidden: {
      opacity: 0,
      y: isReduced ? 0 : 6,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isReduced ? 0.01 : DURATION.fast,
        ease: EASINGS.out,
      },
    },
  }
}

/**
 * Modal dialog entrance/exit variants.
 */
export function getModalVariants(shouldReduceMotion: boolean | null | undefined = false): Variants {
  const isReduced = Boolean(shouldReduceMotion)
  return {
    closed: {
      opacity: 0,
      scale: isReduced ? 1 : 0.98,
      y: isReduced ? 0 : 8,
      transition: {
        duration: isReduced ? 0.01 : DURATION.fast,
        ease: EASINGS.sharp,
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: isReduced ? 0.01 : DURATION.moderate,
        ease: EASINGS.out,
      },
    },
  }
}

/**
 * Universal cross-fade variants for tabs, subtitles, and badges.
 */
export function getFadeVariants(shouldReduceMotion: boolean | null | undefined = false): Variants {
  const isReduced = Boolean(shouldReduceMotion)
  return {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: isReduced ? 0.01 : DURATION.fast,
        ease: EASINGS.out,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: isReduced ? 0.01 : DURATION.micro,
        ease: EASINGS.sharp,
      },
    },
  }
}

/**
 * CSS utility classes for standard micro-interactions.
 */
export const MOTION_CLASSES = {
  /** Subtle interactive card hover with border response and zero layout shift */
  cardHover:
    'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-border-strong hover:bg-surface-hover',
  /** Button press tactile feedback */
  buttonPress:
    'transition-all duration-150 ease-out active:scale-[0.98] active:translate-y-[0.5px]',
  /** Focus visible indicator */
  focusRing:
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
  /** Smooth table row hover */
  tableRowHover: 'transition-colors duration-150 ease-out hover:bg-surface-hover',
} as const
