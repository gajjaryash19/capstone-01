import { useRef } from 'react'
import { useGsapAnimation, gsap } from '@/lib/motion'

const clvDimensions = [
  {
    step: '01',
    name: 'RECENCY',
    formula: 't_x',
    title: 'Time Since Last Transaction',
    description:
      'How recently a customer transacted. In non-contractual models, elapsed silence is the primary signal of potential latent churn.',
  },
  {
    step: '02',
    name: 'FREQUENCY',
    formula: 'x',
    title: 'Repeat Transaction Cadence',
    description:
      'The number of repeat purchases observed during the observation window. Dictates underlying customer velocity and purchasing rhythm.',
  },
  {
    step: '03',
    name: 'MONETARY VALUE',
    formula: 'm_x',
    title: 'Average Order Spend',
    description:
      'The mean financial value per order. Modeled independently of frequency to prevent volume skew from corrupting margin expectations.',
  },
  {
    step: '04',
    name: 'LIFETIME HORIZON',
    formula: 'E[Y(t)]',
    title: 'Conditional Forward Expectancy',
    description:
      'The mathematical synthesis that projects cumulative revenue across 30-day, 90-day, and 12-month forward horizons with confidence intervals.',
  },
]

export function LandingClvValueSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGsapAnimation(
    (context) => {
      if (context.data.isReduced) return

      context.add(() => {
        gsap.from('.clv-dimension-card', {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
          opacity: 0,
          y: 24,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'all',
        })
      })
    },
    { scope: containerRef },
  )

  return (
    <section
      id="clv-value"
      ref={containerRef}
      className="relative py-20 sm:py-28 lg:py-36 border-b border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 sm:mb-20">
          <div className="lg:col-span-4">
            <span className="font-mono text-xs text-accent font-semibold uppercase tracking-wider block mb-2">
              SECTION 04 — UNDERSTAND CUSTOMER VALUE
            </span>
            <span className="text-sm font-mono text-foreground-subtle">
              THE ANATOMY OF LIFETIME VALUE
            </span>
          </div>

          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-foreground leading-tight">
              Customer Lifetime Value is not a single number. It is an evolving probabilistic curve.
            </h2>
          </div>
        </div>

        {/* 4 Architectural Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {clvDimensions.map((dim) => (
            <div
              key={dim.step}
              className="clv-dimension-card rounded-xl border border-border bg-surface p-6 flex flex-col justify-between space-y-6 hover:border-border-strong transition-colors duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-xs text-foreground-subtle">
                  <span>({dim.step})</span>
                  <span className="text-accent font-semibold">{dim.formula}</span>
                </div>

                <div>
                  <span className="text-[10px] font-mono tracking-widest text-foreground-muted uppercase block mb-1">
                    {dim.name}
                  </span>
                  <h3 className="text-base font-medium text-foreground tracking-tight">
                    {dim.title}
                  </h3>
                </div>

                <p className="text-xs text-foreground-muted font-light leading-relaxed">
                  {dim.description}
                </p>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-foreground-subtle">
                <span>PARAMETER</span>
                <span className="text-foreground">CONTINUOUS</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandingClvValueSection
