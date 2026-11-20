import { Layers, Clock, Calendar, BarChart2, ShieldCheck, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/formatters'
import type { ModelMetadata, PredictionSummaryKpis } from '../types'

interface ModelEvaluationCardProps {
  metadata: ModelMetadata
  kpis: PredictionSummaryKpis
}

export function ModelEvaluationCard({ metadata, kpis }: ModelEvaluationCardProps) {
  return (
    <Card className="flex flex-col bg-surface border-border">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 sm:pb-4 border-b border-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-foreground/80" />
            <CardTitle className="text-base font-semibold text-foreground">
              Model Details & Parameters
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Model configuration, forecast horizon, and backtest status.
          </CardDescription>
        </div>

        <span className="text-[11px] font-mono text-muted-foreground bg-surface-elevated px-2 py-0.5 rounded border border-border self-start sm:self-auto">
          Validation Pending
        </span>
      </CardHeader>

      <CardContent className="pt-4 flex-1 flex flex-col justify-between space-y-4">
        {/* Model Specs Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg border border-border bg-surface-elevated/40 text-xs">
          <div>
            <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
              <Layers className="h-3 w-3 text-muted-foreground" /> Architecture
            </span>
            <span
              className="font-medium text-foreground text-xs mt-0.5 block truncate font-mono"
              title="BG/NBD + Gamma-Gamma"
            >
              BG/NBD + Γ-Γ
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" /> Horizon
            </span>
            <span className="font-medium text-foreground text-xs mt-0.5 block font-mono">
              {metadata.horizon}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" /> Cutoff Date
            </span>
            <span className="font-medium text-foreground text-xs mt-0.5 block font-mono">
              {metadata.lastRunDate}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
              <BarChart2 className="h-3 w-3 text-muted-foreground" /> Mode
            </span>
            <span className="font-medium text-foreground text-xs mt-0.5 block font-mono">
              Offline Evaluation
            </span>
          </div>
        </div>

        {/* Real Cohort Statistical Summary */}
        <div className="space-y-2">
          <span className="text-[11px] uppercase font-semibold text-muted-foreground tracking-wider block">
            Customer Value Ranges
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-md border border-border bg-surface-elevated/30">
              <span className="text-[10px] text-muted-foreground block">Max Predicted</span>
              <span className="font-mono font-bold text-foreground text-sm">
                {formatCurrency(kpis.maxPredictedClv)}
              </span>
            </div>

            <div className="p-2.5 rounded-md border border-border bg-surface-elevated/30">
              <span className="text-[10px] text-muted-foreground block">Median Valuation</span>
              <span className="font-mono font-bold text-foreground text-sm">
                {formatCurrency(kpis.medianPredictedClv)}
              </span>
            </div>

            <div className="p-2.5 rounded-md border border-border bg-surface-elevated/30">
              <span className="text-[10px] text-muted-foreground block">Min Valuation</span>
              <span className="font-mono font-bold text-foreground text-sm">
                {formatCurrency(kpis.minPredictedClv)}
              </span>
            </div>

            <div className="p-2.5 rounded-md border border-border bg-surface-elevated/30">
              <span className="text-[10px] text-muted-foreground block">Total Predicted</span>
              <span className="font-mono font-bold text-foreground text-sm">
                {formatCurrency(kpis.totalPredictedClv)}
              </span>
            </div>
          </div>
        </div>

        {/* Model Protocol & Transparency Callout */}
        <div className="rounded-lg border border-border/80 bg-surface-elevated/40 p-3.5 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span>Validation & Data Source</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Forecasts estimate customer spend based on order history and purchase frequency. Error
            metrics (MAE, RMSE, and rank correlation) will be calculated against actuals once live
            CRM data sync is connected.
          </p>
        </div>

        {/* Audit Status Footer */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-3 w-3 text-muted-foreground" />
            <span>Live ML predictions activate upon backend connection</span>
          </div>
          <span className="font-mono">v2.4 Baseline</span>
        </div>
      </CardContent>
    </Card>
  )
}
