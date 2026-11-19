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
import { Badge } from '@/components/ui/Badge'
import { designTokens } from '@/styles/tokens'
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
    <div className="rounded-lg border border-border bg-card p-3 shadow-md text-xs min-w-44">
      <div className="font-semibold text-foreground border-b border-border/80 pb-1.5 mb-2 flex items-center justify-between">
        <span>{data.name}</span>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
          {data.customerShare}% of base
        </Badge>
      </div>
      <div className="space-y-1 text-muted-foreground text-[11px]">
        <div className="flex justify-between">
          <span>Customer Accounts:</span>
          <strong className="text-foreground font-semibold tabular-nums">
            {formatNumber(data.customerCount)}
          </strong>
        </div>
        <div className="flex justify-between">
          <span>Total Orders:</span>
          <strong className="text-foreground font-semibold tabular-nums">
            {formatNumber(data.totalOrders)}
          </strong>
        </div>
        <div className="flex justify-between">
          <span>Avg. Orders / Account:</span>
          <strong className="text-foreground font-semibold tabular-nums">
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
  const chartHex = designTokens.charts.hex

  const chartData = segments.map((seg) => ({
    ...seg,
    displayCount: seg.customerCount,
  }))

  const segmentColors: Record<CustomerSegment, string> = {
    Enterprise: chartHex.series1, // Teal
    'Mid-Market': chartHex.series2, // Sky
    Growth: chartHex.series3, // Indigo
    Standard: chartHex.series4, // Amber
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <CardTitle>Customer Distribution</CardTitle>
          </div>
          {selectedSegment && (
            <Badge variant="teal" dot className="text-[10px]">
              Filtered: {selectedSegment}
            </Badge>
          )}
        </div>
        <CardDescription className="mt-0.5">
          Account volume and proportion of evaluated customer base.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 flex-1 flex flex-col justify-between">
        <div className="h-56 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 10, left: -24, bottom: 0 }}
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
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomDistributionTooltip />}
                cursor={{ fill: 'var(--muted)', opacity: 0.3 }}
              />
              <Bar
                dataKey="displayCount"
                name="Customers"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              >
                {chartData.map((entry) => {
                  const isSelected = selectedSegment === entry.name
                  const isDimmed = selectedSegment !== null && !isSelected
                  const baseColor = segmentColors[entry.name]

                  return (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={baseColor}
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

        {/* Legend / Metrics summary row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-border/70 mt-2">
          {segments.map((seg) => {
            const isSelected = selectedSegment === seg.name
            return (
              <button
                key={seg.name}
                type="button"
                onClick={() => onSelectSegment(isSelected ? null : seg.name)}
                className={`flex flex-col p-2 rounded-md text-left transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-muted/80 border-primary/50'
                    : 'hover:bg-muted/40 border-transparent'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground truncate">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: segmentColors[seg.name] }}
                  />
                  <span className="truncate">{seg.name}</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xs font-bold tabular-nums text-foreground">
                    {seg.customerCount}
                  </span>
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {formatPercent(seg.customerShare)}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
