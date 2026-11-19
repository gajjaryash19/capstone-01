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
import { ShieldAlert } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { designTokens } from '@/styles/tokens'
import { formatPercent } from '@/lib/formatters'
import type { SegmentMetricRow, CustomerSegment } from '../types'

interface SegmentRiskComparisonChartProps {
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
    dataKey: string
  }>
  label?: string
}

function CustomRiskTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const total = payload.reduce((acc, curr) => acc + (curr.value || 0), 0)

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-md text-xs min-w-44">
      <div className="font-semibold text-foreground border-b border-border/80 pb-1.5 mb-2 flex items-center justify-between">
        <span>{label} Risk Profile</span>
        <span className="text-[10px] text-muted-foreground">{total} accounts</span>
      </div>
      <div className="space-y-1.5 text-muted-foreground text-[11px]">
        {payload.map((entry) => {
          const pct = total > 0 ? ((entry.value / total) * 100).toFixed(0) : '0'
          return (
            <div key={entry.dataKey} className="flex justify-between items-center gap-2">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <strong className="text-foreground font-semibold tabular-nums">
                {entry.value} accts ({pct}%)
              </strong>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function SegmentRiskComparisonChart({
  segments,
  selectedSegment,
  onSelectSegment,
}: SegmentRiskComparisonChartProps) {
  const chartHex = designTokens.charts.hex

  const chartData = segments.map((seg) => ({
    name: seg.name,
    low: seg.churnRiskDistribution.low,
    moderate: seg.churnRiskDistribution.moderate,
    high: seg.churnRiskDistribution.high,
    total: seg.customerCount,
    highRiskPct: seg.highRiskPercentage,
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-destructive" />
            <CardTitle>Churn Risk Distribution by Segment</CardTitle>
          </div>
          {selectedSegment && (
            <Badge variant="teal" dot className="text-[10px]">
              Filtered: {selectedSegment}
            </Badge>
          )}
        </div>
        <CardDescription className="mt-0.5">
          Proportion of customer accounts classified into Low, Moderate, and High churn risk tiers.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 flex-1 flex flex-col justify-between space-y-3">
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
                content={<CustomRiskTooltip />}
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
                dataKey="low"
                name="Low Risk"
                stackId="risk"
                fill="#10b981"
                radius={[0, 0, 0, 0]}
                isAnimationActive={false}
              />
              <Bar
                dataKey="moderate"
                name="Moderate Risk"
                stackId="risk"
                fill="#f59e0b"
                radius={[0, 0, 0, 0]}
                isAnimationActive={false}
              />
              <Bar
                dataKey="high"
                name="High Risk"
                stackId="risk"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Profile Insights Callout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/70 text-xs">
          {segments.map((seg) => (
            <div
              key={seg.name}
              className={`p-2 rounded-md border text-[11px] ${
                selectedSegment === seg.name
                  ? 'bg-muted/70 border-primary/50'
                  : 'bg-muted/20 border-border/60'
              }`}
            >
              <div className="text-muted-foreground truncate">{seg.name}</div>
              <div className="font-semibold text-foreground flex items-center justify-between mt-0.5">
                <span>{seg.churnRiskDistribution.high} High Risk</span>
                <span
                  className={
                    seg.highRiskPercentage > 30
                      ? 'text-destructive font-bold'
                      : 'text-muted-foreground'
                  }
                >
                  {formatPercent(seg.highRiskPercentage, 0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
