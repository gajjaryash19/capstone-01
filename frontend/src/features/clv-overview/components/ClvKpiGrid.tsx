import { memo } from 'react'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import type { OverviewKpi } from '../types'

interface ClvKpiGridProps {
  kpis: OverviewKpi[]
}

function ClvKpiGridComponent({ kpis }: ClvKpiGridProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 min-w-0">
      {kpis.map((kpi, idx) => {
        const isNegativeNumber = kpi.change.startsWith('-')
        const isNeutral =
          kpi.changeType === 'neutral' || kpi.change === '0%' || kpi.change === '0.0%'
        const DirectionIcon = isNeutral ? Minus : isNegativeNumber ? ArrowDownRight : ArrowUpRight

        // Semantic sentiment determination:
        // For risk reduction, negative change is positive sentiment
        const isFavorable = kpi.changeType === 'positive'

        return (
          <motion.div
            key={kpi.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.01 : 0.2,
              delay: shouldReduceMotion ? 0 : idx * 0.03,
            }}
            className="min-w-0"
          >
            <Card className="h-full p-4 sm:p-5 flex flex-col justify-between hover:border-border-strong hover:bg-surface-elevated/30 transition-all duration-200 group">
              <div>
                {/* Header: Label + Trend indicator */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground leading-snug">
                    {kpi.title}
                  </span>
                  <div
                    className={cn(
                      'inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-mono font-medium shrink-0 tabular-nums border',
                      isNeutral
                        ? 'border-border bg-muted/40 text-muted-foreground'
                        : isFavorable
                          ? 'border-border-strong bg-accent/60 text-foreground'
                          : 'border-destructive/30 bg-destructive/10 text-destructive',
                    )}
                  >
                    <DirectionIcon className="h-3 w-3 shrink-0" />
                    <span>{kpi.change}</span>
                  </div>
                </div>

                {/* Primary Metric Value */}
                <div className="mt-3">
                  <div className="text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums text-foreground">
                    {kpi.value}
                  </div>
                </div>

                {/* Comparison Horizon Period */}
                <div className="mt-1 flex items-center text-[11px] text-muted-foreground">
                  <span className="truncate">{kpi.period}</span>
                </div>
              </div>

              {/* Contextual Benchmark / Peer Subtext */}
              <div className="mt-4 pt-2.5 border-t border-border/50 text-[11px] text-muted-foreground leading-relaxed">
                {kpi.secondaryContext}
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

export const ClvKpiGrid = memo(ClvKpiGridComponent)
export default ClvKpiGrid
