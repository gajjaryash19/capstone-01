import { memo } from 'react'
import { Building2, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import type { EnrichedPredictionCustomer } from '../types'

interface PredictionCardListProps {
  customers: EnrichedPredictionCustomer[]
  onSelectCustomer: (customer: EnrichedPredictionCustomer) => void
}

function PredictionCardListComponent({ customers, onSelectCustomer }: PredictionCardListProps) {
  const getSegmentBadgeStyle = (segment: string) => {
    switch (segment) {
      case 'Enterprise':
        return 'border-foreground/30 bg-surface-elevated text-foreground font-semibold'
      case 'Mid-Market':
        return 'border-border bg-muted/60 text-foreground/90 font-medium'
      case 'Growth':
        return 'border-border bg-muted/40 text-muted-foreground font-medium'
      case 'Standard':
      default:
        return 'border-border/60 bg-muted/20 text-muted-foreground/80 font-normal'
    }
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'border-red-500/30 bg-red-500/10 text-red-400 font-semibold'
      case 'moderate':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-400 font-medium'
      case 'low':
      default:
        return 'border-border bg-muted/40 text-muted-foreground font-medium'
    }
  }

  return (
    <div className="space-y-3 sm:hidden">
      {customers.map((customer) => {
        const isPositiveDelta = customer.valueDelta >= 0

        return (
          <div
            key={customer.id}
            onClick={() => onSelectCustomer(customer)}
            className="rounded-lg border border-border bg-surface p-3.5 shadow-2xs transition-all duration-150 ease-out hover:border-border-strong cursor-pointer active:scale-[0.99] active:bg-surface-elevated/40 select-none space-y-3"
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
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-foreground font-mono font-semibold text-xs border border-border">
                  {customer.avatarInitials}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-foreground truncate">
                    {customer.name}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="font-mono text-muted-foreground/80">{customer.id}</span>
                    <span>•</span>
                    <span className="truncate flex items-center gap-1">
                      <Building2 className="h-2.5 w-2.5" />
                      {customer.company}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] border ${getSegmentBadgeStyle(
                    customer.segment,
                  )}`}
                >
                  {customer.segment}
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>

            {/* 2x2 Metric Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60 text-xs">
              <div className="rounded-md border border-border/70 bg-surface-elevated/40 p-2">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                  Predicted CLV
                </span>
                <span className="font-mono font-bold text-foreground text-sm">
                  {formatCurrency(customer.predictedClv)}
                </span>
              </div>

              <div className="rounded-md border border-border/70 bg-surface-elevated/40 p-2">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                  Past Spend
                </span>
                <span className="font-mono font-medium text-muted-foreground text-sm">
                  {formatCurrency(customer.historicalRevenue)}
                </span>
              </div>

              <div className="rounded-md border border-border/70 bg-surface-elevated/40 p-2">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                  Projected Change
                </span>
                <span className="font-mono font-medium text-foreground text-xs flex items-center gap-1">
                  {isPositiveDelta ? (
                    <TrendingUp className="h-3 w-3 text-muted-foreground shrink-0" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-muted-foreground shrink-0" />
                  )}
                  {isPositiveDelta ? '+' : ''}
                  {formatCurrency(customer.valueDelta)}
                </span>
              </div>

              <div className="rounded-md border border-border/70 bg-surface-elevated/40 p-2">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                  Churn Risk
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`inline-flex items-center rounded px-1 py-0.2 font-mono text-[10px] uppercase border ${getRiskBadge(
                      customer.churnRisk,
                    )}`}
                  >
                    {customer.churnRisk}
                  </span>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    {formatPercent(customer.churnProbability * 100, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const PredictionCardList = memo(PredictionCardListComponent)
export default PredictionCardList
