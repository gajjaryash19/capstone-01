import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useGsapAnimation, gsap } from '@/lib/motion'
import { prefetchRoute } from '@/lib/router/prefetch'

export function LandingCapabilitiesSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGsapAnimation(
    (context) => {
      if (context.data.isReduced) return

      context.add(() => {
        gsap.from('.capability-block', {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          },
          opacity: 0,
          y: 24,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
          clearProps: 'transform',
        })
      })
    },
    { scope: containerRef },
  )

  return (
    <section
      id="capabilities"
      ref={containerRef}
      className="relative py-20 sm:py-28 lg:py-36 border-b border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 sm:mb-20">
          <div className="lg:col-span-4">
            <span className="font-mono text-xs text-accent font-semibold uppercase tracking-wider block mb-2">
              SECTION 05 — CAPABILITIES
            </span>
            <span className="text-sm font-mono text-foreground-subtle">
              CORE INTELLIGENCE PILLARS
            </span>
          </div>

          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-foreground leading-tight">
              Four specialized systems designed to inform every customer decision.
            </h2>
          </div>
        </div>

        {/* Varied Compositions for 4 Pillars */}
        <div className="space-y-12">
          {/* Pillar 01: Full-Width Asymmetric Banner — CLV Analysis */}
          <div className="capability-block rounded-2xl border border-border bg-surface p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="font-mono text-xs text-accent font-semibold">
                PILLAR 01 // OVERVIEW & VALUATION
              </span>
              <h3 className="text-2xl sm:text-4xl font-light tracking-tight text-foreground">
                Customer Lifetime Value Analysis
              </h3>
              <p className="text-sm sm:text-base text-foreground-muted font-light leading-relaxed">
                Portfolio-wide visibility into observed spend, predictive growth trajectories, and
                Pareto concentration. Understand which 20% of your customer accounts generate 80% of
                cumulative cashflow, and monitor real-time migration between tiers.
              </p>
              <div className="pt-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-mono border-border bg-surface-elevated text-foreground hover:bg-muted"
                >
                  <Link
                    to="/app"
                    onPointerEnter={() => {
                      prefetchRoute('appLayout')
                      prefetchRoute('overview')
                    }}
                  >
                    <span>Explore CLV Analysis</span>
                    <ArrowRight className="ml-1.5 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-xl border border-border bg-background p-6 font-mono text-xs space-y-3">
              <div className="flex justify-between border-b border-border pb-2 text-foreground-subtle">
                <span>PARETO VALUE CONCENTRATION</span>
                <span>STATUS: BALANCED</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-foreground-muted">Champions Tier</span>
                <span className="text-foreground font-bold">46.2% of Revenue</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-foreground-muted">Loyal Accounts</span>
                <span className="text-foreground font-bold">28.4% of Revenue</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-foreground-muted">At-Risk & Emerging</span>
                <span className="text-foreground font-bold">25.4% of Revenue</span>
              </div>
            </div>
          </div>

          {/* Pillars 02 & 03: 2-Column Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pillar 02: Customer Segmentation */}
            <div className="capability-block rounded-2xl border border-border bg-surface p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="font-mono text-xs text-foreground-muted font-semibold">
                  PILLAR 02 // COHORT CLUSTERING
                </span>
                <h3 className="text-2xl font-light tracking-tight text-foreground">
                  Behavioral Segmentation
                </h3>
                <p className="text-xs sm:text-sm text-foreground-muted font-light leading-relaxed">
                  Isolate accounts by discrete behavioral parameters rather than arbitrary
                  demographic tags. Track health metrics across Champions, Loyal, At-Risk, and
                  Dormant cohorts with specific churn probability thresholds.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
                  <div className="rounded-lg border border-border bg-background p-3">
                    <span className="text-[10px] text-foreground-subtle block">CHAMPIONS</span>
                    <span className="text-sm text-foreground font-semibold">$9,400+ CLV</span>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-3">
                    <span className="text-[10px] text-foreground-subtle block">AT RISK</span>
                    <span className="text-sm text-destructive font-semibold">&gt;40% Dropout</span>
                  </div>
                </div>
              </div>

              <div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-mono border-border bg-surface-elevated text-foreground hover:bg-muted"
                >
                  <Link
                    to="/app/segments"
                    onPointerEnter={() => {
                      prefetchRoute('appLayout')
                      prefetchRoute('segments')
                    }}
                  >
                    <span>View Segments</span>
                    <ArrowRight className="ml-1.5 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Pillar 03: CLV Prediction */}
            <div className="capability-block rounded-2xl border border-border bg-surface p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="font-mono text-xs text-foreground-muted font-semibold">
                  PILLAR 03 // STATISTICAL HORIZONS
                </span>
                <h3 className="text-2xl font-light tracking-tight text-foreground">
                  Multi-Horizon CLV Prediction
                </h3>
                <p className="text-xs sm:text-sm text-foreground-muted font-light leading-relaxed">
                  Generate conditional forward monetary expectations across 30-day, 90-day, and
                  12-month observation windows. Powered by calibrated BG/NBD and Gamma-Gamma
                  distributions tested to 94.2% accuracy.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 font-mono text-center text-xs">
                  <div className="rounded-lg border border-border bg-background p-2.5">
                    <span className="text-[10px] text-foreground-subtle block">30 DAYS</span>
                    <span className="text-xs text-foreground font-semibold">$1.19M</span>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-2.5">
                    <span className="text-[10px] text-foreground-subtle block">90 DAYS</span>
                    <span className="text-xs text-foreground font-semibold">$3.62M</span>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-2.5">
                    <span className="text-[10px] text-foreground-subtle block">12 MONTHS</span>
                    <span className="text-xs text-accent font-semibold">$14.28M</span>
                  </div>
                </div>
              </div>

              <div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-mono border-border bg-surface-elevated text-foreground hover:bg-muted"
                >
                  <Link
                    to="/app/predictions"
                    onPointerEnter={() => {
                      prefetchRoute('appLayout')
                      prefetchRoute('predictions')
                    }}
                  >
                    <span>View Predictions</span>
                    <ArrowRight className="ml-1.5 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Pillar 04: Full-Width Editorial Feature — Decision Signals */}
          <div className="capability-block rounded-2xl border border-border bg-surface p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="font-mono text-xs text-accent font-semibold">
                PILLAR 04 // OPERATIONAL PLAYBOOKS
              </span>
              <h3 className="text-2xl sm:text-4xl font-light tracking-tight text-foreground">
                Customer Insights & Recommendations
              </h3>
              <p className="text-sm sm:text-base text-foreground-muted font-light leading-relaxed">
                Translate statistical variance into operational action. When an account’s velocity
                drops below its cohort threshold, Valora surfaces prioritized playbooks with clear
                dollar impact, ensuring customer success acts before cancellation occurs.
              </p>
              <div className="pt-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-mono border-border bg-surface-elevated text-foreground hover:bg-muted"
                >
                  <Link
                    to="/app/insights"
                    onPointerEnter={() => {
                      prefetchRoute('appLayout')
                      prefetchRoute('insights')
                    }}
                  >
                    <span>View Decision Signals</span>
                    <ArrowRight className="ml-1.5 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-xl border border-border bg-background p-5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-destructive font-semibold">[HIGH PRIORITY SIGNAL]</span>
                <span className="text-foreground-subtle">MID-MARKET</span>
              </div>
              <p className="text-xs text-foreground font-sans font-light">
                38 accounts experienced a 45% platform session drop between Days 45–75.
              </p>
              <div className="pt-2 border-t border-border flex justify-between text-[11px]">
                <span className="text-foreground-subtle">CAPITAL AT STAKE</span>
                <span className="text-accent font-bold">$148,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingCapabilitiesSection
