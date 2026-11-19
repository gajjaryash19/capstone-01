import { DollarSign, TrendingUp, Users, Sparkles, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import type { PredictionSummaryKpis } from '../types'

interface PredictionKpiCardsProps {
  kpis: PredictionSummaryKpis
  filteredCount?: number
  isFiltered?: boolean
}

export function PredictionKpiCards({
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
        : '12-Month forward projected pipeline',
      icon: DollarSign,
      highlight: true,
    },
    {
      id: 'kpi-avg-pred-clv',
      title: 'Average Predicted CLV',
      value: formatCurrency(kpis.averagePredictedClv),
      context: `Range: ${formatCurrency(kpis.minPredictedClv)}–${formatCurrency(kpis.maxPredictedClv)} (median: ${formatCurrency(kpis.medianPredictedClv)})`,
      icon: TrendingUp,
      highlight: false,
    },
    {
      id: 'kpi-coverage',
      title: 'Prediction Coverage',
      value: `${formatNumber(kpis.totalCustomers)} Accounts`,
      context: isFiltered
        ? `${formatNumber(filteredCount ?? 0)} of ${formatNumber(kpis.totalCustomers)} accounts active`
        : '100% of cohort with active probabilistic forecasts',
      icon: Users,
      highlight: false,
    },
    {
      id: 'kpi-expansion',
      title: 'Net Projected Expansion',
      value: `+${formatCurrency(kpis.totalProjectedExpansion)}`,
      badgeText: `+${kpis.projectedExpansionPercent}%`,
      context: 'Projected value expansion over historical spend',
      icon: Sparkles,
      highlight: false,
    },
  ]

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card
            key={card.id}
            className="p-3.5 sm:p-4.5 flex flex-col justify-between hover:border-border-strong transition-colors bg-card"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground leading-snug">
                  {card.title}
                </span>
                <div
                  className={`rounded-md p-1.5 shrink-0 ${
                    card.highlight ? 'bg-primary/10 text-primary' : 'bg-accent/60 text-primary'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="mt-2 sm:mt-2.5 flex items-baseline gap-2">
                <div className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums text-foreground">
                  {card.value}
                </div>
                {card.badgeText && (
                  <span className="inline-flex items-center text-xs font-semibold text-primary">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    {card.badgeText}
                  </span>
                )}
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
