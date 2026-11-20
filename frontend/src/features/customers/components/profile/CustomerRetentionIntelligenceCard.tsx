import { ShieldAlert, Layers, Activity, AlertCircle, ShieldCheck } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { SEGMENT_DEFINITIONS } from '@/features/customer-segments/segmentAnalytics'
import { MOCK_CUSTOMERS } from '../../mockData'
import type { CustomerRecord } from '../../types'

interface CustomerRetentionIntelligenceCardProps {
  customer: CustomerRecord
}

export function CustomerRetentionIntelligenceCard({
  customer,
}: CustomerRetentionIntelligenceCardProps) {
  const segmentMeta = SEGMENT_DEFINITIONS[customer.segment]

  // Calculate position in segment
  const segmentPeers = MOCK_CUSTOMERS.filter((c) => c.segment === customer.segment).sort(
    (a, b) => b.predictedClv - a.predictedClv,
  )
  const segmentRank = segmentPeers.findIndex((c) => c.id === customer.id) + 1
  const totalInSegment = segmentPeers.length

  const getRiskDetails = (risk: string) => {
    switch (risk) {
      case 'high':
        return {
          label: 'HIGH CHURN RISK',
          color: 'text-red-400',
          badgeClass: 'border-red-500/30 bg-red-500/10 text-red-400',
          icon: ShieldAlert,
          interpretation: 'High churn risk (>65%). Recommend proactive check-in or outreach.',
        }
      case 'moderate':
        return {
          label: 'MODERATE CHURN RISK',
          color: 'text-amber-400',
          badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
          icon: ShieldAlert,
          interpretation: 'Moderate churn risk (30–65%). Time between orders has increased.',
        }
      case 'low':
      default:
        return {
          label: 'LOW CHURN RISK',
          color: 'text-muted-foreground',
          badgeClass: 'border-border bg-muted/40 text-muted-foreground',
          icon: ShieldCheck,
          interpretation: 'Low churn risk (<30%). Regular orders and steady purchase activity.',
        }
    }
  }

  const riskDetails = getRiskDetails(customer.churnRisk)
  const RiskIcon = riskDetails.icon

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-foreground/80" />
          <CardTitle className="text-base font-semibold text-foreground">
            Retention & Segment Intelligence
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Cohort tier classification, churn propensity metrics, and strategic playbook alignment.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-5 space-y-4">
        {/* Retention & Churn Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Churn Risk Score */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <RiskIcon className={`h-3.5 w-3.5 ${riskDetails.color}`} />
                Churn Propensity
              </span>
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium border ${riskDetails.badgeClass}`}
              >
                {riskDetails.label}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold font-mono tabular-nums text-foreground">
                {(customer.churnProbability * 100).toFixed(1)}%
              </div>
              <span className="text-xs text-muted-foreground">inactivity probability</span>
            </div>

            <p className="text-[11px] text-muted-foreground leading-normal">
              {riskDetails.interpretation}
            </p>
          </div>

          {/* Segment Classification */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                Segment Tier
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                Rank #{segmentRank} of {totalInSegment}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <div className="text-base font-bold text-foreground">{customer.segment} Tier</div>
            </div>

            <p className="text-[11px] text-muted-foreground leading-normal">
              {segmentMeta.description}
            </p>
          </div>
        </div>

        {/* Strategic Retention Focus */}
        <div className="rounded-lg border border-border bg-surface-elevated/40 p-3.5 space-y-1.5">
          <div className="text-[11px] font-semibold text-foreground uppercase tracking-wider">
            Segment Strategic Playbook ({customer.segment})
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {segmentMeta.strategicFocus}
          </p>
        </div>

        {/* Account Status Telemetry */}
        <div className="rounded-md border border-border bg-muted/20 p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Account Lifecycle State:</span>
            <span className="font-semibold text-foreground capitalize">{customer.status}</span>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">
            Evaluation Sync: Nominal
          </span>
        </div>

        {/* Transparent Model Disclaimer */}
        <div className="flex items-start gap-2.5 rounded-md bg-muted/30 border border-border/80 p-3 text-xs text-muted-foreground">
          <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed text-[11px]">
            <p className="font-medium text-foreground">Statistical Inactivity Attribution</p>
            <p>
              Churn probability is evaluated over a forward 90-day observation window modeled by
              Pareto/NBD and BG/NBD probability density functions using order recency and tenure
              deltas.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
