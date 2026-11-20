import { Building2, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import type { EnrichedPredictionCustomer } from '../types'

interface PredictionCardListProps {
  customers: EnrichedPredictionCustomer[]
  onSelectCustomer: (customer: EnrichedPredictionCustomer) => void
}

export function PredictionCardList({ customers, onSelectCustomer }: PredictionCardListProps) {
  const getRiskVariant = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'teal' as const
      case 'moderate':
        return 'warning' as const
      case 'high':
      default:
        return 'destructive' as const
    }
  }

  const getSegmentVariant = (segment: string) => {
    switch (segment) {
      case 'Enterprise':
        return 'border-primary/30 bg-primary/10 text-primary'
      case 'Mid-Market':
        return 'border-sky-500/30 bg-sky-500/10 text-sky-700'
      case 'Growth':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700'
      case 'Standard':
      default:
        return 'border-border bg-muted/60 text-muted-foreground'
    }
  }

  return (
    <div className="space-y-3 sm:hidden">
      {customers.map((customer) => (
        <div
          key={customer.id}
          onClick={() => onSelectCustomer(customer)}
          className="rounded-lg border border-border bg-card p-3.5 shadow-2xs transition-colors hover:border-border-strong cursor-pointer"
          tabIndex={0}
          role="button"
          aria-label={`View predictions for ${customer.name}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onSelectCustomer(customer)
            }
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/70 text-primary font-bold text-xs border border-primary/20">
                {customer.avatarInitials}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-foreground text-xs truncate">
                  {customer.name}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="font-mono">{customer.id}</span>
                  <span>•</span>
                  <span className="truncate flex items-center gap-0.5">
                    <Building2 className="h-2.5 w-2.5 inline" />
                    {customer.company}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span
                className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium border ${getSegmentVariant(
                  customer.segment,
                )}`}
              >
                {customer.segment}
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/60 pt-2.5 text-xs">
            <div>
              <span className="text-[10px] text-muted-foreground block">Historical Spend</span>
              <span className="font-medium tabular-nums text-foreground">
                {formatCurrency(customer.historicalRevenue)}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground block">Predicted CLV</span>
              <span className="font-bold tabular-nums text-primary">
                {formatCurrency(customer.predictedClv)}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground block">Projected Growth</span>
              <span
                className={`inline-flex items-center font-semibold text-xs tabular-nums ${
                  customer.isExpansion ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {customer.isExpansion ? (
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-0.5" />
                )}
                {customer.isExpansion ? '+' : ''}
                {formatCurrency(customer.valueDelta)}
              </span>
            </div>
          </div>

          {/* Footer: Horizon & Risk */}
          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
            <span className="font-medium">Horizon: 12-Month Forward</span>
            <div className="flex items-center gap-1.5">
              <Badge variant={getRiskVariant(customer.churnRisk)} dot>
                {customer.churnRisk.toUpperCase()}
              </Badge>
              <span className="font-mono text-[10px]">
                {formatPercent(customer.churnProbability * 100, 0)} risk
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
