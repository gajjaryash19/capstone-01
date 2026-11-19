import { Activity, Clock, ShieldCheck, HelpCircle, Layers, Calendar, BarChart2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SimpleTooltip } from '@/components/ui/Tooltip'
import { formatCurrency } from '@/lib/formatters'
import type { ModelMetadata, PredictionSummaryKpis } from '../types'

interface ModelEvaluationCardProps {
  metadata: ModelMetadata
  kpis: PredictionSummaryKpis
}

export function ModelEvaluationCard({ metadata, kpis }: ModelEvaluationCardProps) {
  const plannedMetrics = [
    {
      metric: 'MAE (Mean Absolute Error)',
      status: 'Backtest Pending',
      definition:
        'Average dollar deviation between predicted CLV and realized 12-month holdout transactions. Lower indicates tighter error bounds.',
    },
    {
      metric: 'RMSE (Root Mean Sq Error)',
      status: 'Backtest Pending',
      definition:
        'Penalizes large outlier forecast errors, particularly critical for high-contract Enterprise accounts.',
    },
    {
      metric: 'Spearman Rank Correlation',
      status: 'Backtest Pending',
      definition:
        'Evaluates monotonicity of predictions to ensure top-ranked accounts consistently generate top realized revenue.',
    },
  ]

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 sm:pb-4 border-b border-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <CardTitle>Model Architecture & Validation</CardTitle>
          </div>
          <CardDescription className="mt-0.5">
            Probabilistic baseline specifications and offline holdout backtest evaluation protocol.
          </CardDescription>
        </div>

        <Badge variant="warning" dot className="shrink-0 self-start sm:self-auto font-medium">
          Holdout Evaluation Pending
        </Badge>
      </CardHeader>

      <CardContent className="pt-4 flex-1 flex flex-col justify-between space-y-4">
        {/* Model Specs Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg border border-border/80 bg-muted/30 text-xs">
          <div>
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block flex items-center gap-1">
              <Layers className="h-3 w-3" /> Architecture
            </span>
            <span
              className="font-medium text-foreground text-xs mt-0.5 block truncate"
              title="BG/NBD + Gamma-Gamma"
            >
              BG/NBD + Gamma-Gamma
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block flex items-center gap-1">
              <Clock className="h-3 w-3" /> Horizon
            </span>
            <span className="font-medium text-foreground text-xs mt-0.5 block">
              {metadata.horizon}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Cutoff Date
            </span>
            <span className="font-medium text-foreground text-xs mt-0.5 block font-mono">
              {metadata.lastRunDate}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block flex items-center gap-1">
              <BarChart2 className="h-3 w-3" /> Environment
            </span>
            <span className="font-medium text-primary text-xs mt-0.5 block">
              Synthetic Demo Cohort
            </span>
          </div>
        </div>

        {/* Evaluation Metrics Protocol */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <span>Holdout Evaluation Protocol</span>
              <SimpleTooltip
                side="top"
                content="Model validation requires realized transaction logs over the full 12-month forward holdout window. Fabricated scores are strictly omitted in favor of genuine backtest results."
              >
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground cursor-help"
                  aria-label="Evaluation protocol details"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </SimpleTooltip>
            </span>
            <span className="text-[11px] text-muted-foreground">Population: 36 Accounts</span>
          </div>

          <div className="space-y-2">
            {plannedMetrics.map((item) => (
              <div
                key={item.metric}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-md border border-border/60 bg-card hover:border-border transition-colors text-xs gap-1 sm:gap-2"
              >
                <div className="min-w-0">
                  <div className="font-medium text-foreground truncate">{item.metric}</div>
                  <div className="text-[11px] text-muted-foreground line-clamp-1">
                    {item.definition}
                  </div>
                </div>
                <div className="shrink-0 self-start sm:self-auto">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-700 border border-amber-500/20">
                    <Clock className="h-2.5 w-2.5" />
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observed vs Projected Cohort Summary */}
        <div className="rounded-md border border-border/80 bg-accent/30 p-3 text-xs space-y-1.5">
          <div className="flex items-center justify-between font-medium text-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>Cohort Value Reconciliation</span>
            </span>
            <span className="text-primary font-semibold">
              +{kpis.projectedExpansionPercent}% Projected Expansion
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
            <div>
              <span className="text-muted-foreground block">Observed Spend:</span>
              <strong className="text-foreground tabular-nums font-semibold">
                {formatCurrency(kpis.totalHistoricalRevenue)}
              </strong>
            </div>
            <div>
              <span className="text-muted-foreground block">Predicted CLV:</span>
              <strong className="text-foreground tabular-nums font-semibold">
                {formatCurrency(kpis.totalPredictedClv)}
              </strong>
            </div>
            <div>
              <span className="text-muted-foreground block">Projected Growth:</span>
              <strong className="text-emerald-600 tabular-nums font-semibold">
                +{formatCurrency(kpis.totalProjectedExpansion)}
              </strong>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
