import { useRef } from 'react'
import { gsap } from '@/lib/motion/gsap'
import { useGsapAnimation } from '@/lib/motion/useGsapAnimation'

const journeySteps = [
  {
    step: '01',
    phase: 'DATA INGESTION',
    title: 'Customer Data',
    description:
      'Raw transaction ledgers, timestamps, purchase amounts, and refund data are ingested without manual ETL overhead.',
  },
  {
    step: '02',
    phase: 'FEATURE SYNTHESIS',
    title: 'Statistical Analysis',
    description:
      'Continuous decomposition into recency, frequency, and monetary parameters under non-contractual assumptions.',
  },
  {
    step: '03',
    phase: 'PROBABILISTIC INFERENCE',
    title: 'Customer Intelligence',
    description:
      'Fitting BG/NBD and Gamma distributions to calculate exact survival probabilities and forward dollar yields.',
  },
  {
    step: '04',
    phase: 'EXECUTIVE EXECUTION',
    title: 'Better Decisions',
    description:
      'Automated intervention playbooks, value-weighted prioritization, and resource allocation backed by mathematical conviction.',
  },
]

export function LandingDataJourneySection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGsapAnimation(
    (context) => {
      if (context.data.isReduced) return

      context.add(() => {
        gsap.from('.journey-card', {
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
      id="journey"
      ref={containerRef}
      className="relative py-20 sm:py-28 lg:py-36 border-b border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 sm:mb-20">
          <div className="lg:col-span-4">
            <span className="font-mono text-xs text-accent font-semibold uppercase tracking-wider block mb-2">
              SECTION 06 — DATA TO DECISIONS
            </span>
            <span className="text-sm font-mono text-foreground-subtle">
              THE CONCEPTUAL PIPELINE
            </span>
          </div>

          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-foreground leading-tight">
              From raw customer transactions to deterministic commercial decisions.
            </h2>
          </div>
        </div>

        {/* 4 Connected Journey Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {journeySteps.map((s) => (
            <div
              key={s.step}
              className="journey-card rounded-xl border border-border bg-surface p-6 flex flex-col justify-between space-y-6 hover:border-border-strong transition-colors duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-xs text-foreground-subtle">
                  <span>({s.step})</span>
                  <span className="text-foreground-muted text-[10px] tracking-wider uppercase font-semibold">
                    {s.phase}
                  </span>
                </div>

                <h3 className="text-xl font-light text-foreground tracking-tight">{s.title}</h3>

                <p className="text-xs text-foreground-muted font-light leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-foreground-subtle">
                <span>STAGE</span>
                <span className="text-accent font-semibold">{s.step} / 04</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandingDataJourneySection
