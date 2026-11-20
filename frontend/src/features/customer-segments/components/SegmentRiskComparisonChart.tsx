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
import { ShieldAlert } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { useChartTheme } from '@/hooks/useChartTheme'
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
    <div className="rounded-lg border border-border bg-surface-elevated text-foreground p-3 shadow-lg text-xs min-w-44">
      <div className="font-semibold text-foreground border-b border-border/80 pb-1.5 mb-2 flex items-center justify-between">
        <span>{label} Risk Profile</span>
        <span className="font-mono text-[10px] text-muted-foreground">{total} accounts</span>
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
              <strong className="text-foreground font-semibold font-mono tabular-nums">
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
  const chartHex = useChartTheme()

  const chartData = segments.map((seg) => ({
    name: seg.name,
    low: seg.churnRiskDistribution.low,
    moderate: seg.churnRiskDistribution.moderate,
    high: seg.churnRiskDistribution.high,
    total: seg.customerCount,
  }))

  return (
    <Card className="flex flex-col bg-surface border-border">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-foreground/80" />
            <CardTitle className="text-base font-semibold text-foreground">
              Churn Risk Profile Distribution
            </CardTitle>
          </div>
          {selectedSegment && (
            <span className="text-[10px] font-mono text-foreground bg-surface-elevated px-2 py-0.5 rounded border border-border">
              Cohort: {selectedSegment}
            </span>
          )}
        </div>
        <CardDescription className="text-xs text-muted-foreground mt-0.5">
          Proportion of accounts categorized into Low, Moderate, and High churn vulnerability.
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
                content={<CustomRiskTooltip />}
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
                dataKey="low"
                name="Low Risk"
                fill={chartHex.series3}
                stackId="risk"
                radius={[0, 0, 0, 0]}
                isAnimationActive={false}
              >
                {chartData.map((entry) => {
                  const isSelected = selectedSegment === entry.name
                  const isDimmed = selectedSegment !== null && !isSelected
                  return (
                    <Cell
                      key={`low-${entry.name}`}
                      fill={chartHex.series3}
                      opacity={isDimmed ? 0.35 : 1}
                      onClick={() =>
                        onSelectSegment(isSelected ? null : (entry.name as CustomerSegment))
                      }
                      className="cursor-pointer transition-opacity"
                    />
                  )
                })}
              </Bar>
              <Bar
                dataKey="moderate"
                name="Moderate Risk"
                fill={chartHex.warning}
                stackId="risk"
                radius={[0, 0, 0, 0]}
                isAnimationActive={false}
              >
                {chartData.map((entry) => {
                  const isSelected = selectedSegment === entry.name
                  const isDimmed = selectedSegment !== null && !isSelected
                  return (
                    <Cell
                      key={`mod-${entry.name}`}
                      fill={chartHex.warning}
                      opacity={isDimmed ? 0.35 : 1}
                      onClick={() =>
                        onSelectSegment(isSelected ? null : (entry.name as CustomerSegment))
                      }
                      className="cursor-pointer transition-opacity"
                    />
                  )
                })}
              </Bar>
              <Bar
                dataKey="high"
                name="High Risk"
                fill={chartHex.negative}
                stackId="risk"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              >
                {chartData.map((entry) => {
                  const isSelected = selectedSegment === entry.name
                  const isDimmed = selectedSegment !== null && !isSelected
                  return (
                    <Cell
                      key={`high-${entry.name}`}
                      fill={chartHex.negative}
                      opacity={isDimmed ? 0.35 : 1}
                      onClick={() =>
                        onSelectSegment(isSelected ? null : (entry.name as CustomerSegment))
                      }
                      className="cursor-pointer transition-opacity"
                    />
                  )
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>High risk flags &gt;65% predicted inactivity propensity</span>
          <span className="font-mono">8 Total High-Risk Accts</span>
        </div>
      </CardContent>
    </Card>
  )
}
