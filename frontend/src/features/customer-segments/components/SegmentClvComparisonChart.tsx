import { useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { designTokens } from '@/styles/tokens'
import { formatCurrency } from '@/lib/formatters'
import type { SegmentMetricRow, CustomerSegment } from '../types'

interface SegmentClvComparisonChartProps {
  segments: SegmentMetricRow[]
  selectedSegment: CustomerSegment | null
  onSelectSegment: (segment: CustomerSegment | null) => void
}

type MetricMode = 'average' | 'total'

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
    payload: SegmentMetricRow
  }>
  label?: string
}

function CustomClvTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const data = payload[0].payload

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-md text-xs min-w-52">
      <div className="font-semibold text-foreground border-b border-border/80 pb-1.5 mb-2 flex items-center justify-between">
        <span>{label} Segment</span>
        <Badge variant="teal" className="text-[10px] px-1.5 py-0">
          AOV: {formatCurrency(data.averageOrderValue)}
        </Badge>
      </div>
      <div className="space-y-1.5 text-muted-foreground text-[11px]">
        {payload.map((item) => (
          <div key={item.name} className="flex justify-between items-center gap-2">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}:
            </span>
            <strong className="text-foreground font-semibold tabular-nums">
              {formatCurrency(item.value)}
            </strong>
          </div>
        ))}
        <div className="flex justify-between items-center pt-1 border-t border-border/60">
          <span>Active Accounts:</span>
          <span className="text-foreground font-medium tabular-nums">{data.customerCount}</span>
        </div>
      </div>
    </div>
  )
}

export function SegmentClvComparisonChart({
  segments,
  selectedSegment,
  onSelectSegment,
}: SegmentClvComparisonChartProps) {
  const [metricMode, setMetricMode] = useState<MetricMode>('average')
  const chartHex = designTokens.charts.hex

  const chartData = segments.map((seg) => ({
    ...seg,
    predictedClv: metricMode === 'average' ? seg.averageClv : seg.totalClv,
    historicalRevenue:
      metricMode === 'average' ? seg.averageHistoricalRevenue : seg.totalHistoricalRevenue,
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <CardTitle>CLV Valuation & Historical Revenue</CardTitle>
          </div>
          <div className="flex items-center gap-1 bg-muted/70 p-0.5 rounded-lg border border-border shrink-0">
            <button
              type="button"
              onClick={() => setMetricMode('average')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                metricMode === 'average'
                  ? 'bg-card text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Average / Account
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('total')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                metricMode === 'total'
                  ? 'bg-card text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Cohort Cumulative
            </button>
          </div>
        </div>
        <CardDescription className="mt-0.5">
          {metricMode === 'average'
            ? 'Average predicted CLV compared against average realized spend per customer account.'
            : 'Aggregate predicted CLV compared against total realized spend for the entire cohort.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 flex-1 flex flex-col justify-between">
        <div className="h-56 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 10, left: -14, bottom: 0 }}
              onClick={(e) => {
                const activeLabel = e?.activeLabel as CustomerSegment | undefined
                if (activeLabel) {
                  onSelectSegment(selectedSegment === activeLabel ? null : activeLabel)
                }
              }}
              className="cursor-pointer"
            >
              <CartesianGrid strokeDasharray="3 3" stroke={chartHex.grid} vertical={false} />
              <XAxis
                dataKey="name"
                interval={0}
                tick={{ fontSize: 10, fill: 'var(--foreground)', fontWeight: 500 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
                tickFormatter={(val) => (val >= 1000 ? `$${Math.round(val / 1000)}k` : `$${val}`)}
              />
              <Tooltip
                content={<CustomClvTooltip />}
                cursor={{ fill: 'var(--muted)', opacity: 0.3 }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }}
                iconType="circle"
                iconSize={8}
              />
              <Bar
                dataKey="predictedClv"
                name={metricMode === 'average' ? 'Avg. Predicted CLV' : 'Total Predicted CLV'}
                fill={chartHex.series1} // Teal
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              >
                {chartData.map((entry) => {
                  const isSelected = selectedSegment === entry.name
                  const isDimmed = selectedSegment !== null && !isSelected
                  return (
                    <Cell
                      key={`clv-cell-${entry.name}`}
                      fill={chartHex.series1}
                      opacity={isDimmed ? 0.35 : 1}
                      stroke={isSelected ? 'var(--foreground)' : 'transparent'}
                      strokeWidth={isSelected ? 1.5 : 0}
                    />
                  )
                })}
              </Bar>
              <Bar
                dataKey="historicalRevenue"
                name={metricMode === 'average' ? 'Avg. Realized Revenue' : 'Total Realized Revenue'}
                fill={chartHex.series2} // Sky blue
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              >
                {chartData.map((entry) => {
                  const isSelected = selectedSegment === entry.name
                  const isDimmed = selectedSegment !== null && !isSelected
                  return (
                    <Cell
                      key={`rev-cell-${entry.name}`}
                      fill={chartHex.series2}
                      opacity={isDimmed ? 0.35 : 1}
                      stroke={isSelected ? 'var(--foreground)' : 'transparent'}
                      strokeWidth={isSelected ? 1.5 : 0}
                    />
                  )
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-3 border-t border-border/70 mt-2">
          <span>
            Metric shown:{' '}
            <strong className="text-foreground">
              {metricMode === 'average' ? 'Mean Value per Customer' : 'Cohort Aggregate Sum'}
            </strong>
          </span>
          <span>Click any cohort bar to filter</span>
        </div>
      </CardContent>
    </Card>
  )
}
