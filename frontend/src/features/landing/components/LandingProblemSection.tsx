import { useRef } from 'react'
import { gsap } from '@/lib/motion/gsap'
import { useGsapAnimation } from '@/lib/motion/useGsapAnimation'

const problemNarrative = [
  {
    num: '01',
    label: 'LOOKING BACKWARD',
    title: 'Trailing spend conceals imminent churn.',
    body: 'Traditional business intelligence treats past revenue as an indicator of future loyalty. A major enterprise account that silently stopped purchasing weeks ago still appears as a high-tier champion in backward-looking reports until the account is completely lost.',
  },
  {
    num: '02',
    label: 'ONE-SIZE-FITS-ALL AVERAGES',
    title: 'Aggregated averages wipe out high-margin equity.',
    body: 'Reporting a uniform 3% monthly churn treats all customers identically. But when customer value follows an 80/20 Pareto distribution, losing a single high-tier relationship destroys as much cashflow as losing thirty entry-tier accounts.',
  },
  {
    num: '03',
    label: 'ACTING TOO LATE',
    title: 'Post-cancellation outreach arrives too late.',
    body: 'Reaching out after a customer formally disconnects or enters dormancy succeeds less than 15% of the time. Without calculating real-time transaction dropout probability, success teams react to damage rather than preventing it.',
  },
]

export function LandingProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGsapAnimation(
    (context) => {
      if (context.data.isReduced) return

      context.add(() => {
        gsap.from('.problem-row', {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
          opacity: 0,
          y: 20,
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
      id="problem"
      ref={containerRef}
      className="relative py-20 sm:py-28 lg:py-36 border-b border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 sm:mb-24">
          <div className="lg:col-span-4">
            <span className="font-mono text-xs text-accent font-semibold uppercase tracking-wider block mb-2">
              SECTION 02 — THE PROBLEM
            </span>
            <span className="text-sm font-mono text-foreground-subtle">THE CRM BLIND SPOT</span>
          </div>

          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-tight">
              Businesses collect endless data, but struggle to see what customers will do tomorrow.
            </h2>
          </div>
        </div>

        {/* Editorial Rows */}
        <div className="divide-y divide-border border-t border-b border-border">
          {problemNarrative.map((item) => (
            <div
              key={item.num}
              className="problem-row py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start group hover:bg-surface-elevated/40 transition-colors duration-200"
            >
              <div className="lg:col-span-2 font-mono text-sm sm:text-base text-foreground-subtle">
                ({item.num})
              </div>

              <div className="lg:col-span-4">
                <span className="font-mono text-[11px] text-foreground-muted tracking-widest uppercase block mb-1">
                  {item.label}
                </span>
                <h3 className="text-xl sm:text-2xl font-light text-foreground tracking-tight">
                  {item.title}
                </h3>
              </div>

              <div className="lg:col-span-6">
                <p className="text-sm sm:text-base text-foreground-muted font-light leading-relaxed">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandingProblemSection
