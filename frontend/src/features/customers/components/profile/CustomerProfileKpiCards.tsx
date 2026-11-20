import { TrendingUp, DollarSign, ShoppingBag, Calculator } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import type { CustomerRecord } from '../../types'

interface CustomerProfileKpiCardsProps {
  customer: CustomerRecord
}

export function CustomerProfileKpiCards({ customer }: CustomerProfileKpiCardsProps) {
  const cards = [
    {
      id: 'kpi-clv',
      title: 'Predicted CLV',
      value: formatCurrency(customer.predictedClv),
      context: 'Estimated full lifetime valuation',
      icon: TrendingUp,
      highlightPrimary: true,
    },
    {
      id: 'kpi-revenue',
      title: 'Historical Revenue',
      value: formatCurrency(customer.historicalRevenue),
      context: 'Realized revenue across all orders',
      icon: DollarSign,
    },
    {
      id: 'kpi-orders',
      title: 'Total Orders',
      value: formatNumber(customer.totalOrders),
      context: 'Completed transaction count',
      icon: ShoppingBag,
    },
    {
      id: 'kpi-aov',
      title: 'Average Order Value',
      value: formatCurrency(customer.averageOrderValue),
      context: 'Revenue / total completed orders',
      icon: Calculator,
    },
  ]

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card
            key={card.id}
            className="p-3.5 sm:p-4 flex flex-col justify-between hover:border-border-strong transition-colors bg-card"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground leading-snug">
                  {card.title}
                </span>
                <div
                  className={`rounded-md p-1.5 shrink-0 ${
                    card.highlightPrimary
                      ? 'bg-primary/10 text-primary'
                      : 'bg-accent/60 text-primary'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="mt-2">
                <div
                  className={`text-xl sm:text-2xl font-bold tracking-tight tabular-nums ${
                    card.highlightPrimary ? 'text-primary' : 'text-foreground'
                  }`}
                >
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
