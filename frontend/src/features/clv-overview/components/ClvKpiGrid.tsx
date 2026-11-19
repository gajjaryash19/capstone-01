import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  Activity,
  ShieldAlert,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { OverviewKpi } from '../types'

interface ClvKpiGridProps {
  kpis: OverviewKpi[]
}

const iconMap = {
  clv: DollarSign,
  revenue: TrendingUp,
  retention: Activity,
  risk: ShieldAlert,
}

export function ClvKpiGrid({ kpis }: ClvKpiGridProps) {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = iconMap[kpi.icon] || DollarSign
        const isPositiveSentiment = kpi.changeType === 'positive'
        const isNegativeNumber = kpi.change.startsWith('-')
        const DirectionIcon = isNegativeNumber ? ArrowDownRight : ArrowUpRight

        return (
          <Card
            key={kpi.id}
            className="p-3.5 sm:p-4.5 flex flex-col justify-between hover:border-border-strong transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 min-h-[2.25rem]">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground leading-snug">
                  {kpi.title}
                </span>
                <div className="rounded-md bg-accent/60 p-1.5 text-primary shrink-0">
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="mt-2 sm:mt-2.5">
                <div className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums text-foreground">
                  {kpi.value}
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center font-semibold tabular-nums text-[11px] ${
                      isPositiveSentiment ? 'text-primary' : 'text-destructive'
                    }`}
                  >
                    <DirectionIcon className="mr-0.5 h-3.5 w-3.5" />
                    {kpi.change}
                  </span>
                  <span className="ml-1 text-[11px] text-muted-foreground truncate">
                    {kpi.period}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-border/60 text-[11px] text-muted-foreground leading-normal truncate">
              {kpi.secondaryContext}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
