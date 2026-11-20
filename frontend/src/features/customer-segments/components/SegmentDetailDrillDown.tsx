import { Link, useNavigate } from 'react-router-dom'
import { ExternalLink, Target, Sparkles, ArrowRight, X } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
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
      <Card className="border-dashed border-border bg-surface/50">
        <CardContent className="p-8 text-center space-y-2.5">
          <div className="flex justify-center">
            <div className="p-3 rounded-2xl bg-surface-elevated text-muted-foreground border border-border">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            Select a segment to view details
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            Click on any segment in the charts or table above to inspect customer accounts and
            recommended actions.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Filter customers belonging to selected segment
  const segmentCustomers = customers.filter((c) => c.segment === selectedSegment)

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
    <Card className="bg-surface border-border shadow-xs">
      <CardHeader className="pb-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
                {segmentMetrics.name} Details
              </CardTitle>
              <span className="font-mono text-xs text-muted-foreground bg-surface-elevated px-2 py-0.5 rounded border border-border">
                {segmentMetrics.customerCount} Accounts •{' '}
                {formatPercent(segmentMetrics.customerShare)} of base
              </span>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              {segmentMetrics.description}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
              className="gap-1.5 cursor-pointer text-xs h-8 bg-surface-elevated border-border"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Clear</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate(`/customers?segment=${encodeURIComponent(segmentMetrics.name)}`)
              }
              className="gap-1.5 cursor-pointer text-xs h-8 bg-surface-elevated border-border"
            >
              <span>View customers</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        {/* Metric Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-lg border border-border bg-surface-elevated/40 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">
              Avg. Predicted CLV
            </span>
            <div className="text-lg font-bold font-mono text-foreground tabular-nums">
              {formatCurrency(segmentMetrics.averageClv)}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border bg-surface-elevated/40 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">
              Total Predicted Value
            </span>
            <div className="text-lg font-bold font-mono text-foreground tabular-nums">
              {formatCurrency(segmentMetrics.totalClv)}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border bg-surface-elevated/40 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">
              Revenue Share
            </span>
            <div className="text-lg font-bold font-mono text-foreground tabular-nums">
              {formatPercent(segmentMetrics.revenueShare)}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border bg-surface-elevated/40 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">
              High Churn Risk
            </span>
            <div className="text-lg font-bold font-mono tabular-nums text-foreground">
              {formatPercent(segmentMetrics.highRiskPercentage)} ({segmentMetrics.highRiskCount})
            </div>
          </div>
        </div>

        {/* Strategic Guidance Box */}
        <div className="rounded-lg border border-border bg-surface-elevated/40 p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Strategy & Focus: {segmentMetrics.label}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {segmentMetrics.strategicFocus}
          </p>
        </div>

        {/* Member Customer Account Roster */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Customers in this segment ({segmentCustomers.length})
            </h4>
            <span className="text-[11px] text-muted-foreground font-mono">
              Sorted by Predicted CLV
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {segmentCustomers.map((cust) => (
              <div
                key={cust.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface-elevated/30 hover:border-border-strong hover:bg-surface-elevated/60 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-elevated font-mono font-semibold text-xs border border-border text-foreground">
                    {cust.avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-xs text-foreground truncate">{cust.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate font-mono">
                      {cust.id} • {cust.company}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="font-mono text-xs font-semibold text-foreground tabular-nums">
                      {formatCurrency(cust.predictedClv)}
                    </div>
                    <span
                      className={`inline-flex items-center rounded px-1.5 py-0.2 font-mono text-[10px] uppercase border ${getRiskBadge(
                        cust.churnRisk,
                      )}`}
                    >
                      {cust.churnRisk}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                    title={`View profile for ${cust.name}`}
                  >
                    <Link to={`/app/customers/${cust.id}`}>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
