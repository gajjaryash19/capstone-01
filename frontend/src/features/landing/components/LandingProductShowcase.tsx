import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useGsapAnimation, gsap } from '@/lib/motion'
import { prefetchRoute } from '@/lib/router/prefetch'
import { cn } from '@/lib/utils'

interface ShowcaseView {
  id: string
  title: string
  subtitle: string
  imgSrc: string
  alt: string
  linkTo: string
  metrics: { label: string; value: string }[]
}

const showcaseViews: ShowcaseView[] = [
  {
    id: 'overview',
    title: 'Executive Portfolio Overview',
    subtitle: 'Portfolio-level trajectory forecasts and value concentration breakdown',
    imgSrc: '/screenshots/audit-overview-1440.png',
    alt: 'Valora Executive Overview Dashboard Interface',
    linkTo: '/app',
    metrics: [
      { label: 'Observed CLV', value: '$4,820' },
      { label: 'Projected Delta', value: '+12.4%' },
      { label: 'Evaluation Accounts', value: '36' },
    ],
  },
  {
    id: 'segments',
    title: 'Customer Segmentation',
    subtitle: 'Four discrete behavioral cohorts based on recency, frequency, and monetary yield',
    imgSrc: '/screenshots/screenshot-segments-desktop.png',
    alt: 'Valora Customer Segmentation Interface',
    linkTo: '/app/segments',
    metrics: [
      { label: 'Top Tier Share', value: '46.2%' },
      { label: 'At-Risk Cohort', value: '18 accounts' },
      { label: 'Expansion Target', value: '+$312K' },
    ],
  },
  {
    id: 'predictions',
    title: 'CLV Predictions & Horizons',
    subtitle:
      'Probabilistic monetary projection modeling across 30D, 90D, and 12M forward horizons',
    imgSrc: '/screenshots/screenshot-predictions-desktop.png',
    alt: 'Valora Customer Lifetime Value Predictions Interface',
    linkTo: '/app/predictions',
    metrics: [
      { label: 'Model MAPE', value: '94.2%' },
      { label: 'Survival Horizon', value: '12 Months' },
      { label: 'Algorithm', value: 'BG/NBD' },
    ],
  },
  {
    id: 'insights',
    title: 'Autonomous Decision Signals',
    subtitle:
      'Actionable intervention playbooks triggered automatically by statistical velocity decay',
    imgSrc: '/screenshots/screenshot-insights-desktop.png',
    alt: 'Valora Autonomous Insights and Playbooks Interface',
    linkTo: '/app/insights',
    metrics: [
      { label: 'Active Signals', value: '3 Critical' },
      { label: 'Capital Protected', value: '$148,000' },
      { label: 'Intervention Rate', value: '85%' },
    ],
  },
]

export function LandingProductShowcase() {
  const [activeTab, setActiveTab] = useState<string>('overview')
  const containerRef = useRef<HTMLDivElement>(null)
  const currentView = showcaseViews.find((v) => v.id === activeTab) || showcaseViews[0]

  useGsapAnimation(
    (context) => {
      if (context.data.isReduced) return

      context.add(() => {
        gsap.from('.showcase-frame', {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          },
          opacity: 0,
          y: 30,
          duration: 0.9,
          ease: 'power3.out',
          clearProps: 'transform',
        })
      })
    },
    { scope: containerRef },
  )

  return (
    <section
      id="product-showcase"
      ref={containerRef}
      className="relative py-20 sm:py-28 lg:py-36 border-b border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-12 sm:mb-16">
          <div className="lg:col-span-8 space-y-3">
            <span className="font-mono text-xs text-accent font-semibold uppercase tracking-wider block">
              SECTION 03 — PRODUCT REVEAL
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-foreground">
              The Valora Interface.
            </h2>
            <p className="text-sm sm:text-base text-foreground-muted font-light max-w-2xl">
              An uncompromised customer intelligence console. Explore the live application
              environment, derived from actual transactional distributions without synthetic
              distortion.
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-foreground-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>DEMO EVALUATION SUITE</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 border-b border-border pb-4 mb-8">
          {showcaseViews.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-mono transition-all duration-150 cursor-pointer select-none',
                activeTab === tab.id
                  ? 'bg-surface-elevated text-foreground border border-border font-medium shadow-sm'
                  : 'text-foreground-subtle hover:text-foreground-muted hover:bg-surface border border-transparent',
              )}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Architectural Product Frame */}
        <div className="showcase-frame rounded-2xl border border-border bg-surface overflow-hidden shadow-2xl">
          {/* Top Frame Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface-elevated/60 px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
                <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
                <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
              </div>
              <span className="text-xs font-mono text-foreground-muted truncate hidden sm:inline">
                valora://{activeTab}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-7 px-3 text-xs font-mono border-border bg-surface text-foreground hover:bg-surface-elevated"
              >
                <Link
                  to={currentView.linkTo}
                  onPointerEnter={() => {
                    prefetchRoute('appLayout')
                    if (currentView.id === 'overview') prefetchRoute('overview')
                    if (currentView.id === 'segments') prefetchRoute('segments')
                    if (currentView.id === 'predictions') prefetchRoute('predictions')
                    if (currentView.id === 'insights') prefetchRoute('insights')
                  }}
                >
                  <span>Open Module</span>
                  <Maximize2 className="ml-1.5 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Screenshot Display Area with High-Density Zoom Mask */}
          <div className="relative aspect-video sm:aspect-[16/9] w-full overflow-hidden bg-background">
            <img
              key={currentView.id}
              src={currentView.imgSrc}
              alt={currentView.alt}
              className="w-full h-full object-cover object-top select-none transition-opacity duration-300"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Bottom Information & Metrics Strip */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border border-t border-border bg-surface">
            <div className="md:col-span-6 p-5 space-y-1">
              <div className="text-sm font-medium text-foreground">{currentView.title}</div>
              <p className="text-xs text-foreground-muted leading-relaxed font-light">
                {currentView.subtitle}
              </p>
            </div>

            <div className="md:col-span-6 p-5 grid grid-cols-3 gap-4">
              {currentView.metrics.map((m) => (
                <div key={m.label} className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-foreground-subtle block truncate">
                    {m.label}
                  </span>
                  <span className="text-sm font-mono font-medium text-foreground">{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transparent Disclosure */}
        <div className="mt-4 text-center">
          <p className="text-[11px] font-mono text-foreground-subtle">
            Note: Platform screenshots display the deterministic 36-account benchmark dataset. Zero
            synthetic data generation.
          </p>
        </div>
      </div>
    </section>
  )
}

export default LandingProductShowcase
