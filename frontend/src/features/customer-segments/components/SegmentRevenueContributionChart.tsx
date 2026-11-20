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
import { PieChart } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { useChartTheme } from '@/hooks/useChartTheme'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import type { SegmentMetricRow, CustomerSegment } from '../types'

interface SegmentRevenueContributionChartProps {
  segments: SegmentMetricRow[]
  selectedSegment: CustomerSegment | null
  onSelectSegment: (segment: CustomerSegment | null) => void
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
    payload: SegmentMetricRow
  }>
}

function CustomRevenueTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const data = payload[0].payload

  return (
    <div className="rounded-lg border border-border bg-surface-elevated text-foreground p-3 shadow-lg text-xs min-w-48">
      <div className="font-semibold text-foreground border-b border-border/80 pb-1.5 mb-2 flex items-center justify-between">
        <span>{data.name} Cohort</span>
        <span className="font-mono text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
          {formatCurrency(data.totalHistoricalRevenue)}
        </span>
      </div>
      <div className="space-y-1.5 text-muted-foreground text-[11px]">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-foreground/40" />
            Customer Base Share:
          </span>
          <strong className="text-foreground font-semibold font-mono tabular-nums">
            {formatPercent(data.customerShare)}
          </strong>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-foreground" />
            Revenue Contribution:
          </span>
          <strong className="text-foreground font-bold font-mono tabular-nums">
            {formatPercent(data.revenueShare)}
          </strong>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-border/60">
          <span>Avg Revenue / Acct:</span>
          <strong className="text-foreground font-semibold font-mono tabular-nums">
            {formatCurrency(data.averageHistoricalRevenue)}
          </strong>
        </div>
      </div>
    </div>
  )
}

export function SegmentRevenueContributionChart({
  segments,
  selectedSegment,
  onSelectSegment,
}: SegmentRevenueContributionChartProps) {
  const chartHex = useChartTheme()

  const chartData = segments.map((seg) => ({
    ...seg,
  }))

  return (
    <Card className="flex flex-col bg-surface border-border">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-foreground/80" />
            <CardTitle className="text-base font-semibold text-foreground">
              Revenue Share vs Account Share
            </CardTitle>
          </div>
          {selectedSegment && (
            <span className="text-[10px] font-mono text-foreground bg-surface-elevated px-2 py-0.5 rounded border border-border">
              Cohort: {selectedSegment}
            </span>
          )}
        </div>
        <CardDescription className="text-xs text-muted-foreground mt-0.5">
          Pareto comparison of cohort volume against historical billing revenue realization.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-5 flex-1 flex flex-col justify-between">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartHex.grid} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: 'var(--foreground-muted)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(val: number) => `${val}%`}
                tick={{ fontSize: 11, fill: 'var(--foreground-muted)' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                content={<CustomRevenueTooltip />}
                cursor={{ fill: chartHex.cursor, stroke: 'none' }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', paddingBottom: '12px' }}
              />
              <Bar
                dataKey="customerShare"
                name="Account Share (%)"
                fill={chartHex.series2}
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              >
                {chartData.map((entry) => {
                  const isSelected = selectedSegment === entry.name
                  const isDimmed = selectedSegment !== null && !isSelected
                  return (
                    <Cell
                      key={`share-${entry.name}`}
                      fill={chartHex.series2}
                      opacity={isDimmed ? 0.35 : 1}
                      stroke={isSelected ? 'var(--foreground)' : 'var(--border)'}
                      strokeWidth={isSelected ? 1.5 : 0.5}
                      onClick={() => onSelectSegment(isSelected ? null : entry.name)}
                      className="cursor-pointer transition-opacity"
                    />
                  )
                })}
              </Bar>
              <Bar
                dataKey="revenueShare"
                name="Revenue Share (%)"
                fill={chartHex.series1}
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              >
                {chartData.map((entry) => {
                  const isSelected = selectedSegment === entry.name
                  const isDimmed = selectedSegment !== null && !isSelected
                  return (
                    <Cell
                      key={`rev-${entry.name}`}
                      fill={chartHex.series1}
                      opacity={isDimmed ? 0.35 : 1}
                      stroke={isSelected ? 'var(--foreground)' : 'var(--border)'}
                      strokeWidth={isSelected ? 1.5 : 0.5}
                      onClick={() => onSelectSegment(isSelected ? null : entry.name)}
                      className="cursor-pointer transition-opacity"
                    />
                  )
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Enterprise represents 22.2% of accounts but 65.9% of historical revenue</span>
          <span className="font-mono">Pareto Metric: Nominal</span>
        </div>
      </CardContent>
    </Card>
  )
}
