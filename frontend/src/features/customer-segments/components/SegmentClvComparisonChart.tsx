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
import { Button } from '@/components/ui/Button'
import { useChartTheme } from '@/hooks/useChartTheme'
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
    <div className="rounded-lg border border-border bg-surface-elevated text-foreground p-3 shadow-lg text-xs min-w-52">
      <div className="font-semibold text-foreground border-b border-border/80 pb-1.5 mb-2 flex items-center justify-between">
        <span>{label} Segment</span>
        <span className="font-mono text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
          AOV: {formatCurrency(data.averageOrderValue)}
        </span>
      </div>
      <div className="space-y-1.5 text-muted-foreground text-[11px]">
        {payload.map((item) => (
          <div key={item.name} className="flex justify-between items-center gap-2">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}:
            </span>
            <strong className="text-foreground font-semibold font-mono tabular-nums">
              {formatCurrency(item.value)}
            </strong>
          </div>
        ))}
        <div className="flex justify-between items-center pt-1 border-t border-border/60">
          <span>Total Orders:</span>
          <span className="text-foreground font-mono tabular-nums">{data.totalOrders}</span>
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
  const chartHex = useChartTheme()
  const [mode, setMode] = useState<MetricMode>('average')

  const chartData = segments.map((seg) => ({
    ...seg,
    chartClv: mode === 'average' ? seg.averageClv : seg.totalClv,
    chartRevenue: mode === 'average' ? seg.averageHistoricalRevenue : seg.totalHistoricalRevenue,
  }))

  return (
    <Card className="flex flex-col bg-surface border-border">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-foreground/80" />
            <CardTitle className="text-base font-semibold text-foreground">
              CLV Valuation vs Historical Billing
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Comparison of predicted future customer lifetime valuation against realized revenue.
          </CardDescription>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center rounded-md border border-border bg-muted/30 p-0.5 self-start sm:self-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setMode('average')}
            className={`h-7 px-2.5 text-xs rounded-xs font-medium cursor-pointer ${
              mode === 'average'
                ? 'bg-surface-elevated text-foreground shadow-2xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Average / Acct
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setMode('total')}
            className={`h-7 px-2.5 text-xs rounded-xs font-medium cursor-pointer ${
              mode === 'total'
                ? 'bg-surface-elevated text-foreground shadow-2xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Cohort Total
          </Button>
        </div>
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
                tickFormatter={(val: number) => `$${(val / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11, fill: 'var(--foreground-muted)' }}
                axisLine={false}
                tickLine={false}
                width={45}
              />
              <Tooltip
                content={<CustomClvTooltip />}
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
                dataKey="chartRevenue"
                name={mode === 'average' ? 'Avg Historical Spend' : 'Total Historical Spend'}
                fill={chartHex.series2}
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              >
                {chartData.map((entry) => {
                  const isSelected = selectedSegment === entry.name
                  const isDimmed = selectedSegment !== null && !isSelected
                  return (
                    <Cell
                      key={`spend-${entry.name}`}
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
                dataKey="chartClv"
                name={mode === 'average' ? 'Avg Predicted CLV' : 'Total Predicted CLV'}
                fill={chartHex.series1}
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              >
                {chartData.map((entry) => {
                  const isSelected = selectedSegment === entry.name
                  const isDimmed = selectedSegment !== null && !isSelected
                  return (
                    <Cell
                      key={`clv-${entry.name}`}
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

          {/* Accessible Screen Reader Data Table */}
          <div className="sr-only">
            <h4>Accessible Data Table for Segment Historical Spend vs. Predicted CLV</h4>
            <table>
              <caption className="sr-only">
                Comparison between historical realized spend and predicted forward lifetime value
                across cohorts
              </caption>
              <thead>
                <tr>
                  <th scope="col">Segment</th>
                  <th scope="col">Avg Spend</th>
                  <th scope="col">Avg Predicted CLV</th>
                  <th scope="col">Total Spend</th>
                  <th scope="col">Total Predicted CLV</th>
                </tr>
              </thead>
              <tbody>
                {segments.map((seg) => (
                  <tr key={seg.name}>
                    <td>{seg.name}</td>
                    <td>{formatCurrency(seg.averageHistoricalRevenue)}</td>
                    <td>{formatCurrency(seg.averageClv)}</td>
                    <td>{formatCurrency(seg.totalHistoricalRevenue)}</td>
                    <td>{formatCurrency(seg.totalClv)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Click cohort to inspect details</span>
          <span className="font-mono">12-Month BG/NBD Forecast</span>
        </div>
      </CardContent>
    </Card>
  )
}
