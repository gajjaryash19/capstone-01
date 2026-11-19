import { Users, DollarSign, ShieldAlert, Award } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import type { CustomerDirectoryKpiSummary } from '../types'

interface CustomerKpiCardsProps {
  kpis: CustomerDirectoryKpiSummary
  filteredCount?: number
  isFiltered?: boolean
}

export function CustomerKpiCards({
  kpis,
  filteredCount,
  isFiltered = false,
}: CustomerKpiCardsProps) {
  const cards = [
    {
      id: 'kpi-total-customers',
      title: 'Total Customers',
      value: formatNumber(kpis.totalCustomers),
      context: isFiltered
        ? `${formatNumber(filteredCount ?? 0)} matching active filters`
        : 'Enterprise & B2B cohort accounts',
      icon: Users,
    },
    {
      id: 'kpi-high-value',
      title: 'High-Value Customers',
      value: formatNumber(kpis.highValueCustomers),
      context: 'Predicted CLV ≥ $10,000',
      icon: Award,
    },
    {
      id: 'kpi-at-risk',
      title: 'At-Risk Customers',
      value: formatNumber(kpis.atRiskCustomers),
      context: 'High churn propensity (>65%)',
      icon: ShieldAlert,
      highlightRisk: true,
    },
    {
      id: 'kpi-avg-clv',
      title: 'Average Customer CLV',
      value: formatCurrency(kpis.averageClv),
      context: 'Cohort predicted baseline',
      icon: DollarSign,
    },
  ]

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card
            key={card.id}
            className="p-3 sm:p-4 flex flex-col justify-between hover:border-border-strong transition-colors bg-card"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground leading-snug">
                  {card.title}
                </span>
                <div
                  className={`rounded-md p-1.5 shrink-0 ${
                    card.highlightRisk
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-accent/60 text-primary'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="mt-2">
                <div className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums text-foreground">
                  {card.value}
                </div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-border/60 text-[11px] text-muted-foreground leading-normal truncate">
              {card.context}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
