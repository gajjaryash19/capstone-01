import { PieChart, ArrowUpRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import type { ValueTierDistribution } from '../types'

interface ValueDistributionChartProps {
  tiers: ValueTierDistribution[]
}

export function ValueDistributionChart({ tiers }: ValueDistributionChartProps) {
  return (
    <Card>
      <CardHeader className="pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <PieChart className="h-4 w-4 text-primary" />
          <CardTitle>Customer Value Concentration</CardTitle>
        </div>
        <CardDescription className="mt-0.5">
          Pareto analysis: Customer base share vs. cumulative revenue contribution.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        {tiers.map((tier) => (
          <div key={tier.tier} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">{tier.label}</span>
              <div className="flex items-center gap-1.5 font-medium tabular-nums">
                <span className="text-primary font-bold">{tier.revenueShare}%</span>
                <span className="text-[10px] text-muted-foreground">of revenue</span>
              </div>
            </div>

            {/* Proportional Comparison: Customer Base Share vs Revenue Share */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  Base: {tier.customerShare}% ({formatNumber(tier.customerCount)} accts)
                </span>
                <span className="flex items-center gap-1 text-primary font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Revenue: {tier.revenueShare}%
                </span>
              </div>

              <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden flex">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${tier.revenueShare}%` }}
                  title={`Revenue share: ${tier.revenueShare}%`}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                <span>Avg Spend: {formatCurrency(tier.avgClv)}</span>
                <span className="tabular-nums font-medium text-foreground">
                  Total: {formatCurrency(tier.totalRevenue)}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div className="rounded-md bg-accent/50 p-3 border border-primary/20 text-xs">
          <div className="flex items-start gap-2">
            <ArrowUpRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="text-[11px] text-muted-foreground">
              <strong className="text-foreground font-semibold">Key Concentration:</strong> Top 20%
              of accounts generate <strong className="text-primary">78%</strong> of total platform
              lifetime revenue ($11.13M).
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
