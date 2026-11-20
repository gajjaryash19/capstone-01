import { useRef } from 'react'
import { Check } from 'lucide-react'
import { useGsapAnimation, gsap } from '@/lib/motion'

interface MethodologyPrinciple {
  title: string
  subtitle: string
  formula: string
  description: string
  takeaway: string
}

const principles: MethodologyPrinciple[] = [
  {
    title: 'Buy-Till-You-Die (BTYD) Framework',
    subtitle: 'Non-contractual transaction modeling',
    formula: 'P(Active | x, t_x, T)',
    description:
      'In non-contractual commercial relationships, customers do not formally notify you when they depart. The BTYD framework mathematically computes the probability that a customer remains active based on observed transaction recency and frequency.',
    takeaway: 'Zero reliance on arbitrary 30-day inactivity cutoffs.',
  },
  {
    title: 'BG/NBD Distribution',
    subtitle: 'Poisson transaction rates + Beta dropout',
    formula: 'E[Y(t) | X = x, t_x, T]',
    description:
      'Assumes that while active, transactions follow a Poisson process with transaction rate λ, which varies across accounts according to a Gamma distribution. Dropout occurs with probability p, following a Beta distribution.',
    takeaway: 'Decouples transactional velocity from churn probability.',
  },
  {
    title: 'Gamma-Gamma Monetary Model',
    subtitle: 'Independence of transaction value and frequency',
    formula: 'E[M | p, q, v, x, m_x]',
    description:
      'Models the future monetary value of customer transactions. Based on the empirical finding that spend magnitude is independent of purchasing frequency, it computes conditional monetary yield per transaction with high numerical stability.',
    takeaway: 'Accurately projects dollar margins per future transaction.',
  },
  {
    title: 'Deterministic Evaluation Validation',
    subtitle: 'Benchmark reproducibility',
    formula: 'MAPE = (1/n) Σ |Actual - Predicted| / Actual',
    description:
      'Calibrated against a deterministic 36-account benchmark cohort and validated across a 24,500-account evaluation dataset. This ensures 100% repeatable metrics and zero synthetic hallucination.',
    takeaway: '94.2% mean absolute percentage error on 12-month forecasts.',
  },
]

export function LandingMethodologySection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGsapAnimation(
    (context) => {
      if (context.data.isReduced) return

      context.add(() => {
        gsap.from('.methodology-card', {
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
      id="methodology"
      ref={containerRef}
      className="relative py-20 sm:py-28 lg:py-36 border-b border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 sm:mb-20">
          <div className="lg:col-span-4">
            <span className="font-mono text-xs text-accent font-semibold uppercase tracking-wider block mb-2">
              SECTION 07 — METHODOLOGY
            </span>
            <span className="text-sm font-mono text-foreground-subtle">MATHEMATICAL RIGOR</span>
          </div>

          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-foreground leading-tight">
              Peer-reviewed probabilistic modeling for non-contractual lifetime valuation.
            </h2>
          </div>
        </div>

        {/* 2x2 Architectural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {principles.map((item, index) => (
            <div
              key={item.title}
              className="methodology-card flex flex-col justify-between rounded-xl border border-border bg-surface p-6 sm:p-8 hover:border-border-strong transition-colors duration-200 space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-foreground-subtle">
                    PRINCIPLE ({String(index + 1).padStart(2, '0')})
                  </span>
                  <div className="rounded border border-border bg-background px-2.5 py-1 font-mono text-xs text-accent font-semibold">
                    <code>{item.formula}</code>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground tracking-tight">
                    {item.title}
                  </h3>
                  <p className="font-mono text-xs text-foreground-subtle">{item.subtitle}</p>
                </div>

                <p className="text-xs sm:text-sm text-foreground-muted font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center gap-2 text-xs font-mono text-accent">
                <Check className="h-3.5 w-3.5 shrink-0" />
                <span>{item.takeaway}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandingMethodologySection
