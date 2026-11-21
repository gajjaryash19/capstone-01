import { useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts'
import { BarChart3 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useChartTheme } from '@/hooks/useChartTheme'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters'
import type { PredictionDistributionBin, PredictionSegmentBreakdown } from '../types'

interface PredictionDistributionChartProps {
  distributionBins: PredictionDistributionBin[]
  segmentBreakdown: PredictionSegmentBreakdown[]
}

type ViewMode = 'tiers' | 'segments'

interface ChartDisplayItem {
  displayName: string
  customerCount: number
  customerShare: number
  totalClv: number
  avgClv: number
  clvShare: number
  isSegment?: boolean
  historicalRevenue?: number
  projectedExpansion?: number
  expansionPercent?: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
    payload: ChartDisplayItem
  }>
  label?: string
}

function CustomDistributionTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const item = payload[0].payload

  return (
    <div className="rounded-lg border border-border bg-surface-elevated text-foreground p-3 shadow-lg text-xs min-w-56">
      <div className="font-semibold text-foreground border-b border-border/80 pb-1.5 mb-2 flex items-center justify-between">
        <span>{label}</span>
        <span className="font-mono text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
          Avg: {formatCurrency(item.avgClv)}
        </span>
      </div>

      <div className="space-y-1.5 text-muted-foreground text-[11px]">
        <div className="flex justify-between items-center">
          <span>Customer Count:</span>
          <strong className="text-foreground font-semibold font-mono tabular-nums">
            {formatNumber(item.customerCount)} accounts ({formatPercent(item.customerShare)})
          </strong>
        </div>

        <div className="flex justify-between items-center">
          <span>Total Predicted Value:</span>
          <strong className="text-foreground font-bold font-mono tabular-nums">
            {formatCurrency(item.totalClv)} ({formatPercent(item.clvShare)})
          </strong>
        </div>

        {item.isSegment && item.historicalRevenue !== undefined && (
          <div className="flex justify-between items-center pt-1 border-t border-border/60">
            <span>Past Revenue:</span>
            <span className="text-foreground font-mono tabular-nums">
              {formatCurrency(item.historicalRevenue)}
            </span>
          </div>
        )}

        {item.isSegment && item.projectedExpansion !== undefined && (
          <div className="flex justify-between items-center">
            <span>Expected Growth:</span>
            <span className="text-foreground font-semibold font-mono tabular-nums">
              +{formatCurrency(item.projectedExpansion)} ({item.expansionPercent}%)
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

const CHART_MARGIN = { top: 10, right: 10, left: 0, bottom: 20 }

export function PredictionDistributionChart({
  distributionBins,
  segmentBreakdown,
}: PredictionDistributionChartProps) {
  const chartHex = useChartTheme()
  const [viewMode, setViewMode] = useState<ViewMode>('tiers')

  const chartData: ChartDisplayItem[] =
    viewMode === 'tiers'
      ? distributionBins.map((bin) => ({
          displayName: bin.shortLabel,
          customerCount: bin.customerCount,
          customerShare: bin.customerShare,
          totalClv: bin.totalClv,
          avgClv: bin.avgClv,
          clvShare: bin.clvShare,
          isSegment: false,
        }))
      : segmentBreakdown.map((seg) => ({
          displayName: seg.segment,
          customerCount: seg.customerCount,
          customerShare: seg.customerShare,
          totalClv: seg.totalClv,
          avgClv: seg.avgClv,
          clvShare: seg.clvShare,
          historicalRevenue: seg.historicalRevenue,
          projectedExpansion: seg.projectedExpansion,
          expansionPercent: seg.expansionPercent,
          isSegment: true,
        }))

  return (
    <Card className="flex flex-col bg-surface border-border">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-foreground/80" />
            <CardTitle className="text-base font-semibold text-foreground">
              {viewMode === 'tiers' ? 'Value Range Distribution' : 'Segment Value Forecast'}
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            {viewMode === 'tiers'
              ? 'Number of customers across predicted value ranges.'
              : 'Predicted 12-month lifetime value by customer segment.'}
          </CardDescription>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center rounded-md border border-border bg-muted/30 p-0.5 self-start sm:self-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('tiers')}
            className={`h-7 px-2.5 text-xs rounded-xs font-medium cursor-pointer ${
              viewMode === 'tiers'
                ? 'bg-surface-elevated text-foreground shadow-2xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Value Tiers
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('segments')}
            className={`h-7 px-2.5 text-xs rounded-xs font-medium cursor-pointer ${
              viewMode === 'segments'
                ? 'bg-surface-elevated text-foreground shadow-2xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            By Segment
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-5 flex-1 flex flex-col justify-between">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%" debounce={100}>
            <BarChart data={chartData} margin={CHART_MARGIN}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartHex.grid} />
              <XAxis
                dataKey="displayName"
                tick={{ fontSize: 11, fill: 'var(--foreground-muted)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--foreground-muted)' }}
                axisLine={false}
                tickLine={false}
                width={35}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomDistributionTooltip />}
                cursor={{ fill: chartHex.cursor, stroke: 'none' }}
              />
              <Bar dataKey="customerCount" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                {chartData.map((_, index) => {
                  const colors = [
                    chartHex.series1,
                    chartHex.series4,
                    chartHex.series2,
                    chartHex.series3,
                    chartHex.series2,
                  ]
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                      stroke="var(--border)"
                      strokeWidth={0.5}
                    />
                  )
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Accessible Screen Reader Data Table */}
          <div className="sr-only">
            <h4>Accessible Data Table for Prediction Distribution</h4>
            <table>
              <caption className="sr-only">
                {viewMode === 'tiers'
                  ? 'Account count concentration across discrete predicted monetary valuation brackets'
                  : 'Forward 12-month lifetime value expectations aggregated by customer tier'}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{viewMode === 'tiers' ? 'CLV Bracket' : 'Cohort Segment'}</th>
                  <th scope="col">Account Count</th>
                  <th scope="col">Total CLV</th>
                  <th scope="col">Average CLV</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((d) => (
                  <tr key={d.displayName}>
                    <td>{d.displayName}</td>
                    <td>{formatNumber(d.customerCount)}</td>
                    <td>{formatCurrency(d.totalClv)}</td>
                    <td>{formatCurrency(d.avgClv)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Hover over bars to view customer share and average value</span>
          <span className="font-mono">36 Total Customers</span>
        </div>
      </CardContent>
    </Card>
  )
}
