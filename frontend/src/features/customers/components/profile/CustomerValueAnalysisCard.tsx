import { BarChart3, Info, CheckCircle2 } from 'lucide-react'
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import { designTokens } from '@/styles/tokens'
import type { CustomerRecord } from '../../types'

interface CustomerValueAnalysisCardProps {
  customer: CustomerRecord
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: {
      category: string
      amount: number
      description: string
    }
  }>
}

function ValueTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const data = payload[0].payload

  return (
    <div className="rounded-lg border border-border bg-card p-2.5 shadow-md text-xs">
      <div className="font-semibold text-foreground">{data.category}</div>
      <div className="text-sm font-bold text-primary tabular-nums mt-0.5">
        {formatCurrency(data.amount)}
      </div>
      <div className="text-[11px] text-muted-foreground mt-1 max-w-[200px]">{data.description}</div>
    </div>
  )
}

export function CustomerValueAnalysisCard({ customer }: CustomerValueAnalysisCardProps) {
  const futureProjected = Math.max(0, customer.predictedClv - customer.historicalRevenue)
  const realizedShare =
    customer.predictedClv > 0
      ? Math.min(100, Math.round((customer.historicalRevenue / customer.predictedClv) * 100))
      : 100
  const futureShare = Math.max(0, 100 - realizedShare)

  const chartData = [
    {
      category: 'Realized Revenue',
      amount: customer.historicalRevenue,
      color: designTokens.charts.hex.series2, // Sky-600
      description: 'Historical billing revenue collected to date.',
    },
    {
      category: 'Projected Future Value',
      amount: futureProjected,
      color: designTokens.charts.hex.series1, // Teal-600
      description: 'Expected future value increment based on BG/NBD probability.',
    },
    {
      category: 'Total Predicted CLV',
      amount: customer.predictedClv,
      color: designTokens.charts.hex.series3, // Indigo-500
      description: 'Aggregate projected customer lifetime valuation.',
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <CardTitle>Customer Value Analysis</CardTitle>
        </div>
        <CardDescription>
          Comparison of realized historical revenue vs. projected future customer valuation.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        {/* Proportional Realization Bar */}
        <div className="space-y-2 rounded-lg border border-border/70 bg-muted/20 p-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-sky-600" />
              LTV Value Realization Split
            </span>
            <span className="text-muted-foreground tabular-nums">
              <strong className="text-foreground">{formatPercent(realizedShare, 0)}</strong>{' '}
              realized •{' '}
              <strong className="text-foreground">{formatPercent(futureShare, 0)}</strong> future
            </span>
          </div>

          <div className="relative h-3 w-full rounded-full bg-muted overflow-hidden flex">
            <div
              className="h-full bg-sky-600 rounded-l-full transition-all duration-300"
              style={{ width: `${realizedShare}%` }}
              title={`Realized Revenue: ${formatCurrency(customer.historicalRevenue)} (${realizedShare}%)`}
            />
            <div
              className="h-full bg-primary rounded-r-full transition-all duration-300"
              style={{ width: `${futureShare}%` }}
              title={`Projected Future Value: ${formatCurrency(futureProjected)} (${futureShare}%)`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground pt-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-sky-600" />
              <span>Historical Realized:</span>
              <strong className="text-foreground tabular-nums">
                {formatCurrency(customer.historicalRevenue)}
              </strong>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>Projected Future Increment:</span>
              <strong className="text-foreground tabular-nums">
                {formatCurrency(futureProjected)}
              </strong>
            </div>
          </div>
        </div>

        {/* Recharts Value Comparison Chart */}
        <div className="h-56 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={designTokens.charts.hex.grid}
              />
              <XAxis
                dataKey="category"
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
              <Tooltip content={<ValueTooltip />} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Disclaimer / Model Guidance Notice */}
        <div className="flex items-start gap-2.5 rounded-md bg-muted/40 border border-border/80 p-3 text-xs text-muted-foreground">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed text-[11px]">
            <p className="font-medium text-foreground">Statistical Projection Notice</p>
            <p>
              Predicted Customer Lifetime Value is a statistical estimate calculated using BG/NBD
              transaction recency and Gamma-Gamma monetary distribution models. It does not
              represent guaranteed contractual receivables.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
