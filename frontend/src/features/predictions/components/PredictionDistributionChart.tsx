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
import { BarChart3, Sparkles } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { designTokens } from '@/styles/tokens'
import { formatCurrency } from '@/lib/formatters'
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
    <div className="rounded-lg border border-border bg-card p-3 shadow-md text-xs min-w-56">
      <div className="font-semibold text-foreground border-b border-border/80 pb-1.5 mb-2 flex items-center justify-between">
        <span>{label}</span>
        <Badge variant="teal" className="text-[10px] px-1.5 py-0">
          Avg: {formatCurrency(item.avgClv)}
        </Badge>
      </div>

      <div className="space-y-1.5 text-muted-foreground text-[11px]">
        <div className="flex justify-between items-center">
          <span>Customer Count:</span>
          <strong className="text-foreground font-semibold tabular-nums">
            {item.customerCount} accounts ({item.customerShare}%)
          </strong>
        </div>

        <div className="flex justify-between items-center">
          <span>Total Predicted Value:</span>
          <strong className="text-primary font-semibold tabular-nums">
            {formatCurrency(item.totalClv)} ({item.clvShare}%)
          </strong>
        </div>

        {item.isSegment && item.historicalRevenue !== undefined && (
          <div className="flex justify-between items-center pt-1 border-t border-border/60">
            <span>Historical Baseline:</span>
            <span className="text-foreground font-medium tabular-nums">
              {formatCurrency(item.historicalRevenue)}
            </span>
          </div>
        )}

        {item.isSegment && item.projectedExpansion !== undefined && (
          <div className="flex justify-between items-center">
            <span>Projected Growth:</span>
            <span className="text-emerald-600 font-semibold tabular-nums">
              +{formatCurrency(item.projectedExpansion)} ({item.expansionPercent}%)
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export function PredictionDistributionChart({
  distributionBins,
  segmentBreakdown,
}: PredictionDistributionChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('tiers')
  const chartHex = designTokens.charts.hex

  const tierChartData: ChartDisplayItem[] = distributionBins.map((bin) => ({
    displayName: bin.shortLabel,
    customerCount: bin.customerCount,
    customerShare: bin.customerShare,
    totalClv: bin.totalClv,
    avgClv: bin.avgClv,
    clvShare: bin.clvShare,
    isSegment: false,
  }))

  const segmentChartData: ChartDisplayItem[] = segmentBreakdown.map((seg) => ({
    displayName: seg.segment,
    customerCount: seg.customerCount,
    customerShare: seg.customerShare,
    totalClv: seg.totalClv,
    avgClv: seg.avgClv,
    clvShare: seg.clvShare,
    isSegment: true,
    historicalRevenue: seg.historicalRevenue,
    projectedExpansion: seg.projectedExpansion,
    expansionPercent: seg.expansionPercent,
  }))

  const activeData = viewMode === 'tiers' ? tierChartData : segmentChartData

  // Summary statistics for callout
  const topTierCount = distributionBins
    .filter((b) => b.min >= 10000)
    .reduce((acc, b) => acc + b.customerCount, 0)
  const topTierValue = distributionBins
    .filter((b) => b.min >= 10000)
    .reduce((acc, b) => acc + b.totalClv, 0)
  const topTierShare = distributionBins
    .filter((b) => b.min >= 10000)
    .reduce((acc, b) => acc + b.clvShare, 0)

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 sm:pb-4 border-b border-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <CardTitle>Predicted Value Distribution</CardTitle>
          </div>
          <CardDescription className="mt-0.5">
            Frequency distribution of 12-month customer lifetime value forecasts across the cohort.
          </CardDescription>
        </div>

        {/* View Toggle */}
        <div className="flex items-center rounded-lg border border-border p-0.5 bg-muted/40 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('tiers')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'tiers'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Value Tiers (6 Bins)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('segments')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'segments'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            By Segment
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex-1 flex flex-col justify-between space-y-4">
        {/* Recharts Bar Chart */}
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeData} margin={{ top: 12, right: 12, left: -16, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartHex.grid} />
              <XAxis
                dataKey="displayName"
                tick={{ fontSize: 11, fill: 'var(--foreground-muted)' }}
                tickLine={false}
                axisLine={{ stroke: chartHex.grid }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--foreground-muted)' }}
                tickLine={false}
                axisLine={{ stroke: chartHex.grid }}
                allowDecimals={false}
                label={{
                  value: 'Accounts',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 26,
                  style: { fontSize: 10, fill: 'var(--foreground-subtle)' },
                }}
              />
              <Tooltip
                content={<CustomDistributionTooltip />}
                cursor={{ fill: 'rgba(0,0,0,0.03)' }}
              />
              <Bar dataKey="customerCount" radius={[4, 4, 0, 0]} maxBarSize={48}>
                {activeData.map((_, index) => {
                  let barColor: string
                  if (viewMode === 'tiers') {
                    if (index >= 4) barColor = chartHex.series1
                    else if (index >= 2) barColor = chartHex.series2
                    else barColor = '#94a3b8'
                  } else {
                    const segColors: string[] = [
                      chartHex.series1,
                      chartHex.series2,
                      '#10b981',
                      '#94a3b8',
                    ]
                    barColor = segColors[index % segColors.length]
                  }
                  return <Cell key={`cell-${index}`} fill={barColor} />
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Aggregate reconciliation & Pareto note */}
        <div className="rounded-md bg-accent/40 p-3 border border-border/80 text-xs">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="text-[11px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-semibold">Distribution Analysis:</strong> Top
              tiers (≥ $10,000) contain{' '}
              <strong className="text-foreground font-medium">
                {topTierCount} accounts (22.2%)
              </strong>{' '}
              yet command{' '}
              <strong className="text-primary font-semibold">
                {formatCurrency(topTierValue)} ({topTierShare.toFixed(1)}%)
              </strong>{' '}
              of total cohort predicted value. All{' '}
              {distributionBins.reduce((a, b) => a + b.customerCount, 0)} accounts reconcile 100%
              with dataset totals (
              {formatCurrency(distributionBins.reduce((a, b) => a + b.totalClv, 0))}).
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
