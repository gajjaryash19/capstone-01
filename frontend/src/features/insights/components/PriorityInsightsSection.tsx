import { useNavigate } from 'react-router-dom'
import { Sparkles, AlertTriangle, ArrowRight, TrendingUp, FileSearch } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BusinessInsight } from '../types'

interface PriorityInsightsSectionProps {
  insights: BusinessInsight[]
  onInspectRule: (insight: BusinessInsight) => void
}

const priorityBadgeConfig = {
  high: { variant: 'destructive' as const, label: 'High Priority' },
  medium: { variant: 'warning' as const, label: 'Medium Priority' },
  low: { variant: 'outline' as const, label: 'Low Priority' },
}

export function PriorityInsightsSection({ insights, onInspectRule }: PriorityInsightsSectionProps) {
  const navigate = useNavigate()

  const handleActionClick = (href: string) => {
    navigate(href)
  }

  return (
    <section aria-labelledby="priority-insights-title" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div>
          <h2
            id="priority-insights-title"
            className="text-base font-semibold text-foreground flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4 text-foreground" />
            <span>Top Priority Insights</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Key findings ranked by business importance and estimated revenue impact.
          </p>
        </div>
      </div>

      {insights.length === 0 ? (
        <Card className="p-8 text-center text-xs text-muted-foreground bg-surface border-border">
          No insights match your selected category, priority, or search term.
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1">
          {insights.map((insight) => {
            const priorityConfig = priorityBadgeConfig[insight.priority]

            return (
              <Card
                key={insight.id}
                className="overflow-hidden border-border hover:border-border-strong transition-all bg-surface shadow-2xs"
              >
                {/* Top header row */}
                <div className="p-4 sm:p-5 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-surface-elevated/40">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={priorityConfig.variant} dot className="text-[11px]">
                      {priorityConfig.label}
                    </Badge>
                    <span className="text-[10px] uppercase font-mono font-medium px-2 py-0.5 rounded border border-border bg-surface-elevated text-foreground/80">
                      {insight.category}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {insight.segment}
                    </Badge>
                    <span className="text-[11px] font-mono text-muted-foreground/80 pl-1">
                      {insight.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="text-[11px] text-muted-foreground font-medium">Impact:</span>
                    <span className="text-xs font-semibold text-foreground font-mono tabular-nums">
                      {insight.impactEstimate}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-4">
                  {/* Title and Observation */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground leading-snug">
                      {insight.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {insight.supportingObservation}
                    </p>
                  </div>

                  {/* Key Supporting Metric Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {insight.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="rounded-md border border-border bg-surface-elevated/40 p-2.5 text-xs flex flex-col justify-between"
                      >
                        <span className="text-[10px] text-muted-foreground font-medium uppercase font-mono tracking-wider block">
                          {metric.label}
                        </span>
                        <span className="text-xs font-semibold text-foreground font-mono mt-0.5 tabular-nums">
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Business Implication & Suggested Action */}
                  <div className="grid gap-3 grid-cols-1 md:grid-cols-2 pt-1 text-xs">
                    <div className="rounded-md border border-border/80 bg-surface-elevated/30 p-3 space-y-1">
                      <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                        Business Implication
                      </span>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {insight.businessImplication}
                      </p>
                    </div>

                    <div className="rounded-md border border-border/80 bg-surface-elevated/60 p-3 space-y-1">
                      <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-foreground" />
                        Suggested Action
                      </span>
                      <p className="text-[11px] text-foreground/80 leading-relaxed">
                        {insight.suggestedAction}
                      </p>
                    </div>
                  </div>

                  {/* Action and Rule Provenance Footer */}
                  <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] font-mono text-muted-foreground bg-surface"
                      >
                        Rule: {insight.ruleName}
                      </Badge>
                      <button
                        onClick={() => onInspectRule(insight)}
                        className="text-[11px] text-muted-foreground hover:text-foreground hover:underline font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
                        aria-label={`View mathematical rule audit for ${insight.title}`}
                      >
                        <FileSearch className="h-3 w-3" />
                        <span>View formula & rule details</span>
                      </button>
                    </div>

                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleActionClick(insight.actionHref)}
                      className="gap-1.5 text-xs h-8 cursor-pointer w-full sm:w-auto font-medium"
                      aria-label={insight.actionLabel}
                    >
                      <span>{insight.actionLabel}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </section>
  )
}
