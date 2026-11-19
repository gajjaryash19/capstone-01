import {
  Calendar,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  Building2,
  Mail,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate, formatNumber } from '@/lib/formatters'
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl sm:max-w-xl p-5 sm:p-6">
        <DialogHeader className="pb-3 border-b border-border/70">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/70 text-primary font-bold text-sm border border-primary/20">
              {customer.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base font-semibold truncate">
                  {customer.name}
                </DialogTitle>
                <Badge variant={getRiskVariant(customer.churnRisk)} dot>
                  {customer.churnRisk.toUpperCase()} RISK
                </Badge>
              </div>
              <DialogDescription className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                <span className="font-mono text-[11px] text-foreground/80">{customer.id}</span>
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
          <div className="rounded-md border border-border/60 bg-muted/30 p-2.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              Predicted CLV
            </span>
            <div className="mt-1 text-base font-bold tabular-nums text-primary">
              {formatCurrency(customer.predictedClv)}
            </div>
          </div>

          <div className="rounded-md border border-border/60 bg-muted/30 p-2.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              Revenue
            </span>
            <div className="mt-1 text-base font-bold tabular-nums text-foreground">
              {formatCurrency(customer.historicalRevenue)}
            </div>
          </div>

          <div className="rounded-md border border-border/60 bg-muted/30 p-2.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
              <ShoppingBag className="h-3 w-3 text-muted-foreground" />
              Total Orders
            </span>
            <div className="mt-1 text-base font-bold tabular-nums text-foreground">
              {formatNumber(customer.totalOrders)}
            </div>
          </div>

          <div className="rounded-md border border-border/60 bg-muted/30 p-2.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              Avg Order Value
            </span>
            <div className="mt-1 text-base font-bold tabular-nums text-foreground">
              {formatCurrency(customer.averageOrderValue)}
            </div>
          </div>
        </div>

        {/* Customer Intelligence Highlights */}
        <div className="space-y-2 text-xs border-t border-border/60 pt-3">
          <div className="flex justify-between items-center py-1 border-b border-border/40">
            <span className="text-muted-foreground">Assigned Segment:</span>
            <span className="font-semibold text-foreground">{customer.segment}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-border/40">
            <span className="text-muted-foreground">Churn Propensity Score:</span>
            <span className="font-semibold tabular-nums text-foreground flex items-center gap-1.5">
              <ShieldAlert
                className={`h-3.5 w-3.5 ${
                  customer.churnRisk === 'high'
                    ? 'text-destructive'
                    : customer.churnRisk === 'moderate'
                      ? 'text-amber-500'
                      : 'text-emerald-500'
                }`}
              />
              {(customer.churnProbability * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-border/40">
            <span className="text-muted-foreground">Last Recorded Purchase:</span>
            <span className="font-medium text-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              {formatDate(customer.lastPurchaseDate)}
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-muted-foreground">Customer Since:</span>
            <span className="font-medium text-foreground">{formatDate(customer.joinedDate)}</span>
          </div>
        </div>

        {/* Clean Roadmap Entry / Integration Notice */}
        <div className="rounded-md bg-muted/40 border border-border p-3 text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Customer Profile Workspace — Phase 2.2</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Full profile deep-dives, cohort migration histories, purchase interval timelines, and
            individualized retention playbooks will be launched in the Phase 2.2 Customer Profile
            release.
          </p>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
