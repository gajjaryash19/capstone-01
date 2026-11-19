import { useNavigate } from 'react-router-dom'
import { Layers, ArrowRight, Check } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/Table'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters'
import type { SegmentMetricRow, CustomerSegment } from '../types'

interface SegmentPerformanceTableProps {
  segments: SegmentMetricRow[]
  selectedSegment: CustomerSegment | null
  onSelectSegment: (segment: CustomerSegment | null) => void
}

export function SegmentPerformanceTable({
  segments,
  selectedSegment,
  onSelectSegment,
}: SegmentPerformanceTableProps) {
  const navigate = useNavigate()

  const handleNavigateToDirectory = (e: React.MouseEvent, segmentName: CustomerSegment) => {
    e.stopPropagation()
    navigate(`/customers?segment=${encodeURIComponent(segmentName)}`)
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 sm:pb-4 border-b border-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <CardTitle>Cohort Performance & Value Metrics</CardTitle>
          </div>
          <CardDescription className="mt-0.5">
            Comprehensive breakdown of customer distribution, monetization velocity, and risk
            exposure.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {selectedSegment && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectSegment(null)}
              className="text-xs h-7 cursor-pointer"
            >
              Clear Selection
            </Button>
          )}
          <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
            {segments.length} cohorts active
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Cohort Name</TableHead>
                <TableHead scope="col" className="text-right">
                  Customers & Share
                </TableHead>
                <TableHead scope="col" className="text-right">
                  Avg. Predicted CLV
                </TableHead>
                <TableHead scope="col" className="text-right">
                  Historical Revenue
                </TableHead>
                <TableHead scope="col" className="text-right">
                  Avg. Order Value
                </TableHead>
                <TableHead scope="col">Risk Profile</TableHead>
                <TableHead scope="col" className="text-right pr-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segments.map((seg) => {
                const isSelected = selectedSegment === seg.name

                return (
                  <TableRow
                    key={seg.id}
                    onClick={() => onSelectSegment(isSelected ? null : seg.name)}
                    data-state={isSelected ? 'selected' : undefined}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-accent/40 hover:bg-accent/50' : ''
                    }`}
                  >
                    {/* Segment name & strategic classification */}
                    <TableCell className="py-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground text-sm">{seg.name}</span>
                          {isSelected && (
                            <Badge variant="teal" className="text-[10px] py-0 px-1.5 h-4">
                              <Check className="h-2.5 w-2.5 mr-0.5" /> Selected
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-xs">
                          {seg.description}
                        </p>
                      </div>
                    </TableCell>

                    {/* Customer count & share */}
                    <TableCell className="text-right tabular-nums py-3">
                      <div className="font-semibold text-foreground">
                        {formatNumber(seg.customerCount)} accts
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {formatPercent(seg.customerShare)} of base
                      </div>
                    </TableCell>

                    {/* Avg. Predicted CLV */}
                    <TableCell className="text-right tabular-nums py-3">
                      <div className="font-semibold text-foreground">
                        {formatCurrency(seg.averageClv)}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Total: {formatCurrency(seg.totalClv)}
                      </div>
                    </TableCell>

                    {/* Historical Revenue & contribution */}
                    <TableCell className="text-right tabular-nums py-3">
                      <div className="font-semibold text-foreground">
                        {formatCurrency(seg.totalHistoricalRevenue)}
                      </div>
                      <div className="text-[11px] text-primary font-medium">
                        {formatPercent(seg.revenueShare)} rev share
                      </div>
                    </TableCell>

                    {/* Avg Order Value & orders */}
                    <TableCell className="text-right tabular-nums py-3">
                      <div className="font-semibold text-foreground">
                        {formatCurrency(seg.averageOrderValue)}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {seg.averageOrders} orders/acct
                      </div>
                    </TableCell>

                    {/* Risk indicator */}
                    <TableCell className="py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant={
                              seg.highRiskPercentage > 30
                                ? 'destructive'
                                : seg.highRiskPercentage > 15
                                  ? 'warning'
                                  : 'success'
                            }
                            className="text-[10px]"
                          >
                            {seg.highRiskCount} High Risk (
                            {formatPercent(seg.highRiskPercentage, 0)})
                          </Badge>
                        </div>
                        <div className="text-[10px] text-muted-foreground tabular-nums">
                          {seg.churnRiskDistribution.low} Low • {seg.churnRiskDistribution.moderate}{' '}
                          Mod
                        </div>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right py-3 pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleNavigateToDirectory(e, seg.name)}
                          className="h-7 px-2 text-xs text-primary hover:text-primary hover:bg-accent/80 gap-1 cursor-pointer"
                          title={`View ${seg.name} customers in directory`}
                        >
                          <span>Directory</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
