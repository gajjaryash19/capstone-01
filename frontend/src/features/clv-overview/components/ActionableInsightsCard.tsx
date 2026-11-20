import { useState } from 'react'
import { AlertCircle, ArrowUpRight, CheckCircle2, Check, Sparkles } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { ActionableInsight } from '../types'

interface ActionableInsightsCardProps {
  insights: ActionableInsight[]
}

const severityBadgeMap = {
  critical: { variant: 'destructive' as const, label: 'CRITICAL RISK' },
  elevated: { variant: 'warning' as const, label: 'OPTIMIZATION' },
  positive: { variant: 'neutral' as const, label: 'EXPANSION' },
}

const typeIconMap = {
  risk: AlertCircle,
  opportunity: ArrowUpRight,
  optimization: CheckCircle2,
}

export function ActionableInsightsCard({ insights }: ActionableInsightsCardProps) {
  const [queuedIds, setQueuedIds] = useState<Set<string>>(new Set())

  const handleToggleQueue = (id: string) => {
    setQueuedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <Card className="min-w-0 flex flex-col">
      <CardHeader className="pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle>Recommended Actions</CardTitle>
          <Badge variant="neutral" className="font-mono text-[10px]">
            {insights.length} Action{insights.length === 1 ? '' : 's'}
          </Badge>
        </div>
        <CardDescription className="mt-0.5">
          Key opportunities and risks that need your attention.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 space-y-2.5 overflow-y-auto max-h-[295px]">
        {insights.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-1.5">
            <Sparkles className="h-6 w-6 text-muted-foreground/40 mb-1" />
            <p className="font-medium text-foreground">No recommendations for this filter.</p>
            <span className="text-[11px]">Select another segment to view recommendations.</span>
          </div>
        ) : (
          insights.map((item) => {
            const badgeConfig = severityBadgeMap[item.severity]
            const Icon = typeIconMap[item.type] || Sparkles
            const isQueued = queuedIds.has(item.id)

            return (
              <div
                key={item.id}
                className="rounded-lg border border-border/80 bg-surface-elevated/40 p-3 space-y-2 hover:border-border-strong hover:bg-surface-elevated/60 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group"
              >
                {/* Header: Title + Severity Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <div className="rounded-md bg-card p-1 border border-border shadow-2xs mt-0.5 shrink-0">
                      <Icon className="h-3 w-3 text-foreground/80" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-foreground leading-snug truncate">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-mono text-muted-foreground block truncate">
                        Target: {item.cohortTarget}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={badgeConfig.variant}
                    dot
                    className="shrink-0 text-[9px] font-mono py-0"
                  >
                    {badgeConfig.label}
                  </Badge>
                </div>

                {/* Description Body */}
                <p className="text-[11px] text-muted-foreground leading-relaxed pl-6">
                  {item.description}
                </p>

                {/* Impact Metric & Action CTA */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50 pl-6 text-[11px]">
                  <div className="text-foreground truncate">
                    <span className="text-muted-foreground">Impact: </span>
                    <span className="font-mono font-semibold text-foreground tabular-nums">
                      {item.impactEstimate}
                    </span>
                  </div>
                  <Button
                    variant={isQueued ? 'outline' : 'default'}
                    size="sm"
                    className="h-6 px-2 text-[10px] gap-1 cursor-pointer font-medium whitespace-nowrap shrink-0"
                    onClick={() => handleToggleQueue(item.id)}
                  >
                    {isQueued ? (
                      <>
                        <Check className="h-2.5 w-2.5 text-foreground shrink-0" />
                        <span>Queued</span>
                      </>
                    ) : (
                      <span>Take action</span>
                    )}
                  </Button>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}

export default ActionableInsightsCard
