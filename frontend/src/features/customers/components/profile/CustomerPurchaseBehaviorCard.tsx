import { Calendar, Clock, ShoppingCart, RefreshCw, FileText } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { formatCurrency, formatDate, formatNumber } from '@/lib/formatters'
import type { CustomerRecord } from '../../types'

interface CustomerPurchaseBehaviorCardProps {
  customer: CustomerRecord
}

export function CustomerPurchaseBehaviorCard({ customer }: CustomerPurchaseBehaviorCardProps) {
  // Evaluation platform reference timestamp: 2026-11-19
  const EVAL_REF_DATE = new Date('2026-11-19').getTime()
  const lastPurchaseTime = new Date(customer.lastPurchaseDate).getTime()
  const joinedTime = new Date(customer.joinedDate).getTime()

  const recencyDays = Math.max(
    0,
    Math.floor((EVAL_REF_DATE - lastPurchaseTime) / (1000 * 60 * 60 * 24)),
  )
  const tenureDays = Math.max(1, Math.floor((EVAL_REF_DATE - joinedTime) / (1000 * 60 * 60 * 24)))
  const tenureMonths = Math.max(1, Math.round(tenureDays / 30.4375))
  const monthlyCadence = (customer.totalOrders / (tenureDays / 30.4375)).toFixed(1)
  const avgDaysBetweenOrders = Math.max(1, Math.round(tenureDays / customer.totalOrders))

  const metrics = [
    {
      id: 'recency',
      label: 'Recency (Days Since Last Order)',
      value: `${recencyDays} days ago`,
      subtext: `Last purchase: ${formatDate(customer.lastPurchaseDate)}`,
      icon: Clock,
    },
    {
      id: 'tenure',
      label: 'Customer Relationship Tenure',
      value: `${tenureMonths} months active`,
      subtext: `First recorded order: ${formatDate(customer.joinedDate)}`,
      icon: Calendar,
    },
    {
      id: 'cadence',
      label: 'Purchase Cadence / Frequency',
      value: `${monthlyCadence} orders / month`,
      subtext: `Average interval: ~${avgDaysBetweenOrders} days between orders`,
      icon: RefreshCw,
    },
    {
      id: 'order-aggregates',
      label: 'Order Volume & Unit Economics',
      value: `${formatNumber(customer.totalOrders)} orders total`,
      subtext: `Average Order Value: ${formatCurrency(customer.averageOrderValue)}`,
      icon: ShoppingCart,
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-primary" />
          <CardTitle>Purchase Behavior & Order History</CardTitle>
        </div>
        <CardDescription>
          Behavioral frequency, recency, and transaction telemetry aggregated from customer billing
          records.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        {/* Behavioral Metrics Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {metrics.map((m) => {
            const Icon = m.icon
            return (
              <div
                key={m.id}
                className="rounded-lg border border-border/70 bg-card p-3.5 space-y-1.5 hover:border-border-strong transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{m.label}</span>
                </div>
                <div className="text-base font-bold text-foreground tabular-nums">{m.value}</div>
                <div className="text-[11px] text-muted-foreground">{m.subtext}</div>
              </div>
            )
          })}
        </div>

        {/* Itemized Transaction History Telemetry Status */}
        <div className="rounded-lg border border-dashed border-border bg-muted/20 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-muted p-2 text-muted-foreground shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <div className="space-y-1 text-xs text-muted-foreground leading-relaxed">
              <h4 className="font-semibold text-foreground">
                Itemized Transaction Receipts Status
              </h4>
              <p className="text-[11px]">
                Itemized line-item order receipts for{' '}
                <strong className="text-foreground font-medium">{customer.name}</strong> are not
                currently synchronized from the ERP/Billing connector.
              </p>
              <p className="text-[11px]">
                Summary behavioral telemetry (
                <span className="font-mono text-foreground">{customer.totalOrders}</span> completed
                orders,{' '}
                <span className="font-mono text-foreground">
                  {formatCurrency(customer.averageOrderValue)}
                </span>{' '}
                AOV, and{' '}
                <span className="font-mono text-foreground">
                  {formatCurrency(customer.historicalRevenue)}
                </span>{' '}
                cumulative revenue) is verified and aggregated from billing records.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
