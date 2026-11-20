import { useNavigate } from 'react-router-dom'
import { CheckCircle, ExternalLink, Database, Calculator } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MOCK_CUSTOMERS } from '@/features/customers/mockData'
import { formatCurrency } from '@/lib/formatters'
import type { BusinessInsight } from '../types'

interface InsightDetailModalProps {
  insight: BusinessInsight | null
  isOpen: boolean
  onClose: () => void
}

export function InsightDetailModal({ insight, isOpen, onClose }: InsightDetailModalProps) {
  const navigate = useNavigate()

  if (!insight) return null

  // Find full customer records for affectedCustomerIds
  const affectedCustomers = MOCK_CUSTOMERS.filter((c) => insight.affectedCustomerIds.includes(c.id))

  const handleNavigateToCustomer = (customerId: string) => {
    onClose()
    navigate(`/customers/${customerId}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="teal" className="text-[10px] font-mono">
              {insight.generationType.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {insight.segment}
            </Badge>
            <span className="text-[11px] font-mono text-muted-foreground">{insight.id}</span>
          </div>

          <DialogTitle className="text-base font-bold text-foreground mt-1">
            {insight.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Transparent mathematical audit trail and data lineage for this analytical discovery.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Rule Metadata Strip */}
          <div className="rounded-lg border border-border bg-muted/20 p-3.5 space-y-2.5">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Calculator className="h-4 w-4 text-primary" />
              <span>Deterministic Rule Provenance</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                  Rule Identifier
                </span>
                <span className="font-mono text-foreground font-medium">{insight.ruleId}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                  Rule Name
                </span>
                <span className="text-foreground font-medium">{insight.ruleName}</span>
              </div>
            </div>

            <div className="pt-1 border-t border-border/50">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-0.5">
                Deterministic Mathematical Expression
              </span>
              <code className="text-[11px] font-mono text-primary bg-card px-2 py-1 rounded border border-border block overflow-x-auto">
                {insight.ruleFormula}
              </code>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                Data Source: MOCK_CUSTOMERS (36 Accounts)
              </span>
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Zero Synthetic Hallucinations
              </span>
            </div>
          </div>

          {/* Observation & Implication */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Observed Data Pattern</h4>
            <p className="text-muted-foreground leading-relaxed">{insight.supportingObservation}</p>
          </div>

          {/* Metric Breakdown Table */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Verified Metric Inputs</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {insight.metrics.map((m, idx) => (
                <div key={idx} className="rounded-md border border-border bg-card p-2 text-center">
                  <span className="text-[10px] text-muted-foreground uppercase block">
                    {m.label}
                  </span>
                  <span className="text-xs font-bold text-foreground mt-0.5 block tabular-nums">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Affected Accounts */}
          {affectedCustomers.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">
                  Identified Account Records ({affectedCustomers.length})
                </h4>
                <span className="text-[11px] text-muted-foreground">
                  Click an account to view 360° profile
                </span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {affectedCustomers.map((cust) => (
                  <div
                    key={cust.id}
                    className="flex items-center justify-between p-2 rounded-md border border-border/80 bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-semibold text-foreground shrink-0">
                        {cust.avatarInitials}
                      </div>
                      <div>
                        <span className="font-semibold text-foreground block leading-tight">
                          {cust.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {cust.company} • {cust.segment}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-semibold text-foreground block tabular-nums text-xs">
                          {formatCurrency(cust.predictedClv)}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">
                          Risk: {(cust.churnProbability * 100).toFixed(0)}%
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleNavigateToCustomer(cust.id)}
                        className="h-6 text-[11px] px-2 gap-1 cursor-pointer"
                        aria-label={`Inspect ${cust.name}`}
                      >
                        Inspect
                        <ExternalLink className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Business Action Blueprint */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-1.5">
            <span className="font-semibold text-primary block">
              Strategic Action Recommendation
            </span>
            <p className="text-foreground/90 leading-relaxed">{insight.suggestedAction}</p>
          </div>
        </div>

        <DialogFooter className="border-t border-border pt-3">
          <Button variant="outline" size="sm" onClick={onClose} className="cursor-pointer text-xs">
            Close Audit
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              onClose()
              navigate(insight.actionHref)
            }}
            className="cursor-pointer text-xs gap-1"
          >
            {insight.actionLabel}
            <ExternalLink className="h-3 w-3" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
