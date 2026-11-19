import { ChevronRight, Building2, Calendar, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate, formatNumber } from '@/lib/formatters'
import type { CustomerRecord } from '../types'

interface CustomerCardListProps {
  customers: CustomerRecord[]
  onSelectCustomer: (customer: CustomerRecord) => void
}

export function CustomerCardList({ customers, onSelectCustomer }: CustomerCardListProps) {
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

  return (
    <div className="space-y-3 sm:hidden">
      {customers.map((customer) => (
        <div
          key={customer.id}
          onClick={() => onSelectCustomer(customer)}
          className="rounded-lg border border-border bg-card p-3.5 shadow-2xs transition-colors hover:border-border-strong cursor-pointer"
          tabIndex={0}
          role="button"
          aria-label={`View customer details for ${customer.name}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onSelectCustomer(customer)
            }
          }}
        >
          {/* Header: Name, Avatar, Risk Badge */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/70 text-primary font-bold text-xs border border-primary/20">
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

            <Badge
              variant={getRiskVariant(customer.churnRisk)}
              dot
              className="shrink-0 text-[10px]"
            >
              {customer.churnRisk.toUpperCase()}
            </Badge>
          </div>

          {/* Metrics Row */}
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-md bg-muted/40 p-2 text-xs">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-primary" />
                Predicted CLV
              </span>
              <div className="text-xs font-bold text-primary tabular-nums mt-0.5">
                {formatCurrency(customer.predictedClv)}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-medium">
                Historical Rev.
              </span>
              <div className="text-xs font-semibold text-foreground tabular-nums mt-0.5">
                {formatCurrency(customer.historicalRevenue)}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-medium">
                Orders / AOV
              </span>
              <div className="text-xs text-foreground tabular-nums mt-0.5">
                {formatNumber(customer.totalOrders)} • {formatCurrency(customer.averageOrderValue)}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-medium">
                Segment
              </span>
              <div className="text-xs font-medium text-foreground mt-0.5">{customer.segment}</div>
            </div>
          </div>

          {/* Footer: Last Purchase & View Prompt */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground pt-1.5 border-t border-border/40">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Last: {formatDate(customer.lastPurchaseDate)}
            </span>
            <span className="inline-flex items-center font-medium text-primary gap-0.5">
              <span>View details</span>
              <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
