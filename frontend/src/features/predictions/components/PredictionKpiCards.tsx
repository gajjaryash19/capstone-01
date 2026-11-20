import { memo } from 'react'
import { DollarSign, TrendingUp, Users, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import type { PredictionSummaryKpis } from '../types'

interface PredictionKpiCardsProps {
  kpis: PredictionSummaryKpis
  filteredCount?: number
  isFiltered?: boolean
}

function PredictionKpiCardsComponent({
  kpis,
  filteredCount,
  isFiltered = false,
}: PredictionKpiCardsProps) {
  const cards = [
    {
      id: 'kpi-total-pred-clv',
      title: 'Total Predicted Value',
      value: formatCurrency(kpis.totalPredictedClv),
      context: isFiltered
        ? `Sum across ${formatNumber(filteredCount ?? 0)} filtered accounts`
        : 'Projected revenue over the next 12 months',
      icon: DollarSign,
    },
    {
      id: 'kpi-avg-pred-clv',
      title: 'Average Predicted CLV',
      value: formatCurrency(kpis.averagePredictedClv),
      context: `Range: ${formatCurrency(kpis.minPredictedClv)}–${formatCurrency(kpis.maxPredictedClv)} (median: ${formatCurrency(kpis.medianPredictedClv)})`,
      icon: TrendingUp,
    },
    {
      id: 'kpi-coverage',
      title: 'Prediction Coverage',
      value: `${formatNumber(kpis.totalCustomers)} Accounts`,
      context: isFiltered
        ? `${formatNumber(filteredCount ?? 0)} of ${formatNumber(kpis.totalCustomers)} accounts active`
        : 'Forecast available for all accounts',
      icon: Users,
    },
    {
      id: 'kpi-expansion',
      title: 'Projected Revenue Growth',
      value: `+${formatCurrency(kpis.totalProjectedExpansion)}`,
      context: `+${kpis.projectedExpansionPercent}% growth over past revenue`,
      icon: Sparkles,
    },
  ]

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card
            key={card.id}
            className="p-3.5 sm:p-4 flex flex-col justify-between hover:border-border-strong transition-colors bg-surface border-border"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground leading-snug">
                  {card.title}
                </span>
                <div className="rounded-md p-1.5 shrink-0 bg-surface-elevated text-muted-foreground border border-border/60">
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="mt-2.5">
                <div className="text-xl sm:text-2xl font-bold tracking-tight font-mono tabular-nums text-foreground">
                  {card.value}
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-border/60 text-[11px] text-muted-foreground leading-normal truncate">
              {card.context}
            </div>
          </Card>
        )
      })}
    </div>
  )
}

export const PredictionKpiCards = memo(PredictionKpiCardsComponent)
export default PredictionKpiCards
