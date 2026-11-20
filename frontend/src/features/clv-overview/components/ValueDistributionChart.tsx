import { ArrowUpRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import type { ValueTierDistribution } from '../types'

interface ValueDistributionChartProps {
  tiers: ValueTierDistribution[]
}

export function ValueDistributionChart({ tiers }: ValueDistributionChartProps) {
  return (
    <Card className="min-w-0 flex flex-col justify-between">
      <CardHeader className="pb-4 border-b border-border">
        <CardTitle>Revenue Concentration</CardTitle>
        <CardDescription className="mt-0.5">
          Share of total revenue generated across customer value tiers.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 sm:pt-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {tiers.map((tier) => (
            <div key={tier.tier} className="space-y-1.5 group">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground tracking-tight">{tier.label}</span>
                <div className="flex items-center gap-1 font-mono tabular-nums">
                  <span className="text-foreground font-semibold text-xs">
                    {tier.revenueShare}%
                  </span>
                  <span className="text-[10px] text-muted-foreground">yield</span>
                </div>
              </div>

              {/* Proportional Comparison: Customer Base Share vs Revenue Share */}
              <div className="space-y-1">
                <div className="relative h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className="h-full bg-foreground/80 rounded-full transition-all duration-300 group-hover:bg-foreground"
                    style={{ width: `${tier.revenueShare}%` }}
                    title={`Revenue share: ${tier.revenueShare}%`}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                  <span className="tabular-nums">
                    Base: {tier.customerShare}% ({formatNumber(tier.customerCount)} accts)
                  </span>
                  <span className="tabular-nums font-mono text-foreground/90 font-medium">
                    {formatCurrency(tier.totalRevenue)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pareto Concentration Summary Callout */}
        <div className="rounded-lg bg-surface-elevated/70 border border-border/80 p-3 text-xs mt-3">
          <div className="flex items-start gap-2">
            <ArrowUpRight className="h-4 w-4 text-foreground/80 shrink-0 mt-0.5" />
            <div className="text-[11px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-semibold">Revenue Concentration:</strong> The
              top 20% of customer accounts generate{' '}
              <strong className="text-foreground font-semibold">78%</strong> of total platform
              lifetime revenue ($11.13M).
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ValueDistributionChart
