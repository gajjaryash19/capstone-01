import { Link, useNavigate } from 'react-router-dom'
import { Users, ExternalLink, Target, Sparkles, ShieldAlert, ArrowRight, X } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import type { CustomerRecord } from '../../customers/types'
import type { SegmentMetricRow, CustomerSegment } from '../types'

interface SegmentDetailDrillDownProps {
  selectedSegment: CustomerSegment | null
  segmentMetrics?: SegmentMetricRow
  customers: CustomerRecord[]
  onClearSelection: () => void
}

export function SegmentDetailDrillDown({
  selectedSegment,
  segmentMetrics,
  customers,
  onClearSelection,
}: SegmentDetailDrillDownProps) {
  const navigate = useNavigate()

  if (!selectedSegment || !segmentMetrics) {
    return (
      <Card className="border-dashed border-border bg-muted/20">
        <CardContent className="p-6 text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-2.5 rounded-full bg-muted text-muted-foreground">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <h2 className="text-sm font-semibold text-foreground">
            Segment Drill-Down & Member Accounts
          </h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Select any cohort from the distribution charts, risk matrix, or performance table to
            inspect individual accounts and review strategic retention priorities.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Filter customers belonging to selected segment
  const segmentCustomers = customers.filter((c) => c.segment === selectedSegment)

  return (
    <Card className="border-primary/40 shadow-xs">
      <CardHeader className="pb-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base sm:text-lg">
                {segmentMetrics.name} Deep Dive
              </CardTitle>
              <Badge variant="teal" dot>
                {segmentMetrics.customerCount} Accounts •{' '}
                {formatPercent(segmentMetrics.customerShare)} of base
              </Badge>
              <Badge
                variant={
                  segmentMetrics.status === 'expanding'
                    ? 'success'
                    : segmentMetrics.status === 'stable'
                      ? 'secondary'
                      : 'destructive'
                }
              >
                {segmentMetrics.status.toUpperCase()}
              </Badge>
            </div>
            <CardDescription>{segmentMetrics.description}</CardDescription>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/customers?segment=${encodeURIComponent(selectedSegment)}`)}
              className="text-xs gap-1.5 cursor-pointer"
            >
              <span>Explore in Directory</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
              title="Close drill-down"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-5">
        {/* Strategic Guidance & Focus Callout */}
        <div className="rounded-lg bg-accent/40 p-3 sm:p-3.5 border border-primary/20 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Recommended Strategic Focus:</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {segmentMetrics.strategicFocus}
          </p>
        </div>

        {/* Compact Segment Performance Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-md bg-muted/30 border border-border/70">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
              Avg. Predicted CLV
            </span>
            <div className="text-base font-bold text-foreground tabular-nums mt-0.5">
              {formatCurrency(segmentMetrics.averageClv)}
            </div>
            <span className="text-[10px] text-muted-foreground">
              Total: {formatCurrency(segmentMetrics.totalClv)}
            </span>
          </div>

          <div className="p-3 rounded-md bg-muted/30 border border-border/70">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
              Avg. Historical Spend
            </span>
            <div className="text-base font-bold text-foreground tabular-nums mt-0.5">
              {formatCurrency(segmentMetrics.averageHistoricalRevenue)}
            </div>
            <span className="text-[10px] text-primary font-medium">
              {formatPercent(segmentMetrics.revenueShare)} rev share
            </span>
          </div>

          <div className="p-3 rounded-md bg-muted/30 border border-border/70">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
              Average Order Value
            </span>
            <div className="text-base font-bold text-foreground tabular-nums mt-0.5">
              {formatCurrency(segmentMetrics.averageOrderValue)}
            </div>
            <span className="text-[10px] text-muted-foreground">
              {segmentMetrics.averageOrders} orders/acct
            </span>
          </div>

          <div className="p-3 rounded-md bg-muted/30 border border-border/70">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
              Churn Vulnerability
            </span>
            <div className="text-base font-bold text-foreground tabular-nums mt-0.5 flex items-center gap-1">
              <span>{segmentMetrics.highRiskCount} High Risk</span>
              <ShieldAlert className="h-3.5 w-3.5 text-destructive shrink-0" />
            </div>
            <span className="text-[10px] text-muted-foreground">
              {formatPercent(segmentMetrics.highRiskPercentage)} of cohort
            </span>
          </div>
        </div>

        {/* Segment Customers Roster */}
        <div className="space-y-3 pt-2 border-t border-border/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Accounts in this Segment ({segmentCustomers.length})
              </h3>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Ordered by Predicted Lifetime Value
            </span>
          </div>

          <div className="divide-y divide-border/60 border border-border rounded-md overflow-hidden bg-card">
            {segmentCustomers.map((cust) => (
              <div
                key={cust.id}
                className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground font-semibold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                    {cust.avatarInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/customers/${cust.id}`}
                        className="text-xs font-semibold text-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
                      >
                        {cust.name}
                      </Link>
                      <Badge
                        variant={
                          cust.churnRisk === 'low'
                            ? 'success'
                            : cust.churnRisk === 'moderate'
                              ? 'warning'
                              : 'destructive'
                        }
                        className="text-[9px] py-0 px-1.5 h-4"
                      >
                        {cust.churnRisk.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {cust.company} • {cust.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 text-xs tabular-nums">
                  <div className="text-left sm:text-right">
                    <div className="font-semibold text-foreground">
                      {formatCurrency(cust.predictedClv)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Predicted CLV</div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="font-medium text-foreground">
                      {formatCurrency(cust.historicalRevenue)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {cust.totalOrders} orders
                    </div>
                  </div>

                  <Link
                    to={`/customers/${cust.id}`}
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                    title={`View ${cust.name} Profile`}
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
