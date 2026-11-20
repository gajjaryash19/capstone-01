import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layers, ArrowRight, Check } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
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

function SegmentPerformanceTableComponent({
  segments,
  selectedSegment,
  onSelectSegment,
}: SegmentPerformanceTableProps) {
  const navigate = useNavigate()

  const handleNavigateToDirectory = (e: React.MouseEvent, segmentName: CustomerSegment) => {
    e.stopPropagation()
    navigate(`/app/customers?segment=${encodeURIComponent(segmentName)}`)
  }

  const getSegmentBadgeStyle = (segment: string) => {
    switch (segment) {
      case 'Enterprise':
        return 'border-foreground/30 bg-surface-elevated text-foreground font-semibold'
      case 'Mid-Market':
        return 'border-border bg-muted/60 text-foreground/90 font-medium'
      case 'Growth':
        return 'border-border bg-muted/40 text-muted-foreground font-medium'
      case 'Standard':
      default:
        return 'border-border/60 bg-muted/20 text-muted-foreground/80 font-normal'
    }
  }

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 sm:pb-4 border-b border-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-foreground/80" />
            <CardTitle className="text-base font-semibold text-foreground">
              Segment Performance & Value
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Breakdown of customer count, average predicted value, and churn risk by segment.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {selectedSegment && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectSegment(null)}
              className="text-xs h-7 cursor-pointer bg-surface-elevated border-border"
            >
              Clear Selection
            </Button>
          )}
          <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap font-mono">
            {segments.length} segments
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-surface-elevated/70">
                <TableHead className="px-3 sm:px-4 text-xs font-semibold text-muted-foreground">
                  Segment
                </TableHead>
                <TableHead className="px-3 sm:px-4 text-xs font-semibold text-right text-muted-foreground">
                  Accounts
                </TableHead>
                <TableHead className="px-3 sm:px-4 text-xs font-semibold text-right text-muted-foreground">
                  Base Share
                </TableHead>
                <TableHead className="px-3 sm:px-4 text-xs font-semibold text-right text-muted-foreground">
                  Avg. Predicted CLV
                </TableHead>
                <TableHead className="px-3 sm:px-4 text-xs font-semibold text-right text-muted-foreground">
                  Total Predicted CLV
                </TableHead>
                <TableHead className="px-3 sm:px-4 text-xs font-semibold text-right text-muted-foreground">
                  Revenue Share
                </TableHead>
                <TableHead className="px-3 sm:px-4 text-xs font-semibold text-right text-muted-foreground">
                  Avg. AOV
                </TableHead>
                <TableHead className="px-3 sm:px-4 text-xs font-semibold text-center text-muted-foreground">
                  High Risk Share
                </TableHead>
                <TableHead className="px-3 sm:px-4 text-xs font-semibold text-right text-muted-foreground">
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
                    className={`cursor-pointer transition-colors duration-150 ease-out border-b border-border/70 ${
                      isSelected
                        ? 'bg-surface-elevated font-medium'
                        : 'hover:bg-surface-elevated/50'
                    }`}
                  >
                    {/* Cohort Name */}
                    <TableCell className="px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs border ${getSegmentBadgeStyle(
                            seg.name,
                          )}`}
                        >
                          {seg.name}
                        </span>
                        {isSelected && (
                          <span className="flex items-center text-[10px] text-foreground font-mono">
                            <Check className="h-3 w-3 mr-0.5" /> Selected
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Customer Count */}
                    <TableCell className="px-3 sm:px-4 py-3 text-right font-mono font-medium text-foreground tabular-nums">
                      {formatNumber(seg.customerCount)}
                    </TableCell>

                    {/* Customer Share */}
                    <TableCell className="px-3 sm:px-4 py-3 text-right font-mono text-muted-foreground tabular-nums">
                      {formatPercent(seg.customerShare)}
                    </TableCell>

                    {/* Avg CLV */}
                    <TableCell className="px-3 sm:px-4 py-3 text-right font-mono font-semibold text-foreground tabular-nums">
                      {formatCurrency(seg.averageClv)}
                    </TableCell>

                    {/* Total CLV */}
                    <TableCell className="px-3 sm:px-4 py-3 text-right font-mono text-foreground tabular-nums">
                      {formatCurrency(seg.totalClv)}
                    </TableCell>

                    {/* Revenue Share */}
                    <TableCell className="px-3 sm:px-4 py-3 text-right font-mono font-medium text-foreground tabular-nums">
                      {formatPercent(seg.revenueShare)}
                    </TableCell>

                    {/* Avg Order Value */}
                    <TableCell className="px-3 sm:px-4 py-3 text-right font-mono text-muted-foreground tabular-nums">
                      {formatCurrency(seg.averageOrderValue)}
                    </TableCell>

                    {/* High Risk Share */}
                    <TableCell className="px-3 sm:px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs tabular-nums border ${
                          seg.highRiskPercentage > 30
                            ? 'border-red-500/30 bg-red-500/10 text-red-400 font-semibold'
                            : 'border-border bg-muted/40 text-muted-foreground'
                        }`}
                      >
                        {formatPercent(seg.highRiskPercentage)} ({seg.highRiskCount})
                      </span>
                    </TableCell>

                    {/* Action Links */}
                    <TableCell className="px-3 sm:px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleNavigateToDirectory(e, seg.name)}
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                        title={`View ${seg.name} accounts in directory`}
                      >
                        <span>Directory</span>
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
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

export const SegmentPerformanceTable = memo(SegmentPerformanceTableComponent)
export default SegmentPerformanceTable
