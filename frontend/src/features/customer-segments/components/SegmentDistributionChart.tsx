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
import { Users } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { useChartTheme } from '@/hooks/useChartTheme'
import { formatNumber, formatPercent } from '@/lib/formatters'
import type { SegmentMetricRow, CustomerSegment } from '../types'

interface SegmentDistributionChartProps {
  segments: SegmentMetricRow[]
  selectedSegment: CustomerSegment | null
  onSelectSegment: (segment: CustomerSegment | null) => void
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    payload: SegmentMetricRow & { displayCount: number }
  }>
}

function CustomDistributionTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const data = payload[0].payload

  return (
    <div className="rounded-lg border border-border bg-surface-elevated text-foreground p-3 shadow-lg text-xs min-w-44">
      <div className="font-semibold text-foreground border-b border-border/80 pb-1.5 mb-2 flex items-center justify-between">
        <span>{data.name} Cohort</span>
        <span className="font-mono text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
          {formatPercent(data.customerShare)} of base
        </span>
      </div>
      <div className="space-y-1.5 text-muted-foreground text-[11px]">
        <div className="flex justify-between items-center">
          <span>Customer Accounts:</span>
          <strong className="text-foreground font-semibold font-mono tabular-nums">
            {formatNumber(data.customerCount)}
          </strong>
        </div>
        <div className="flex justify-between items-center">
          <span>Total Orders:</span>
          <strong className="text-foreground font-semibold font-mono tabular-nums">
            {formatNumber(data.totalOrders)}
          </strong>
        </div>
        <div className="flex justify-between items-center">
          <span>Avg. Orders / Account:</span>
          <strong className="text-foreground font-semibold font-mono tabular-nums">
            {data.averageOrders}
          </strong>
        </div>
      </div>
    </div>
  )
}

export function SegmentDistributionChart({
  segments,
  selectedSegment,
  onSelectSegment,
}: SegmentDistributionChartProps) {
  const chartHex = useChartTheme()

  const chartData = segments.map((seg) => ({
    ...seg,
    displayCount: seg.customerCount,
  }))

  const segmentColors: Record<CustomerSegment, string> = {
    Enterprise: chartHex.series1,
    'Mid-Market': chartHex.series4,
    Growth: chartHex.series2,
    Standard: chartHex.series3,
  }

  return (
    <Card className="flex flex-col bg-surface border-border">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-foreground/80" />
            <CardTitle className="text-base font-semibold text-foreground">
              Customer Account Distribution
            </CardTitle>
          </div>
          {selectedSegment && (
            <span className="text-[10px] font-mono text-foreground bg-surface-elevated px-2 py-0.5 rounded border border-border">
              Cohort: {selectedSegment}
            </span>
          )}
        </div>
        <CardDescription className="text-xs text-muted-foreground mt-0.5">
          Account volume distribution and relative share across value cohorts.
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
              <Bar dataKey="displayCount" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                {chartData.map((entry) => {
                  const isSelected = selectedSegment === entry.name
                  const isDimmed = selectedSegment !== null && !isSelected
                  return (
                    <Cell
                      key={entry.name}
                      fill={segmentColors[entry.name]}
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
            <h4>Accessible Data Table for Customer Segment Distribution</h4>
            <table>
              <caption className="sr-only">
                Customer account distribution across behavioral cohorts
              </caption>
              <thead>
                <tr>
                  <th scope="col">Segment</th>
                  <th scope="col">Account Count</th>
                  <th scope="col">Share of Base</th>
                </tr>
              </thead>
              <tbody>
                {segments.map((seg) => (
                  <tr key={seg.name}>
                    <td>{seg.name}</td>
                    <td>{formatNumber(seg.customerCount)}</td>
                    <td>{formatPercent(seg.customerShare)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Click any bar to filter and drill down</span>
          <span className="font-mono">Total: 36 Accounts</span>
        </div>
      </CardContent>
    </Card>
  )
}
