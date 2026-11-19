import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, ArrowRight, ShieldCheck, TrendingUp, Award, Zap } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { ActionRecommendation } from '../types'

interface ActionRecommendationsSectionProps {
  recommendations: ActionRecommendation[]
}

const categoryIcons = {
  retention: ShieldCheck,
  loyalty: Award,
  growth: TrendingUp,
  efficiency: Zap,
}

const priorityBadgeConfig = {
  high: { variant: 'destructive' as const, label: 'High Priority Play' },
  medium: { variant: 'warning' as const, label: 'Standard Play' },
  low: { variant: 'outline' as const, label: 'Backlog Play' },
}

export function ActionRecommendationsSection({
  recommendations,
}: ActionRecommendationsSectionProps) {
  const navigate = useNavigate()
  // Track completed tactics per recommendation
  const [completedTactics, setCompletedTactics] = useState<Record<string, boolean>>({})

  const toggleTactic = (key: string) => {
    setCompletedTactics((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <section aria-labelledby="recommendations-title" className="space-y-4">
      <div>
        <h2
          id="recommendations-title"
          className="text-base font-semibold text-foreground flex items-center gap-2"
        >
          <Briefcase className="h-4 w-4 text-primary" />
          Decision-Oriented Action Playbooks
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Traceable business execution programs mapped to underlying data observations.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <Card className="p-8 text-center text-xs text-muted-foreground">
          No recommendations match your active filter selections.
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {recommendations.map((rec) => {
            const Icon = categoryIcons[rec.category] || Briefcase
            const priorityBadge = priorityBadgeConfig[rec.priority]

            return (
              <Card
                key={rec.id}
                className="overflow-hidden border-border/80 hover:border-border-strong transition-all bg-card shadow-2xs flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="p-4 border-b border-border/60 bg-muted/15 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-card border border-border shadow-2xs text-primary">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <Badge variant={priorityBadge.variant} dot className="text-[10px]">
                        {priorityBadge.label}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {rec.category}
                      </Badge>
                    </div>

                    <span className="text-[11px] font-semibold text-primary tabular-nums">
                      {rec.impactEstimate}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 space-y-3.5">
                    {/* Header */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground leading-snug">
                        {rec.title}
                      </h3>
                      <div className="mt-1 text-xs text-muted-foreground">
                        <strong className="text-foreground font-medium">Target:</strong>{' '}
                        {rec.targetAudience}
                      </div>
                    </div>

                    {/* Data Trigger Rule */}
                    <div className="rounded-md border border-border/70 bg-muted/30 p-2.5 text-xs space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                        Observed Data Trigger
                      </span>
                      <p className="text-[11px] text-foreground/90 font-mono leading-relaxed">
                        {rec.dataTrigger}
                      </p>
                    </div>

                    {/* Operational Tactics Checklist */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-foreground block">
                        Execution Playbook Checklist:
                      </span>
                      <div className="space-y-1.5">
                        {rec.tactics.map((tactic, idx) => {
                          const tacticKey = `${rec.id}-${idx}`
                          const isDone = Boolean(completedTactics[tacticKey])

                          return (
                            <label
                              key={idx}
                              className={`flex items-start gap-2.5 p-2 rounded-md border text-xs cursor-pointer transition-colors ${
                                isDone
                                  ? 'bg-muted/40 border-border/60 text-muted-foreground line-through'
                                  : 'bg-card border-border/70 text-foreground hover:bg-muted/20'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isDone}
                                onChange={() => toggleTactic(tacticKey)}
                                className="mt-0.5 h-3.5 w-3.5 rounded-xs border-input text-primary focus:ring-primary cursor-pointer"
                              />
                              <span className="leading-relaxed text-[11px] flex-1">{tactic}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="p-4 border-t border-border/60 bg-muted/10 flex items-center justify-between gap-3">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Ref: {rec.ruleReference}
                  </span>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => navigate(rec.actionHref)}
                    className="gap-1.5 text-xs h-8 cursor-pointer"
                    aria-label={rec.actionLabel}
                  >
                    {rec.actionLabel}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </section>
  )
}
