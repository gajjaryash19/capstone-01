import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { gsap } from '@/lib/motion/gsap'
import { useGsapAnimation } from '@/lib/motion/useGsapAnimation'
import { useSmoothScroll } from '@/lib/motion/useSmoothScroll'
import { prefersReducedMotion } from '@/lib/motion/device'
import { prefetchRoute } from '@/lib/router/prefetch'

export interface LandingHeroProps {
  /**
   * Controlled by the Cinematic Loader sequence.
   * When false, the hero waits beneath the loader.
   * When toggled to true (as loader reveals), the choreographed entrance begins.
   */
  isRevealed?: boolean
}

export function LandingHero({ isRevealed = true }: LandingHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<HTMLDivElement>(null)
  const tickerRef = useRef<HTMLDivElement>(null)
  const hasAnimatedRef = useRef(false)
  const { scrollTo } = useSmoothScroll()

  // Track and trigger the coordinated reveal when isRevealed becomes true
  useEffect(() => {
    if (!isRevealed || hasAnimatedRef.current || !containerRef.current) return

    const isReduced = prefersReducedMotion()
    const targets = [
      eyebrowRef.current,
      headlineRef.current,
      paragraphRef.current,
      ctaRef.current,
      widgetRef.current,
      tickerRef.current,
    ].filter(Boolean)

    if (isReduced) {
      gsap.set(targets, { opacity: 1, y: 0, clearProps: 'all' })
      hasAnimatedRef.current = true
      return
    }

    hasAnimatedRef.current = true

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          gsap.set(targets, { clearProps: 'transform' })
        },
      })

      // Initial state
      gsap.set(targets, { opacity: 0 })
      gsap.set(eyebrowRef.current, { y: -12 })
      gsap.set(headlineRef.current, { y: 44 })
      gsap.set(paragraphRef.current, { y: 24 })
      gsap.set(ctaRef.current, { y: 18 })
      gsap.set(widgetRef.current, { y: 32, scale: 0.97 })
      gsap.set(tickerRef.current, { y: 12 })

      // Coordinated reveal timeline synchronized with loader curtain lift
      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.04)
        .to(headlineRef.current, { opacity: 1, y: 0, duration: 1.05, ease: 'power4.out' }, 0.1)
        .to(paragraphRef.current, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }, 0.22)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, 0.32)
        .to(
          widgetRef.current,
          { opacity: 1, y: 0, scale: 1, duration: 0.95, ease: 'power3.out' },
          0.26,
        )
        .to(
          tickerRef.current,
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', clearProps: 'all' },
          0.42,
        )
    }, containerRef)

    return () => ctx.revert()
  }, [isRevealed])

  // Set initial hidden state if loader is active and has not yet animated
  useGsapAnimation(
    (context) => {
      if (hasAnimatedRef.current || context.data.isReduced) return

      if (!isRevealed) {
        context.add(() => {
          gsap.set(
            [
              eyebrowRef.current,
              headlineRef.current,
              paragraphRef.current,
              ctaRef.current,
              widgetRef.current,
              tickerRef.current,
            ],
            { opacity: 0 },
          )
        })
      }
    },
    { scope: containerRef },
  )

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] flex flex-col justify-between pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-48 lg:pb-24 overflow-hidden border-b border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-between">
        {/* Top Eyebrow Metadata Bar */}
        <div
          ref={eyebrowRef}
          className="flex items-center justify-between text-xs font-mono text-foreground-muted tracking-wider border-b border-border/60 pb-4"
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-foreground font-medium">SECTION 01 // OVERVIEW</span>
          </div>
          <span className="hidden sm:inline text-foreground-subtle">
            CUSTOMER LIFETIME VALUE INTELLIGENCE
          </span>
          <span>EST. 2026</span>
        </div>

        {/* Hero Central Typography Composition */}
        <div className="my-auto py-12 lg:py-16 space-y-8">
          <h1
            ref={headlineRef}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tighter text-foreground leading-[0.95] max-w-6xl"
          >
            Know the value of <span className="italic font-serif text-foreground-muted">every</span>{' '}
            customer.
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pt-4">
            <div className="lg:col-span-6 space-y-6">
              <p
                ref={paragraphRef}
                className="text-base sm:text-xl text-foreground-muted font-light leading-relaxed max-w-xl"
              >
                Turn customer behavior into long-term value. Understand, segment, and anticipate
                your customers with a mathematically grounded view of lifetime value.
              </p>

              <div
                ref={ctaRef}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
              >
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-7 text-xs font-mono font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-150 active:scale-[0.98] shadow-sm cursor-pointer"
                >
                  <Link
                    to="/app"
                    onPointerEnter={() => {
                      prefetchRoute('appLayout')
                      prefetchRoute('overview')
                    }}
                  >
                    <span>Open Dashboard</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 px-6 text-xs font-mono bg-surface border-border text-foreground hover:bg-surface-elevated hover:border-border-strong transition-all duration-150 active:scale-[0.98] cursor-pointer"
                >
                  <a
                    href="#product-showcase"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollTo('#product-showcase', { offset: -60 })
                    }}
                  >
                    <span>Explore Platform</span>
                  </a>
                </Button>
              </div>
            </div>

            {/* Distinctive Hero Visual Element: Live Intelligence Anchor */}
            <div ref={widgetRef} className="lg:col-span-6 flex justify-start lg:justify-end">
              <div className="w-full max-w-md rounded-xl border border-border bg-surface p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between text-xs font-mono text-foreground-subtle">
                  <span>BENCHMARK DATASET</span>
                  <span className="text-accent font-semibold">CALIBRATED</span>
                </div>

                <div className="flex items-baseline justify-between border-b border-border pb-3">
                  <div>
                    <div className="text-2xl sm:text-3xl font-light tabular-nums font-mono text-foreground">
                      $4,820.00
                    </div>
                    <div className="text-[11px] text-foreground-muted">
                      Average 12M Predicted CLV
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono text-accent font-semibold">+12.4%</div>
                    <div className="text-[10px] text-foreground-subtle">vs. Baseline</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                  <div>
                    <span className="text-foreground-subtle block">MODEL</span>
                    <span className="text-foreground">BG/NBD + Gamma</span>
                  </div>
                  <div>
                    <span className="text-foreground-subtle block">ACCURACY</span>
                    <span className="text-foreground">94.2% MAPE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Baseline Ticker */}
        <div
          ref={tickerRef}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-6 border-t border-border/60 text-xs font-mono text-foreground-subtle"
        >
          <span>SAMPLE COHORT: 36 CUSTOMER ACCOUNTS</span>
          <span>REVENUE CONCENTRATION ANALYSIS (80/20 PARETO)</span>
        </div>
      </div>
    </section>
  )
}

export default LandingHero
