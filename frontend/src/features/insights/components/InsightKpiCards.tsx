import { memo } from 'react'
import { Sparkles, AlertTriangle, ShieldAlert, PieChart } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import type { InsightKpiSummary } from '../types'

interface InsightKpiCardsProps {
  summary: InsightKpiSummary
}

function InsightKpiCardsComponent({ summary }: InsightKpiCardsProps) {
  const cards = [
    {
      id: 'kpi-total-insights',
      title: 'Total Insights',
      value: `${summary.totalInsights} Insights`,
      context: 'Key patterns found across 36 accounts',
      icon: Sparkles,
      isRisk: false,
    },
    {
      id: 'kpi-high-priority',
      title: 'High Priority',
      value: `${summary.highPriorityCount} Needs Attention`,
      context: 'Requires immediate outreach or retention action',
      icon: AlertTriangle,
      isRisk: false,
      isWarning: summary.highPriorityCount > 0,
    },
    {
      id: 'kpi-at-risk-clv',
      title: 'Revenue at Risk',
      value: formatCurrency(summary.totalAtRiskClv),
      context: '8 accounts with >65% churn risk',
      icon: ShieldAlert,
      isRisk: true,
    },
    {
      id: 'kpi-enterprise-skew',
      title: 'Top Segment Share',
      value: formatPercent(summary.enterpriseClvConcentration),
      context: 'Share of total value in Enterprise accounts',
      icon: PieChart,
      isRisk: false,
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
              <div className="flex items-center justify-between pb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {card.title}
                </span>
                <div className="rounded-md p-1.5 shrink-0 bg-surface-elevated text-muted-foreground border border-border/60">
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="mt-2.5">
                <div
                  className={`text-xl sm:text-2xl font-bold tracking-tight font-mono tabular-nums ${
                    card.isRisk
                      ? 'text-red-400'
                      : card.isWarning
                        ? 'text-amber-400'
                        : 'text-foreground'
                  }`}
                >
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

export const InsightKpiCards = memo(InsightKpiCardsComponent)
export default InsightKpiCards
