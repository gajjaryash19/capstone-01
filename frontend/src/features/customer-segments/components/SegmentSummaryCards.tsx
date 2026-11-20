import { Layers, Award, Users, ShieldAlert } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters'
import type { SegmentationSummary, CustomerSegment } from '../types'

interface SegmentSummaryCardsProps {
  summary: SegmentationSummary
  selectedSegment?: CustomerSegment | null
}

export function SegmentSummaryCards({ summary, selectedSegment }: SegmentSummaryCardsProps) {
  const cards = [
    {
      id: 'kpi-segments-count',
      title: 'Active Segments',
      value: `${summary.totalSegments} Segments`,
      context: `${formatNumber(summary.totalCustomers)} accounts evaluated (${formatCurrency(summary.totalRevenue)} historical revenue)`,
      icon: Layers,
      highlight: false,
    },
    {
      id: 'kpi-highest-value',
      title: 'Highest-Value Segment',
      value: summary.highestValueSegment.name,
      context: `${formatCurrency(summary.highestValueSegment.avgClv)} avg CLV • ${formatPercent(summary.highestValueSegment.revenueShare)} revenue share`,
      icon: Award,
      highlight: selectedSegment === summary.highestValueSegment.name,
    },
    {
      id: 'kpi-largest-cohort',
      title: 'Largest Segment',
      value: summary.largestSegment.name,
      context: `${summary.largestSegment.count} accounts (${formatPercent(summary.largestSegment.share)} of total customers)`,
      icon: Users,
      highlight: selectedSegment === summary.largestSegment.name,
    },
    {
      id: 'kpi-churn-exposure',
      title: 'At-Risk Accounts',
      value: `${summary.highRiskSummary.count} Accounts`,
      context: `${formatPercent(summary.highRiskSummary.percentage)} of customers at high risk (${summary.highRiskSummary.mostVulnerableSegment} largest)`,
      icon: ShieldAlert,
      isRisk: true,
      highlight: selectedSegment === summary.highRiskSummary.mostVulnerableSegment,
    },
  ]

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card
            key={card.id}
            className={`p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-200 ease-out bg-surface border-border ${
              card.highlight
                ? 'border-border-strong bg-surface-elevated/70'
                : 'hover:border-border-strong hover:bg-surface-elevated/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground leading-snug">
                  {card.title}
                </span>
                <div className="rounded-md p-1.5 shrink-0 bg-surface-elevated text-muted-foreground border border-border/60">
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="mt-2.5">
                <div
                  className={`text-xl sm:text-2xl font-bold tracking-tight font-mono tabular-nums ${
                    card.isRisk ? 'text-red-400' : 'text-foreground'
                  }`}
                >
                  {card.value}
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-border/60 text-[11px] text-muted-foreground leading-normal truncate">
              {card.context}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
