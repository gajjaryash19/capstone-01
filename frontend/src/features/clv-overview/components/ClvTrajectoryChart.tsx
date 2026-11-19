import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { designTokens } from '@/styles/tokens'
import { formatCurrency } from '@/lib/formatters'
import type { ClvTrajectoryPoint } from '../types'

interface ClvTrajectoryChartProps {
  data: ClvTrajectoryPoint[]
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number | null
    dataKey: string
    name: string
    color: string
  }>
  label?: string
}

function CustomTrajectoryTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-md text-xs">
      <div className="font-semibold text-foreground border-b border-border/80 pb-1.5 mb-2">
        Cohort Maturity: {label}
      </div>
      <div className="space-y-1.5">
        {payload.map((entry) => {
          if (entry.value === null || entry.value === undefined) return null
          const isObserved = entry.dataKey === 'observedClv'

          return (
            <div key={entry.dataKey} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-muted-foreground text-[11px]">
                  {isObserved ? 'Observed Cumulative CLV' : 'ML Projected Trajectory'}
                </span>
              </div>
              <span className="font-semibold tabular-nums text-foreground">
                {formatCurrency(entry.value)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ClvTrajectoryChart({ data }: ClvTrajectoryChartProps) {
  const chartHex = designTokens.charts.hex
  const lastPoint = data.length > 0 ? data[data.length - 1] : null
  const terminalClv = lastPoint ? formatCurrency(lastPoint.predictedClv) : '$5,890'
  const hasM18 = data.some((d) => d.month === 'M18')

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 sm:pb-4 border-b border-border gap-2">
        <div>
          <CardTitle>CLV Cohort Trajectory & Predictive Horizon</CardTitle>
          <CardDescription className="mt-0.5">
            Cumulative average customer lifetime value across customer maturity lifespan.
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Badge variant="teal" dot className="whitespace-nowrap">
            Observed (M0-M18)
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            ML Forecast (M21-M36)
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 sm:pt-6">
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="clvObservedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartHex.series1} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={chartHex.series1} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="clvForecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartHex.series2} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={chartHex.series2} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke={chartHex.grid} vertical={false} />

              <XAxis
                dataKey="month"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: chartHex.grid }}
              />

              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val: number) =>
                  `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`
                }
              />

              <Tooltip content={<CustomTrajectoryTooltip />} />

              {hasM18 && (
                <ReferenceLine
                  x="M18"
                  stroke="#94a3b8"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  label={{
                    value: 'Demarcation',
                    position: 'insideTopRight',
                    fill: '#64748b',
                    fontSize: 10,
                  }}
                />
              )}

              {/* Forecast Area */}
              <Area
                type="monotone"
                dataKey="predictedClv"
                name="ML Projected Trajectory"
                stroke={chartHex.series2}
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="url(#clvForecastGradient)"
                isAnimationActive={false}
              />

              {/* Observed Area */}
              <Area
                type="monotone"
                dataKey="observedClv"
                name="Observed Cumulative CLV"
                stroke={chartHex.series1}
                strokeWidth={2.5}
                fill="url(#clvObservedGradient)"
                connectNulls={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/60 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-3 rounded-xs" style={{ backgroundColor: chartHex.series1 }} />
              <span>Historical Actuals</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="h-0.5 w-3 border-b-2 border-dashed"
                style={{ borderColor: chartHex.series2 }}
              />
              <span>Predictive Model (BG/NBD)</span>
            </span>
          </div>
          <span className="tabular-nums">
            Estimated Terminal CLV:{' '}
            <strong className="text-foreground font-semibold">{terminalClv} / acct</strong>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
