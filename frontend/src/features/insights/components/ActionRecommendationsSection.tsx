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
  high: { variant: 'destructive' as const, label: 'High Priority' },
  medium: { variant: 'warning' as const, label: 'Medium Priority' },
  low: { variant: 'outline' as const, label: 'Low Priority' },
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
          <Briefcase className="h-4 w-4 text-foreground" />
          <span>Recommended Actions</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Specific action steps based on customer behavior and value forecasts.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <Card className="p-8 text-center text-xs text-muted-foreground bg-surface border-border">
          No recommendations match your active filters.
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {recommendations.map((rec) => {
            const Icon = categoryIcons[rec.category] || Briefcase
            const priorityBadge = priorityBadgeConfig[rec.priority]

            return (
              <Card
                key={rec.id}
                className="overflow-hidden border-border hover:border-border-strong transition-all bg-surface shadow-2xs flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="p-4 border-b border-border/80 bg-surface-elevated/40 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-surface-elevated border border-border shadow-2xs text-foreground">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <Badge variant={priorityBadge.variant} dot className="text-[10px]">
                        {priorityBadge.label}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-mono capitalize text-muted-foreground"
                      >
                        {rec.category}
                      </Badge>
                    </div>

                    <span className="text-[11px] font-semibold text-foreground font-mono tabular-nums">
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
                    <div className="rounded-md border border-border bg-surface-elevated/40 p-2.5 text-xs space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground font-mono block">
                        Data Trigger
                      </span>
                      <p className="text-[11px] text-foreground/90 font-mono leading-relaxed">
                        {rec.dataTrigger}
                      </p>
                    </div>

                    {/* Operational Tactics Checklist */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-foreground block">
                        Action Checklist:
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
                                  ? 'bg-surface-elevated/20 border-border/60 text-muted-foreground line-through'
                                  : 'bg-surface-elevated/50 border-border text-foreground hover:bg-surface-elevated/80'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isDone}
                                onChange={() => toggleTactic(tacticKey)}
                                aria-label={`Mark tactic as ${isDone ? 'incomplete' : 'complete'}: ${tactic}`}
                                className="mt-0.5 h-3.5 w-3.5 rounded border-border accent-foreground cursor-pointer"
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
                <div className="p-4 border-t border-border bg-surface-elevated/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Ref: {rec.ruleReference}
                  </span>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => navigate(rec.actionHref)}
                    className="gap-1.5 text-xs h-8 cursor-pointer font-medium w-full sm:w-auto"
                    aria-label={rec.actionLabel}
                  >
                    <span>{rec.actionLabel}</span>
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
