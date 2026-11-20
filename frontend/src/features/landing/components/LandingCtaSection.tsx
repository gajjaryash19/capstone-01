import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useGsapAnimation, gsap } from '@/lib/motion'
import { prefetchRoute } from '@/lib/router/prefetch'

export function LandingCtaSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGsapAnimation(
    (context) => {
      if (context.data.isReduced) return

      context.add(() => {
        gsap.from('.cta-content', {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          },
          opacity: 0,
          y: 28,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'all',
        })
      })
    },
    { scope: containerRef },
  )

  return (
    <section
      ref={containerRef}
      className="relative py-24 sm:py-32 lg:py-40 border-b border-border bg-background overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="cta-content max-w-4xl space-y-8">
          <span className="font-mono text-xs text-accent font-semibold uppercase tracking-wider block">
            SECTION 08 — GET STARTED
          </span>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tighter text-foreground leading-[0.98]">
            Retain high-value customers with confidence.
          </h2>

          <p className="text-base sm:text-xl text-foreground-muted font-light leading-relaxed max-w-2xl">
            Explore customer lifetime value projections, behavioral segments, and retention
            opportunities in the Valora platform.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-xs font-mono font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-150 active:scale-[0.98] shadow-sm cursor-pointer"
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
              className="h-12 px-7 text-xs font-mono bg-surface border-border text-foreground hover:bg-surface-elevated transition-all duration-150 active:scale-[0.98] cursor-pointer"
            >
              <Link
                to="/app/customers"
                onPointerEnter={() => {
                  prefetchRoute('appLayout')
                  prefetchRoute('customers')
                }}
              >
                <span>View Customers</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingCtaSection
