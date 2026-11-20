import { memo } from 'react'
import { ChevronRight, Building2, Calendar, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate, formatNumber } from '@/lib/formatters'
import { prefetchRoute } from '@/lib/router/prefetch'
import type { CustomerRecord } from '../types'

interface CustomerCardListProps {
  customers: CustomerRecord[]
  onSelectCustomer: (customer: CustomerRecord) => void
}

function CustomerCardListComponent({ customers, onSelectCustomer }: CustomerCardListProps) {
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return (
          <Badge variant="neutral" dot className="font-mono text-[10px]">
            LOW
          </Badge>
        )
      case 'moderate':
        return (
          <Badge variant="warning" dot className="font-mono text-[10px]">
            MODERATE
          </Badge>
        )
      case 'high':
      default:
        return (
          <Badge variant="destructive" dot className="font-mono text-[10px]">
            HIGH
          </Badge>
        )
    }
  }

  const getSegmentBadge = (segment: string) => {
    switch (segment) {
      case 'Enterprise':
        return 'border-foreground/30 bg-surface-elevated text-foreground font-semibold'
      case 'Mid-Market':
        return 'border-border bg-muted/60 text-foreground/90 font-medium'
      case 'Growth':
        return 'border-border bg-muted/40 text-muted-foreground font-medium'
      case 'Standard':
      default:
        return 'border-border/60 bg-muted/20 text-muted-foreground/80'
    }
  }

  return (
    <div className="space-y-3 sm:hidden">
      {customers.map((customer) => (
        <div
          key={customer.id}
          onClick={() => onSelectCustomer(customer)}
          onPointerEnter={() => prefetchRoute('customerProfile')}
          className="rounded-lg border border-border bg-card p-3.5 shadow-2xs transition-all duration-150 ease-out hover:border-border-strong cursor-pointer active:scale-[0.99] active:bg-surface-elevated/40 select-none"
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
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-foreground font-bold text-xs border border-border shadow-2xs">
                {customer.avatarInitials}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-foreground text-xs truncate">
                  {customer.name}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="font-mono">{customer.id}</span>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="truncate flex items-center gap-0.5">
                    <Building2 className="h-2.5 w-2.5 inline" />
                    {customer.company}
                  </span>
                </div>
              </div>
            </div>

            {getRiskBadge(customer.churnRisk)}
          </div>

          {/* Metrics Grid */}
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-surface-elevated/40 p-2.5 text-xs border border-border/60">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-foreground" />
                Predicted CLV
              </span>
              <div className="text-xs font-bold text-foreground font-mono tabular-nums mt-0.5">
                {formatCurrency(customer.predictedClv)}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Historical Rev.
              </span>
              <div className="text-xs font-semibold text-muted-foreground font-mono tabular-nums mt-0.5">
                {formatCurrency(customer.historicalRevenue)}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Orders / AOV
              </span>
              <div className="text-xs text-foreground font-mono tabular-nums mt-0.5">
                {formatNumber(customer.totalOrders)} • {formatCurrency(customer.averageOrderValue)}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Last Purchase
              </span>
              <div className="text-xs text-muted-foreground font-mono mt-0.5">
                {formatDate(customer.lastPurchaseDate)}
              </div>
            </div>
          </div>

          {/* Footer: Segment Badge & View Chevron */}
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/50 text-xs">
            <span
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono border ${getSegmentBadge(
                customer.segment,
              )}`}
            >
              {customer.segment}
            </span>

            <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
              <span>View Profile</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const CustomerCardList = memo(CustomerCardListComponent)
export default CustomerCardList
