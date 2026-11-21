/**
 * Valora Cinematic Loader & Homepage Reveal
 *
 * High-end preloader and reveal sequence inspired by the Melon Studio reference.
 * Engineered with:
 * 1. Minimal full-screen overlay with Valora brand mark and typography.
 * 2. Continuous, non-jittering 0 -> 100 numeric counter synchronized with hairline progress line.
 * 3. Brief hold at 100% completion.
 * 4. Upward counter exit beyond viewport with deliberate acceleration.
 * 5. Upward curtain sweep revealing the prepared homepage underneath.
 * 6. Coordinated trigger for homepage entrance choreography.
 * 7. Reload-aware: clears on page reload (F5 / refresh) so loader always runs on reload,
 *    persists across SPA route changes, and handles React StrictMode cleanly without freezing.
 * 8. Theme-aware semantic tokens and prefers-reduced-motion support.
 */

import { useState, useRef, useEffect } from 'react'
import { gsap } from '@/lib/motion/gsap'
import { prefersReducedMotion, isTouchOrMobileDevice } from '@/lib/motion/device'
import { ValoraMark } from '@/components/brand/ValoraLogo'

const LOADER_SESSION_KEY = 'valora_has_loaded_session'

// Clear session key on page reload so refreshing the browser always plays the loader
if (typeof window !== 'undefined') {
  try {
    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
    if (navEntries.length > 0 && navEntries[0].type === 'reload') {
      sessionStorage.removeItem(LOADER_SESSION_KEY)
    }
  } catch {
    // fallback
  }

  window.addEventListener('beforeunload', () => {
    try {
      sessionStorage.removeItem(LOADER_SESSION_KEY)
    } catch {
      // ignore
    }
  })
}

function checkShouldShowLoader(force = false): boolean {
  if (force) return true
  if (typeof window === 'undefined') return false

  try {
    return !sessionStorage.getItem(LOADER_SESSION_KEY)
  } catch {
    return true
  }
}

export interface ValoraLoaderProps {
  /**
   * Callback triggered when the loader animation sequence completes and is unmounted.
   */
  onComplete?: () => void
  /**
   * Callback triggered as the loader begins its upward reveal sweep,
   * signaling the homepage hero and elements to begin their coordinated entrance.
   */
  onReveal?: () => void
  /**
   * If true, forces the loader to run even if already shown.
   */
  force?: boolean
  /**
   * Minimum duration in seconds for progress counter sequence.
   * Default: 0.18s for crisp, non-blocking LCP (< 800ms)
   */
  minDuration?: number
}

export function ValoraLoader({
  onComplete,
  onReveal,
  force = false,
  minDuration = 0.18,
}: ValoraLoaderProps) {
  const [shouldRender, setShouldRender] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      if (isTouchOrMobileDevice() || prefersReducedMotion()) {
        return false
      }
    }
    return checkShouldShowLoader(force)
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const topBarRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const statusLabelRef = useRef<HTMLDivElement>(null)
  const counterWrapperRef = useRef<HTMLDivElement>(null)
  const numberRef = useRef<HTMLSpanElement>(null)
  const progressLineRef = useRef<HTMLDivElement>(null)

  // Keep latest callbacks in refs so changing callback references NEVER re-trigger useEffect
  const onRevealRef = useRef(onReveal)
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onRevealRef.current = onReveal
    onCompleteRef.current = onComplete
  })

  useEffect(() => {
    if (!shouldRender) {
      onRevealRef.current?.()
      onCompleteRef.current?.()
      return
    }

    const isReduced = prefersReducedMotion()
    const isMobile = isTouchOrMobileDevice()

    // Reduced motion or mobile touch: skip animation completely and reveal immediately
    if (isReduced || isMobile || !containerRef.current) {
      try {
        sessionStorage.setItem(LOADER_SESSION_KEY, 'true')
      } catch {
        // ignore
      }
      setShouldRender(false)
      onRevealRef.current?.()
      onCompleteRef.current?.()
      return
    }

    const ctx = gsap.context(() => {
      const counterObj = { value: 0 }
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          try {
            sessionStorage.setItem(LOADER_SESSION_KEY, 'true')
          } catch {
            // ignore
          }
          setShouldRender(false)
          onCompleteRef.current?.()
        },
      })

      // Stage 1: Initial Layout Setup
      gsap.set(containerRef.current, { yPercent: 0, opacity: 1, visibility: 'visible' })
      gsap.set(brandRef.current, { y: 16, opacity: 0 })
      gsap.set([topBarRef.current, statusLabelRef.current], { y: 10, opacity: 0 })
      gsap.set(counterWrapperRef.current, { yPercent: 0, opacity: 1 })
      gsap.set(progressLineRef.current, { scaleX: 0, transformOrigin: 'left center' })

      // Stage 2: Brand and Editorial Entrance
      tl.to(
        brandRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.1,
          ease: 'power3.out',
        },
        0.02,
      )
        .to(
          [topBarRef.current, statusLabelRef.current],
          {
            y: 0,
            opacity: 1,
            duration: 0.1,
            ease: 'power2.out',
          },
          0.04,
        )

        // Stage 3: Smooth 0 -> 100 Counter & Synced Hairline Progress
        .to(
          counterObj,
          {
            value: 100,
            duration: minDuration,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (numberRef.current) {
                const rounded = Math.floor(counterObj.value)
                numberRef.current.textContent = String(rounded).padStart(2, '0')
              }
            },
          },
          0.06,
        )
        .to(
          progressLineRef.current,
          {
            scaleX: 1,
            duration: minDuration,
            ease: 'power2.inOut',
          },
          0.06,
        )

        // Stage 4: Brief Hold at 100% then Counter Exit Upward
        .to(
          counterWrapperRef.current,
          {
            yPercent: -140,
            opacity: 0,
            duration: 0.1,
            ease: 'power3.in',
            onStart: () => {
              // Trigger homepage entrance as counter completes
              onRevealRef.current?.()
            },
          },
          `+=${0.02}`,
        )
        .to(
          [brandRef.current, statusLabelRef.current, topBarRef.current],
          {
            y: -24,
            opacity: 0,
            duration: 0.1,
            ease: 'power2.in',
          },
          '<',
        )
        .to(
          progressLineRef.current,
          {
            opacity: 0,
            duration: 0.08,
            ease: 'power2.out',
          },
          '<',
        )

        // Stage 5: Loader Curtain Sweeps Upward to Reveal Homepage
        .to(
          containerRef.current,
          {
            yPercent: -100,
            duration: 0.18,
            ease: 'power4.inOut',
          },
          '-=0.02',
        )
    }, containerRef)

    return () => {
      ctx.revert()
    }
  }, [shouldRender, minDuration, force])

  if (!shouldRender) {
    return null
  }

  return (
    <div
      ref={containerRef}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading Valora Platform"
      className="fixed inset-0 z-9999 pointer-events-auto select-none overflow-hidden bg-background text-foreground border-b border-border/60 will-change-transform flex flex-col justify-between p-6 sm:p-10 md:p-14"
    >
      {/* Top Editorial Bar */}
      <div
        ref={topBarRef}
        className="flex items-center justify-between text-xs font-mono text-foreground-muted tracking-wider"
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-foreground uppercase text-[11px] font-semibold tracking-widest">
            VALORA
          </span>
        </div>
        <span className="text-[11px] uppercase tracking-widest hidden sm:inline text-foreground-subtle font-mono">
          Customer Lifetime Value Intelligence
        </span>
        <span className="text-[11px] font-mono text-foreground-muted">v1.0 // 2026</span>
      </div>

      {/* Center Brand Identity */}
      <div
        ref={brandRef}
        className="my-auto flex flex-col items-center justify-center text-center space-y-4"
      >
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-surface border border-border shadow-2xl">
          <ValoraMark size={32} className="text-foreground" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-5xl font-light tracking-tighter text-foreground">
            VALORA
          </h1>
          <p className="text-[11px] sm:text-xs font-mono tracking-widest text-foreground-muted uppercase">
            Autonomous Customer Intelligence
          </p>
        </div>
      </div>

      {/* Bottom Interface: Subtle Status + Oversized Numeric Counter */}
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div ref={statusLabelRef} className="flex flex-col space-y-1">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-foreground-subtle">
              System Initialization
            </span>
            <span className="text-xs text-foreground-muted font-light hidden sm:inline font-mono">
              Calibrating non-contractual predictive models
            </span>
          </div>

          {/* Large Melon-Style Numeric Counter */}
          <div
            ref={counterWrapperRef}
            className="flex items-baseline font-mono tabular-nums leading-none will-change-transform"
          >
            <span
              ref={numberRef}
              className="text-6xl sm:text-8xl md:text-9xl font-light tracking-tight text-foreground"
            >
              00
            </span>
            <span className="text-2xl sm:text-4xl text-accent font-normal ml-1">%</span>
          </div>
        </div>

        {/* 1px Hairline Progress Line */}
        <div className="relative h-1 w-full bg-border/40 overflow-hidden rounded-full">
          <div ref={progressLineRef} className="absolute inset-y-0 left-0 w-full bg-accent" />
        </div>
      </div>
    </div>
  )
}

export default ValoraLoader
