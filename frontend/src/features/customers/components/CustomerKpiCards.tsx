import { memo } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import type { CustomerDirectoryKpiSummary } from '../types'

interface CustomerKpiCardsProps {
  kpis: CustomerDirectoryKpiSummary
  filteredCount?: number
  isFiltered?: boolean
}

function CustomerKpiCardsComponent({
  kpis,
  filteredCount,
  isFiltered = false,
}: CustomerKpiCardsProps) {
  const shouldReduceMotion = useReducedMotion()

  const cards = [
    {
      id: 'kpi-total-customers',
      title: 'Total Customers',
      value: formatNumber(kpis.totalCustomers),
      context: isFiltered
        ? `${formatNumber(filteredCount ?? 0)} accounts match active filters`
        : 'Total active customers',
    },
    {
      id: 'kpi-high-value',
      title: 'High-Value Customers',
      value: formatNumber(kpis.highValueCustomers),
      context: 'Predicted CLV ≥ $10,000',
    },
    {
      id: 'kpi-at-risk',
      title: 'At-Risk Customers',
      value: formatNumber(kpis.atRiskCustomers),
      context: '>65% estimated churn risk',
      highlightRisk: true,
    },
    {
      id: 'kpi-avg-clv',
      title: 'Average Predicted CLV',
      value: formatCurrency(kpis.averageClv),
      context: 'Average across all accounts',
    },
  ]

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 min-w-0">
      {cards.map((card, idx) => (
        <motion.div
          key={card.id}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: idx * 0.05 }}
          className="min-w-0"
        >
          <Card className="h-full p-4 sm:p-5 flex flex-col justify-between hover:border-border-strong hover:bg-surface-elevated/30 transition-all duration-200 group">
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground leading-snug">
                  {card.title}
                </span>
                {card.highlightRisk && (
                  <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono font-medium border border-destructive/30 bg-destructive/10 text-destructive">
                    Risk Alert
                  </span>
                )}
              </div>

              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums text-foreground font-mono">
                  {card.value}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-border/50 text-[11px] text-muted-foreground leading-relaxed">
              {card.context}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export const CustomerKpiCards = memo(CustomerKpiCardsComponent)
export default CustomerKpiCards
