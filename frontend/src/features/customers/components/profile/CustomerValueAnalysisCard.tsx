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
import { useChartTheme } from '@/hooks/useChartTheme'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { calculateSegmentAnalytics } from '@/features/customer-segments/segmentAnalytics'
import { MOCK_CUSTOMERS, calculateCustomerKpis } from '../../mockData'
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
    <div className="rounded-lg border border-border bg-surface-elevated text-foreground p-3 shadow-lg text-xs min-w-[210px]">
      <div className="font-semibold text-foreground border-b border-border/80 pb-1.5 mb-1.5">
        {data.category}
      </div>
      <div className="text-base font-bold font-mono text-foreground tabular-nums">
        {formatCurrency(data.amount)}
      </div>
      <div className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
        {data.description}
      </div>
    </div>
  )
}

export function CustomerValueAnalysisCard({ customer }: CustomerValueAnalysisCardProps) {
  const chartHex = useChartTheme()
  const isMobile = useMediaQuery('(max-width: 640px)')

  // Calculate segment and cohort benchmarks deterministically
  const segmentData = calculateSegmentAnalytics(MOCK_CUSTOMERS)
  const currentSegmentStats = segmentData.segments.find((s) => s.name === customer.segment)
  const segmentAvgClv = currentSegmentStats?.averageClv ?? 0

  const cohortKpis = calculateCustomerKpis(MOCK_CUSTOMERS)
  const cohortAvgClv = cohortKpis.averageClv

  const futureProjected = Math.max(0, customer.predictedClv - customer.historicalRevenue)
  const realizedShare =
    customer.predictedClv > 0
      ? Math.min(100, Math.round((customer.historicalRevenue / customer.predictedClv) * 100))
      : 100
  const futureShare = Math.max(0, 100 - realizedShare)

  // Segment comparison delta
  const segmentDeltaPct =
    segmentAvgClv > 0
      ? Number((((customer.predictedClv - segmentAvgClv) / segmentAvgClv) * 100).toFixed(1))
      : 0
  const isAboveSegment = segmentDeltaPct >= 0

  // Cohort comparison delta
  const cohortDeltaPct =
    cohortAvgClv > 0
      ? Number((((customer.predictedClv - cohortAvgClv) / cohortAvgClv) * 100).toFixed(1))
      : 0

  const chartData = [
    {
      category: 'Realized Revenue',
      shortCategory: 'Realized',
      amount: customer.historicalRevenue,
      color: chartHex.series4,
      description: 'Past revenue collected from this customer.',
    },
    {
      category: 'Projected Future',
      shortCategory: 'Future',
      amount: futureProjected,
      color: chartHex.series2,
      description: 'Expected future spend over the next 12 months.',
    },
    {
      category: 'Predicted CLV',
      shortCategory: 'Predicted',
      amount: customer.predictedClv,
      color: chartHex.series1,
      description: 'Total predicted value over the customer lifespan.',
    },
    {
      category: `${customer.segment} Avg`,
      shortCategory: 'Segment',
      amount: segmentAvgClv,
      color: chartHex.series3,
      description: `Average predicted value for ${customer.segment} accounts.`,
    },
    {
      category: 'Cohort Baseline',
      shortCategory: 'Cohort',
      amount: cohortAvgClv,
      color: chartHex.grid,
      description: 'Average predicted value across all customers.',
    },
  ]

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-foreground/80" />
          <CardTitle className="text-base font-semibold text-foreground">
            Customer Value & Benchmarks
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Past revenue and future expected value compared against segment averages.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        {/* Proportional Realization Bar */}
        <div className="space-y-2 rounded-lg border border-border bg-surface-elevated/60 p-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
              Value Realization Split
            </span>
            <span className="text-muted-foreground tabular-nums font-mono text-[11px]">
              <strong className="text-foreground">{formatPercent(realizedShare, 0)}</strong>{' '}
              realized •{' '}
              <strong className="text-foreground">{formatPercent(futureShare, 0)}</strong> future
            </span>
          </div>

          <div className="relative h-2.5 w-full rounded-full bg-muted overflow-hidden flex">
            <div
              className="h-full bg-foreground/70 rounded-l-full transition-all duration-300"
              style={{ width: `${realizedShare}%` }}
              title={`Realized Revenue: ${formatCurrency(customer.historicalRevenue)} (${realizedShare}%)`}
            />
            <div
              className="h-full bg-foreground/20 rounded-r-full transition-all duration-300"
              style={{ width: `${futureShare}%` }}
              title={`Projected Future Value: ${formatCurrency(futureProjected)} (${futureShare}%)`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground pt-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-foreground/70" />
              <span>Past Revenue:</span>
              <strong className="text-foreground tabular-nums font-mono">
                {formatCurrency(customer.historicalRevenue)}
              </strong>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-foreground/20" />
              <span>Expected Future Spend:</span>
              <strong className="text-foreground tabular-nums font-mono">
                {formatCurrency(futureProjected)}
              </strong>
            </div>
          </div>
        </div>

        {/* Recharts Value Comparison Chart */}
        <div className="h-60 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartHex.grid} />
              <XAxis
                dataKey={isMobile ? 'shortCategory' : 'category'}
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
                content={<ValueTooltip />}
                cursor={{ fill: chartHex.cursor, stroke: 'none' }}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="var(--border)"
                    strokeWidth={0.5}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Analytical Benchmark Context Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-md border border-border/70 bg-surface-elevated/40 p-3 space-y-1">
            <span className="text-[11px] uppercase font-semibold text-muted-foreground tracking-wider">
              Segment Comparison
            </span>
            <div className="font-mono text-sm font-semibold text-foreground">
              {isAboveSegment ? '+' : ''}
              {segmentDeltaPct}% vs {customer.segment} Mean
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal">
              {customer.name}&apos;s predicted CLV of {formatCurrency(customer.predictedClv)}{' '}
              compares to the {customer.segment} segment average of {formatCurrency(segmentAvgClv)}.
            </p>
          </div>

          <div className="rounded-md border border-border/70 bg-surface-elevated/40 p-3 space-y-1">
            <span className="text-[11px] uppercase font-semibold text-muted-foreground tracking-wider">
              Customer Average Comparison
            </span>
            <div className="font-mono text-sm font-semibold text-foreground">
              {cohortDeltaPct >= 0 ? '+' : ''}
              {cohortDeltaPct}% vs Portfolio Baseline
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal">
              Average across all 36 sample customer accounts is {formatCurrency(cohortAvgClv)}.
            </p>
          </div>
        </div>

        {/* Statistical Notice */}
        <div className="flex items-start gap-2.5 rounded-md bg-muted/30 border border-border/80 p-3 text-xs text-muted-foreground">
          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed text-[11px]">
            <p className="font-medium text-foreground">About this CLV Estimate</p>
            <p>
              Predicted customer value is an estimate based on purchase recency, order frequency,
              and spend history (BG/NBD and Gamma-Gamma models). It shows projected value, not
              guaranteed contractual revenue.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
