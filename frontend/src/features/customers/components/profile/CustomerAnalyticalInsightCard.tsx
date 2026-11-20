import { Sparkles, ArrowRight, ShieldCheck, AlertCircle, Compass } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { generateInsights } from '@/features/insights/insightsAnalytics'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import { MOCK_CUSTOMERS } from '../../mockData'
import type { CustomerRecord } from '../../types'

interface CustomerAnalyticalInsightCardProps {
  customer: CustomerRecord
}

export function CustomerAnalyticalInsightCard({ customer }: CustomerAnalyticalInsightCardProps) {
  // Check if system-wide rule engine flagged this customer
  const allInsights = generateInsights(MOCK_CUSTOMERS)
  const customerSystemInsight = allInsights.find((ins) =>
    ins.affectedCustomerIds.includes(customer.id),
  )

  // Deterministic evaluation parameters
  const EVAL_REF_DATE = new Date('2026-11-19').getTime()
  const lastPurchaseTime = new Date(customer.lastPurchaseDate).getTime()
  const recencyDays = Math.max(
    0,
    Math.floor((EVAL_REF_DATE - lastPurchaseTime) / (1000 * 60 * 60 * 24)),
  )

  const futureValue = Math.max(0, customer.predictedClv - customer.historicalRevenue)
  const isHighValue = customer.predictedClv >= 10000
  const isHighRisk = customer.churnRisk === 'high'

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-foreground/80" />
            <CardTitle className="text-base font-semibold text-foreground">
              Insights & Recommendations
            </CardTitle>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground bg-surface-elevated px-2 py-0.5 rounded border border-border">
            Automated Analysis
          </span>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Account observations and recommended next steps based on customer value and purchase
          cadence.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-5 space-y-4">
        {customerSystemInsight ? (
          // Display active high-priority system insight
          <div className="space-y-4">
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {customerSystemInsight.title}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  Rule ID: {customerSystemInsight.ruleId}
                </span>
              </div>

              <p className="text-xs text-foreground/90 leading-relaxed">
                {customerSystemInsight.supportingObservation}
              </p>

              <div className="pt-2 border-t border-red-500/10 space-y-1 text-xs">
                <span className="font-medium text-foreground">Business Implication:</span>
                <p className="text-muted-foreground leading-normal text-[11px]">
                  {customerSystemInsight.businessImplication}
                </p>
              </div>

              <div className="pt-2 border-t border-red-500/10 space-y-1 text-xs">
                <span className="font-medium text-foreground">Recommended Action:</span>
                <p className="text-muted-foreground leading-normal text-[11px]">
                  {customerSystemInsight.suggestedAction}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {customerSystemInsight.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-md border border-border bg-surface-elevated/40 p-2.5 space-y-1"
                >
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block truncate">
                    {m.label}
                  </span>
                  <div className="font-mono text-sm font-bold text-foreground tabular-nums">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Deterministic account standing evaluation
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-surface-elevated/40 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-muted-foreground" />
                  Strategic Account Profile Assessment
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  Cohort Evaluation Rule: EVAL_TIER_RECENCY
                </span>
              </div>

              <p className="text-xs text-foreground/90 leading-relaxed">
                {isHighValue
                  ? `${customer.name} is a high-value anchor account with ${formatCurrency(
                      customer.predictedClv,
                    )} in predicted lifetime valuation, representing steady cash flows and high expansion upside.`
                  : `${customer.name} operates as a ${customer.segment} account with ${formatCurrency(
                      customer.predictedClv,
                    )} in lifetime valuation and ${customer.totalOrders} recorded transactions.`}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="space-y-1">
                  <span className="font-medium text-foreground flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-muted-foreground" />
                    Retention & Risk Posture
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    {isHighRisk
                      ? `Elevated inactivity score (${(customer.churnProbability * 100).toFixed(1)}%). Recommend proactive engagement prior to 90-day threshold.`
                      : `Favorable engagement stability (${(customer.churnProbability * 100).toFixed(1)}% churn propensity). Last active ${recencyDays} days ago.`}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-medium text-foreground flex items-center gap-1">
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    Expansion Opportunity
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    Modeled future value headroom of {formatCurrency(futureValue)} (
                    {formatPercent(
                      customer.predictedClv > 0
                        ? Math.max(
                            0,
                            100 - (customer.historicalRevenue / customer.predictedClv) * 100,
                          )
                        : 0,
                      0,
                    )}{' '}
                    unrealized). Focus on order frequency cadence.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-border/80 bg-muted/20 p-3 text-xs text-muted-foreground flex items-center justify-between">
              <span className="text-[11px]">
                Deterministic Rule: <code className="text-foreground">CLV_TIER_RECENCY_V2</code>
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                Confidence Level: Nominal
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
