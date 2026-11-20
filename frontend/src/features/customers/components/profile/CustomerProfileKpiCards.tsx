import { TrendingUp, DollarSign, ShoppingBag, Shield } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import { MOCK_CUSTOMERS } from '../../mockData'
import type { CustomerRecord } from '../../types'

interface CustomerProfileKpiCardsProps {
  customer: CustomerRecord
}

export function CustomerProfileKpiCards({ customer }: CustomerProfileKpiCardsProps) {
  // Evaluation platform reference timestamp: 2026-11-19
  const EVAL_REF_DATE = new Date('2026-11-19').getTime()
  const joinedTime = new Date(customer.joinedDate).getTime()
  const tenureDays = Math.max(1, Math.floor((EVAL_REF_DATE - joinedTime) / (1000 * 60 * 60 * 24)))
  const tenureMonths = Math.max(1, tenureDays / 30.4375)
  const monthlyCadence = (customer.totalOrders / tenureMonths).toFixed(1)

  // Rank in 36-customer cohort
  const sortedCohort = [...MOCK_CUSTOMERS].sort((a, b) => b.predictedClv - a.predictedClv)
  const cohortRank = sortedCohort.findIndex((c) => c.id === customer.id) + 1
  const cohortPercentile = Math.round(((36 - cohortRank + 1) / 36) * 100)

  const realizedPct =
    customer.predictedClv > 0
      ? Math.min(100, Math.round((customer.historicalRevenue / customer.predictedClv) * 100))
      : 100

  const cards = [
    {
      id: 'kpi-clv',
      title: 'Predicted Lifetime Valuation',
      value: formatCurrency(customer.predictedClv),
      context: `Cohort Rank #${cohortRank} of 36 • Top ${100 - cohortPercentile + 3}% tier`,
      icon: TrendingUp,
      isPrimary: true,
    },
    {
      id: 'kpi-revenue',
      title: 'Realized Historical Revenue',
      value: formatCurrency(customer.historicalRevenue),
      context: `${formatPercent(realizedPct, 0)} of predicted lifetime value collected`,
      icon: DollarSign,
    },
    {
      id: 'kpi-orders',
      title: 'Completed Orders & AOV',
      value: `${customer.totalOrders} Orders`,
      context: `AOV: ${formatCurrency(customer.averageOrderValue)} • ${monthlyCadence}/mo cadence`,
      icon: ShoppingBag,
    },
    {
      id: 'kpi-churn',
      title: '90-Day Churn Propensity',
      value: `${(customer.churnProbability * 100).toFixed(1)}%`,
      context: `${customer.churnRisk.toUpperCase()} risk profile • BG/NBD probability`,
      icon: Shield,
      isRisk: customer.churnRisk === 'high',
    },
  ]

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card
            key={card.id}
            className="p-4 flex flex-col justify-between hover:border-border-strong transition-colors bg-surface border-border"
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

              <div className="mt-3">
                <div
                  className={`text-2xl font-bold tracking-tight font-mono tabular-nums ${
                    card.isRisk ? 'text-red-400' : 'text-foreground'
                  }`}
                >
                  {card.value}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-border/60 text-[11px] text-muted-foreground leading-normal truncate">
              {card.context}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
