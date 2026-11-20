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
import { useChartTheme } from '@/hooks/useChartTheme'
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
    <div className="rounded-lg border border-border bg-popover text-popover-foreground p-3 shadow-lg text-xs min-w-[200px]">
      <div className="font-semibold text-foreground border-b border-border/80 pb-1.5 mb-2 flex items-center justify-between">
        <span>Maturity Lifespan</span>
        <span className="font-mono text-muted-foreground">{label}</span>
      </div>
      <div className="space-y-1.5">
        {payload.map((entry) => {
          if (entry.value === null || entry.value === undefined) return null
          const isObserved = entry.dataKey === 'observedClv'

          return (
            <div key={entry.dataKey} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground text-[11px]">
                  {isObserved ? 'Observed Cumulative' : 'ML Forecast'}
                </span>
              </div>
              <span className="font-mono font-semibold tabular-nums text-foreground">
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
  const chartHex = useChartTheme()
  const lastPoint = data.length > 0 ? data[data.length - 1] : null
  const terminalClv = lastPoint ? formatCurrency(lastPoint.predictedClv) : '$5,890'
  const hasM18 = data.some((d) => d.month === 'M18')

  return (
    <Card className="xl:col-span-2 min-w-0 overflow-hidden flex flex-col justify-between">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 sm:pb-4 border-b border-border gap-2">
        <div>
          <CardTitle>Customer Value Over Time</CardTitle>
          <CardDescription className="mt-0.5">
            Average customer lifetime value growth from initial purchase through projected lifespan.
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Badge variant="neutral" dot className="whitespace-nowrap text-[10px]">
            Observed (M0–M18)
          </Badge>
          <Badge
            variant="outline"
            className="whitespace-nowrap text-[10px] text-muted-foreground font-mono"
          >
            Forecast (M21–M36)
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 sm:pt-6 min-w-0 flex-1 flex flex-col justify-between">
        <div className="h-64 sm:h-72 md:h-80 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={data} margin={{ top: 12, right: 12, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="clvObservedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartHex.series1} stopOpacity={0.16} />
                  <stop offset="95%" stopColor={chartHex.series1} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="clvForecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartHex.series2} stopOpacity={0.1} />
                  <stop offset="95%" stopColor={chartHex.series2} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke={chartHex.grid} vertical={false} />

              <XAxis
                dataKey="month"
                stroke={chartHex.axis}
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: chartHex.grid }}
              />

              <YAxis
                stroke={chartHex.axis}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val: number) =>
                  `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`
                }
              />

              <Tooltip
                content={<CustomTrajectoryTooltip />}
                cursor={{ stroke: chartHex.axisSubtle, strokeDasharray: '3 3' }}
              />

              {hasM18 && (
                <ReferenceLine
                  x="M18"
                  stroke={chartHex.axisSubtle}
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  label={{
                    value: 'Forecast Boundary',
                    position: 'insideTopRight',
                    fill: chartHex.axis,
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

          {/* Accessible Screen Reader Data Table */}
          <div className="sr-only">
            <h4>Accessible Data Table for Cumulative Lifetime Value Trajectory</h4>
            <table>
              <caption className="sr-only">
                Cumulative Lifetime Value trajectory across customer maturity lifespan with observed
                actuals and BG/NBD projection
              </caption>
              <thead>
                <tr>
                  <th scope="col">Maturity Lifespan</th>
                  <th scope="col">Observed Cumulative CLV</th>
                  <th scope="col">ML Forecast CLV</th>
                </tr>
              </thead>
              <tbody>
                {data.map((point) => (
                  <tr key={point.month}>
                    <td>{point.month}</td>
                    <td>{point.observedClv != null ? formatCurrency(point.observedClv) : 'N/A'}</td>
                    <td>
                      {point.predictedClv != null ? formatCurrency(point.predictedClv) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend & Terminal Metric Footer */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/60 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-3 rounded-xs" style={{ backgroundColor: chartHex.series1 }} />
              <span className="font-medium text-foreground/90">Historical Actuals</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="h-0.5 w-3 border-b-2 border-dashed"
                style={{ borderColor: chartHex.series2 }}
              />
              <span className="font-mono text-muted-foreground">BG/NBD Projection</span>
            </span>
          </div>
          <span className="tabular-nums">
            Estimated Terminal CLV:{' '}
            <strong className="text-foreground font-semibold font-mono">
              {terminalClv} / acct
            </strong>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default ClvTrajectoryChart
