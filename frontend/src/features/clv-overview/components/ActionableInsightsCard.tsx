import { useState } from 'react'
import { Sparkles, AlertCircle, ArrowUpRight, CheckCircle2, Check } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { ActionableInsight } from '../types'

interface ActionableInsightsCardProps {
  insights: ActionableInsight[]
}

const severityBadgeMap = {
  critical: { variant: 'destructive' as const, label: 'High Priority' },
  elevated: { variant: 'warning' as const, label: 'Opportunity' },
  positive: { variant: 'teal' as const, label: 'Growth Vector' },
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
    <Card>
      <CardHeader className="pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle>Actionable Decision Feed</CardTitle>
          </div>
          <Badge variant="teal">
            {insights.length} Active Signal{insights.length === 1 ? '' : 's'}
          </Badge>
        </div>
        <CardDescription className="mt-0.5">
          Algorithmic detections requiring executive attention and proactive outreach.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {insights.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No active signals for this filter.
          </div>
        ) : (
          insights.map((item) => {
            const badgeConfig = severityBadgeMap[item.severity]
            const Icon = typeIconMap[item.type] || Sparkles
            const isQueued = queuedIds.has(item.id)

            return (
              <div
                key={item.id}
                className="rounded-lg border border-border/80 bg-muted/20 p-3.5 space-y-2 hover:border-border-strong transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-card p-1.5 border border-border shadow-2xs">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <h4 className="text-xs font-semibold text-foreground leading-snug">
                      {item.title}
                    </h4>
                  </div>
                  <Badge variant={badgeConfig.variant} dot className="shrink-0 text-[10px]">
                    {badgeConfig.label}
                  </Badge>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed pl-7">
                  {item.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-border/50 pl-7 text-[11px]">
                  <div className="text-foreground font-medium">
                    Impact:{' '}
                    <span className="font-semibold text-primary tabular-nums">
                      {item.impactEstimate}
                    </span>
                  </div>
                  <Button
                    variant={isQueued ? 'outline' : 'default'}
                    size="sm"
                    className="h-7 text-[11px] self-start sm:self-auto gap-1"
                    onClick={() => handleToggleQueue(item.id)}
                  >
                    {isQueued ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span>Playbook Queued</span>
                      </>
                    ) : (
                      <span>Execute Playbook</span>
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
