import { memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/Table'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters'
import type { SegmentHealthRow } from '../types'

interface SegmentHealthTableProps {
  segments: SegmentHealthRow[]
}

function SegmentHealthTableComponent({ segments }: SegmentHealthTableProps) {
  const { totalAccounts, avgRetention } = useMemo(() => {
    const total = segments.reduce((sum, s) => sum + s.customerCount, 0)
    const avg =
      segments.length > 0
        ? segments.reduce((sum, s) => sum + s.retentionRate * s.customerCount, 0) /
          Math.max(1, total)
        : 0
    return { totalAccounts: total, avgRetention: avg }
  }, [segments])

  const getRiskBadge = (risk: 'low' | 'moderate' | 'high') => {
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
        return (
          <Badge variant="destructive" dot className="font-mono text-[10px]">
            HIGH
          </Badge>
        )
    }
  }

  return (
    <Card className="xl:col-span-2 min-w-0 flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 sm:pb-4 border-b border-border gap-2">
        <div>
          <CardTitle>Segment Health & Performance</CardTitle>
          <CardDescription className="mt-0.5">
            Customer groups ranked by average spend, retention rate, and churn risk.
          </CardDescription>
        </div>
        <span className="text-xs text-muted-foreground font-mono tabular-nums whitespace-nowrap">
          {segments.length} cohort{segments.length === 1 ? '' : 's'} displayed
        </span>
      </CardHeader>

      <CardContent className="p-0">
        {segments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground p-8 text-center">
            <Layers className="h-6 w-6 text-muted-foreground/40 mb-1" />
            <p className="text-xs font-semibold text-foreground">No cohorts match this filter.</p>
            <span className="text-[11px]">
              Select another cohort or reset filter to "All Cohorts".
            </span>
          </div>
        ) : (
          <>
            {/* Desktop Table View (>= 640px) */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead scope="col" className="text-xs font-semibold px-1.5 sm:px-2">
                      Cohort Name
                    </TableHead>
                    <TableHead scope="col" className="text-xs font-semibold px-1.5 sm:px-2">
                      Tier
                    </TableHead>
                    <TableHead
                      scope="col"
                      className="text-right text-xs font-semibold px-1.5 sm:px-2"
                    >
                      Accounts
                    </TableHead>
                    <TableHead
                      scope="col"
                      className="text-right text-xs font-semibold px-1.5 sm:px-2"
                    >
                      Avg Spend
                    </TableHead>
                    <TableHead
                      scope="col"
                      className="text-right text-xs font-semibold px-1.5 sm:px-2"
                    >
                      Retention
                    </TableHead>
                    <TableHead scope="col" className="text-xs font-semibold px-1.5 sm:px-2">
                      Risk
                    </TableHead>
                    <TableHead
                      scope="col"
                      className="text-right text-xs font-semibold px-1.5 sm:px-2"
                    >
                      CLV Growth
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {segments.map((seg) => {
                    const isPositive = seg.clvGrowth.startsWith('+')

                    return (
                      <TableRow
                        key={seg.id}
                        className="hover:bg-surface-elevated/40 transition-colors"
                      >
                        <TableCell className="font-semibold text-foreground whitespace-nowrap text-xs px-1.5 sm:px-2 py-2.5 sm:py-2.5">
                          {seg.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs whitespace-nowrap font-medium px-1.5 sm:px-2 py-2.5 sm:py-2.5">
                          {seg.tier.replace(/\s*\([^)]*\)/, '')}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums text-foreground text-xs px-1.5 sm:px-2 py-2.5 sm:py-2.5">
                          {formatNumber(seg.customerCount)}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums font-semibold text-foreground text-xs px-1.5 sm:px-2 py-2.5 sm:py-2.5">
                          {formatCurrency(seg.averageSpend)}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums text-foreground text-xs px-1.5 sm:px-2 py-2.5 sm:py-2.5">
                          {formatPercent(seg.retentionRate)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-1.5 sm:px-2 py-2.5 sm:py-2.5">
                          {getRiskBadge(seg.churnRisk)}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums font-semibold text-xs whitespace-nowrap px-1.5 sm:px-2 py-2.5 sm:py-2.5">
                          <span
                            className={`inline-flex items-center gap-0.5 ${
                              isPositive ? 'text-foreground' : 'text-destructive'
                            }`}
                          >
                            {isPositive ? (
                              <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 text-destructive" />
                            )}
                            {seg.clvGrowth}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Stacked Card View (< 640px) */}
            <div className="block sm:hidden divide-y divide-border/60 p-3 space-y-3">
              {segments.map((seg) => {
                const isPositive = seg.clvGrowth.startsWith('+')

                return (
                  <div
                    key={seg.id}
                    className="pt-3 first:pt-0 space-y-2.5 rounded-lg bg-surface-elevated/40 p-3 border border-border/70"
                  >
                    {/* Header: Name + Risk Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-semibold text-foreground leading-snug">
                          {seg.name}
                        </h4>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {seg.tier}
                        </span>
                      </div>
                      {getRiskBadge(seg.churnRisk)}
                    </div>

                    {/* Metric Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/50">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                          Active Accounts
                        </span>
                        <span className="font-mono tabular-nums font-semibold text-foreground">
                          {formatNumber(seg.customerCount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                          Avg. Spend
                        </span>
                        <span className="font-mono tabular-nums font-semibold text-foreground">
                          {formatCurrency(seg.averageSpend)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                          Retention Rate
                        </span>
                        <span className="font-mono tabular-nums font-semibold text-foreground">
                          {formatPercent(seg.retentionRate)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                          CLV Growth
                        </span>
                        <span
                          className={`font-mono tabular-nums font-semibold inline-flex items-center gap-0.5 ${
                            isPositive ? 'text-foreground' : 'text-destructive'
                          }`}
                        >
                          {isPositive ? (
                            <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 text-destructive" />
                          )}
                          {seg.clvGrowth}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </CardContent>

      {/* Portfolio Health Summary Footer */}
      {segments.length > 0 && (
        <div className="px-4 sm:px-6 py-3 border-t border-border/60 bg-surface/30 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>
              Total Accounts:{' '}
              <strong className="text-foreground font-mono tabular-nums font-semibold">
                {formatNumber(totalAccounts)}
              </strong>
            </span>
            <span className="text-border hidden sm:inline" aria-hidden="true">
              •
            </span>
            <span>
              Weighted Retention:{' '}
              <strong className="text-foreground font-mono tabular-nums font-semibold">
                {formatPercent(avgRetention)}
              </strong>
            </span>
          </div>
          <Link
            to="/app/segments"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground hover:underline transition-colors cursor-pointer"
          >
            <span>View all segments</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </Card>
  )
}

export const SegmentHealthTable = memo(SegmentHealthTableComponent)
export default SegmentHealthTable
