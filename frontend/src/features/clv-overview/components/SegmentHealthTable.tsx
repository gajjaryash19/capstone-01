import { Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react'
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

export function SegmentHealthTable({ segments }: SegmentHealthTableProps) {
  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 sm:pb-4 border-b border-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <CardTitle>Customer Segment Health Matrix</CardTitle>
          </div>
          <CardDescription className="mt-0.5">
            Behavioral cohorts ranked by spend velocity, retention stability, and churn propensity.
          </CardDescription>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
          {segments.length} cohort{segments.length === 1 ? '' : 's'} displayed
        </span>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Cohort Name</TableHead>
                <TableHead scope="col">Classification</TableHead>
                <TableHead scope="col" className="text-right">
                  Active Accounts
                </TableHead>
                <TableHead scope="col" className="text-right">
                  Avg. Spend
                </TableHead>
                <TableHead scope="col" className="text-right">
                  Retention
                </TableHead>
                <TableHead scope="col">Risk Profile</TableHead>
                <TableHead scope="col" className="text-right">
                  CLV Growth
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground py-4">
                      <Layers className="h-6 w-6 text-muted-foreground/40" />
                      <p className="text-xs font-medium text-foreground">
                        No cohorts match this segment filter.
                      </p>
                      <span className="text-[11px]">
                        Select another segment or reset filter to "All Cohorts".
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                segments.map((seg) => {
                  const isPositive = seg.clvGrowth.startsWith('+')

                  return (
                    <TableRow key={seg.id}>
                      <TableCell className="font-semibold text-foreground whitespace-nowrap">
                        {seg.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                        {seg.tier}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-foreground">
                        {formatNumber(seg.customerCount)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium text-foreground">
                        {formatCurrency(seg.averageSpend)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-foreground">
                        {formatPercent(seg.retentionRate)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            seg.churnRisk === 'low'
                              ? 'teal'
                              : seg.churnRisk === 'moderate'
                                ? 'warning'
                                : 'destructive'
                          }
                          dot
                        >
                          {seg.churnRisk.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-semibold">
                        <span
                          className={`inline-flex items-center ${
                            isPositive ? 'text-primary' : 'text-destructive'
                          }`}
                        >
                          {isPositive ? (
                            <ArrowUpRight className="mr-0.5 h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="mr-0.5 h-3 w-3" />
                          )}
                          {seg.clvGrowth}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
