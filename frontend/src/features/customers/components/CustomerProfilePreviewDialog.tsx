import {
  Calendar,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  ShieldAlert,
  Building2,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate, formatNumber } from '@/lib/formatters'
import { prefetchRoute } from '@/lib/router/prefetch'
import type { CustomerRecord } from '../types'

interface CustomerProfilePreviewDialogProps {
  customer: CustomerRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerProfilePreviewDialog({
  customer,
  open,
  onOpenChange,
}: CustomerProfilePreviewDialogProps) {
  if (!customer) return null

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return {
          label: 'HIGH RISK',
          className: 'border-red-500/30 bg-red-500/10 text-red-400 font-semibold',
          icon: ShieldAlert,
        }
      case 'moderate':
        return {
          label: 'MODERATE RISK',
          className: 'border-amber-500/30 bg-amber-500/10 text-amber-400 font-medium',
          icon: AlertTriangle,
        }
      case 'low':
      default:
        return {
          label: 'LOW RISK',
          className: 'border-border bg-muted/40 text-muted-foreground font-medium',
          icon: ShieldCheck,
        }
    }
  }

  const riskBadge = getRiskBadge(customer.churnRisk)
  const RiskIcon = riskBadge.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl sm:max-w-xl p-5 sm:p-6 bg-surface border-border">
        <DialogHeader className="pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-elevated text-foreground font-mono font-semibold text-sm border border-border">
              {customer.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base font-semibold truncate text-foreground">
                  {customer.name}
                </DialogTitle>
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs border ${riskBadge.className}`}
                >
                  <RiskIcon className="h-3 w-3 shrink-0" />
                  <span>{riskBadge.label}</span>
                </span>
              </div>
              <DialogDescription className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                <span className="font-mono text-[11px] text-foreground/80 font-medium">
                  {customer.id}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {customer.company}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {customer.email}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Behavioral Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-2">
          <div className="rounded-md border border-border bg-surface-elevated/40 p-2.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-foreground/70" />
              Predicted CLV
            </span>
            <div className="mt-1 text-base font-bold font-mono tabular-nums text-foreground">
              {formatCurrency(customer.predictedClv)}
            </div>
          </div>

          <div className="rounded-md border border-border bg-surface-elevated/40 p-2.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              Revenue
            </span>
            <div className="mt-1 text-base font-bold font-mono tabular-nums text-foreground">
              {formatCurrency(customer.historicalRevenue)}
            </div>
          </div>

          <div className="rounded-md border border-border bg-surface-elevated/40 p-2.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
              <ShoppingBag className="h-3 w-3 text-muted-foreground" />
              Orders
            </span>
            <div className="mt-1 text-base font-bold font-mono tabular-nums text-foreground">
              {formatNumber(customer.totalOrders)}
            </div>
          </div>

          <div className="rounded-md border border-border bg-surface-elevated/40 p-2.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              Last Order
            </span>
            <div className="mt-1 text-xs font-medium text-foreground truncate">
              {formatDate(customer.lastPurchaseDate)}
            </div>
          </div>
        </div>

        {/* Risk / Segment Context Note */}
        <div className="rounded-md border border-border bg-surface-elevated/30 p-3 text-xs text-muted-foreground space-y-1">
          <div className="flex items-center justify-between text-[11px] font-medium text-foreground">
            <span>Segment: {customer.segment}</span>
            <span>Churn Propensity: {(customer.churnProbability * 100).toFixed(1)}%</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Customer lifetime valuation is derived from BG/NBD transaction recency and Gamma-Gamma
            monetary parameters.
          </p>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs text-muted-foreground cursor-pointer"
          >
            Close Preview
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-xs gap-1.5 cursor-pointer bg-surface-elevated border-border"
          >
            <Link
              to={`/app/customers/${customer.id}`}
              onPointerEnter={() => prefetchRoute('customerProfile')}
            >
              <span>Open Full Intelligence Profile</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
