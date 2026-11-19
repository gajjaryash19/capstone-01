import { useNavigate } from 'react-router-dom'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Layers, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { designTokens } from '@/styles/tokens'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import type { SegmentValueComparisonItem } from '../types'

interface SegmentInsightsSectionProps {
  segmentData: SegmentValueComparisonItem[]
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
    payload: SegmentValueComparisonItem
  }>
}

function CustomSegmentTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const item = payload[0].payload

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-md text-xs min-w-48 space-y-1.5">
      <div className="font-semibold text-foreground border-b border-border/80 pb-1 flex items-center justify-between">
        <span>{item.segment} Tier</span>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
          {item.accountCount} Accounts
        </Badge>
      </div>

      <div className="space-y-1 text-muted-foreground text-[11px]">
        <div className="flex justify-between">
          <span>Headcount Share:</span>
          <strong className="text-foreground font-semibold tabular-nums">
            {formatPercent(item.customerShare)}
          </strong>
        </div>
        <div className="flex justify-between">
          <span>Predicted CLV Share:</span>
          <strong className="text-primary font-semibold tabular-nums">
            {formatPercent(item.clvShare)}
          </strong>
        </div>
        <div className="flex justify-between">
          <span>Total Predicted CLV:</span>
          <strong className="text-foreground font-semibold tabular-nums">
            {formatCurrency(item.totalClv)}
          </strong>
        </div>
        <div className="flex justify-between">
          <span>Average Account CLV:</span>
          <strong className="text-foreground font-semibold tabular-nums">
            {formatCurrency(item.averageClv)}
          </strong>
        </div>
        <div className="flex justify-between">
          <span>Historical Revenue:</span>
          <strong className="text-foreground font-semibold tabular-nums">
            {formatCurrency(item.historicalRevenue)}
          </strong>
        </div>
        <div className="flex justify-between">
          <span>High-Risk Accounts:</span>
          <strong
            className={`${item.highRiskCount > 0 ? 'text-destructive' : 'text-emerald-600'} font-semibold tabular-nums`}
          >
            {item.highRiskCount} account{item.highRiskCount === 1 ? '' : 's'}
          </strong>
        </div>
      </div>
    </div>
  )
}

const SEGMENT_STRATEGY_CARDS = [
  {
    segment: 'Enterprise',
    role: 'Primary Revenue Engine',
    skew: '66.7% CLV from 22.2% accounts',
    opportunity: 'Executive sponsor partnerships and multi-quarter contract expansions.',
    concern:
      'Extreme reliance on top 8 accounts; single account churn creates disproportionate revenue loss.',
    statusVariant: 'teal' as const,
  },
  {
    segment: 'Mid-Market',
    role: 'Expansion Core',
    skew: '22.5% CLV from 22.2% accounts',
    opportunity:
      'Direct upgrade pipeline to Enterprise tier for high-frequency purchasing accounts.',
    concern: '2 key accounts showing >65% churn risk requiring rapid renewal intervention.',
    statusVariant: 'default' as const,
  },
  {
    segment: 'Growth',
    role: 'Adoption Pipeline',
    skew: '8.3% CLV from 25.0% accounts',
    opportunity:
      'High order velocity (avg 15+ orders); ready for annual contract commitment discounts.',
    concern:
      'Transactional fatigue if pricing tiers remain unaligned with rising purchase cadence.',
    statusVariant: 'secondary' as const,
  },
  {
    segment: 'Standard',
    role: 'Long Tail / Self-Serve',
    skew: '2.5% CLV from 30.6% accounts',
    opportunity:
      'Shift to zero-touch self-service support to preserve overall operational margins.',
    concern:
      '36.4% churn rate with $492 average CLV makes human-led retention economically unviable.',
    statusVariant: 'warning' as const,
  },
]

export function SegmentInsightsSection({ segmentData }: SegmentInsightsSectionProps) {
  const navigate = useNavigate()
  const chartHex = designTokens.charts.hex

  const chartData = segmentData.map((d) => ({
    ...d,
    'Account Share (%)': d.customerShare,
    'Predicted CLV Share (%)': d.clvShare,
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <CardTitle>Segment Value Contribution & Skew</CardTitle>
            </div>
            <CardDescription className="mt-0.5">
              Comparison of customer volume versus cumulative lifetime value contribution across
              cohorts.
            </CardDescription>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/segments')}
            className="text-xs h-8 gap-1.5 cursor-pointer self-start sm:self-auto"
            aria-label="View comprehensive segment dashboard"
          >
            Explore All Segments
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-6">
        {/* Pareto Visualization Chart */}
        <div>
          <div className="flex items-center justify-between pb-2 text-xs">
            <span className="font-semibold text-foreground">
              Cohort Volume vs. Predicted CLV Contribution
            </span>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-xs"
                  style={{ backgroundColor: chartHex.series2 }}
                />
                <span>Account Share (%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-xs"
                  style={{ backgroundColor: chartHex.series1 }}
                />
                <span>Predicted CLV Share (%)</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                barCategoryGap="25%"
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartHex.grid} />
                <XAxis
                  dataKey="segment"
                  tickLine={false}
                  axisLine={{ stroke: chartHex.grid }}
                  tick={{ fontSize: 11, fill: 'var(--foreground-muted)' }}
                />
                <YAxis
                  unit="%"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: 'var(--foreground-muted)' }}
                  domain={[0, 80]}
                />
                <Tooltip content={<CustomSegmentTooltip />} />
                <Bar
                  dataKey="Account Share (%)"
                  fill={chartHex.series2}
                  radius={[3, 3, 0, 0]}
                  maxBarSize={40}
                />
                <Bar
                  dataKey="Predicted CLV Share (%)"
                  fill={chartHex.series1}
                  radius={[3, 3, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4 Segment Strategy Cards */}
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 pt-2 border-t border-border/60">
          {SEGMENT_STRATEGY_CARDS.map((card) => {
            const segMetric = segmentData.find((s) => s.segment === card.segment)

            return (
              <div
                key={card.segment}
                className="rounded-lg border border-border/80 bg-muted/20 p-3.5 space-y-2 hover:border-border-strong transition-colors flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{card.segment}</span>
                    <Badge variant={card.statusVariant} className="text-[10px]">
                      {card.role}
                    </Badge>
                  </div>

                  <div className="text-[11px] text-primary font-semibold">{card.skew}</div>

                  {segMetric && (
                    <div className="text-[11px] text-muted-foreground flex justify-between py-1 border-y border-border/40">
                      <span>
                        Avg CLV:{' '}
                        <strong className="text-foreground">
                          {formatCurrency(segMetric.averageClv)}
                        </strong>
                      </span>
                      <span>
                        Total:{' '}
                        <strong className="text-foreground">
                          {formatCurrency(segMetric.totalClv)}
                        </strong>
                      </span>
                    </div>
                  )}

                  <div className="space-y-1.5 text-[11px] pt-1">
                    <div className="text-foreground/90">
                      <strong className="text-emerald-700 block font-medium">Opportunity:</strong>
                      <span className="text-muted-foreground">{card.opportunity}</span>
                    </div>
                    <div className="text-foreground/90">
                      <strong className="text-amber-700 block font-medium">Risk Factor:</strong>
                      <span className="text-muted-foreground">{card.concern}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/segments?segment=${card.segment}`)}
                  className="w-full text-xs h-7 justify-between cursor-pointer mt-2 text-muted-foreground hover:text-foreground"
                  aria-label={`Drill into ${card.segment} segment`}
                >
                  <span>Drill down</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
