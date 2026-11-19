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
      value: `${summary.totalSegments} Cohorts`,
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
      title: 'Largest Segment by Volume',
      value: summary.largestSegment.name,
      context: `${summary.largestSegment.count} accounts (${formatPercent(summary.largestSegment.share)} cohort share)`,
      icon: Users,
      highlight: selectedSegment === summary.largestSegment.name,
    },
    {
      id: 'kpi-churn-exposure',
      title: 'Gross Churn Vulnerability',
      value: `${summary.highRiskSummary.count} Accounts`,
      context: `${formatPercent(summary.highRiskSummary.percentage)} of cohort at high risk (${summary.highRiskSummary.mostVulnerableSegment} largest)`,
      icon: ShieldAlert,
      highlightRisk: true,
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
            className={`p-3.5 sm:p-4 flex flex-col justify-between transition-colors bg-card ${
              card.highlight
                ? 'border-primary/60 ring-1 ring-primary/20'
                : 'hover:border-border-strong'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground leading-snug">
                  {card.title}
                </span>
                <div
                  className={`rounded-md p-1.5 shrink-0 ${
                    card.highlightRisk
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-accent/60 text-primary'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="mt-2">
                <div className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums text-foreground truncate">
                  {card.value}
                </div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-border/60 text-[11px] text-muted-foreground leading-normal truncate">
              {card.context}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
