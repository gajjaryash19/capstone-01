import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { PieChart, ArrowUpRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { designTokens } from '@/styles/tokens'
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
    <div className="rounded-lg border border-border bg-card p-3 shadow-md text-xs min-w-48">
      <div className="font-semibold text-foreground border-b border-border/80 pb-1.5 mb-2 flex items-center justify-between">
        <span>{data.name} Cohort</span>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
          {formatCurrency(data.totalHistoricalRevenue)}
        </Badge>
      </div>
      <div className="space-y-1.5 text-muted-foreground text-[11px]">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            Customer Base Share:
          </span>
          <strong className="text-foreground font-semibold tabular-nums">
            {formatPercent(data.customerShare)}
          </strong>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Revenue Contribution:
          </span>
          <strong className="text-primary font-bold tabular-nums">
            {formatPercent(data.revenueShare)}
          </strong>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-border/60">
          <span>Avg Revenue / Acct:</span>
          <strong className="text-foreground font-semibold tabular-nums">
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
  const chartHex = designTokens.charts.hex

  const chartData = segments.map((seg) => ({
    ...seg,
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-primary" />
            <CardTitle>Revenue Contribution vs Customer Share</CardTitle>
          </div>
          {selectedSegment && (
            <Badge variant="teal" dot className="text-[10px]">
              Filtered: {selectedSegment}
            </Badge>
          )}
        </div>
        <CardDescription className="mt-0.5">
          Pareto value concentration: Share of customer accounts vs. share of realized revenue.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="h-56 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 10, left: -22, bottom: 0 }}
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
                unit="%"
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
              />
              <Tooltip
                content={<CustomRevenueTooltip />}
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
                dataKey="customerShare"
                name="Customer Share (%)"
                fill="#94a3b8" // Slate-400
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
              <Bar
                dataKey="revenueShare"
                name="Revenue Contribution (%)"
                fill={chartHex.series1} // Teal
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pareto Concentration Callout */}
        <div className="rounded-md bg-accent/40 p-2.5 sm:p-3 border border-primary/20 text-xs">
          <div className="flex items-start gap-2">
            <ArrowUpRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="text-[11px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-semibold">Value Concentration:</strong> The
              Enterprise cohort represents <strong className="text-foreground">22.2%</strong> of
              accounts but generates <strong className="text-primary font-semibold">65.9%</strong>{' '}
              ($116.85K) of total realized revenue.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
