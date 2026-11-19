import { ShieldAlert, Layers, Activity, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { CustomerRecord } from '../../types'

interface CustomerRetentionIntelligenceCardProps {
  customer: CustomerRecord
}

export function CustomerRetentionIntelligenceCard({
  customer,
}: CustomerRetentionIntelligenceCardProps) {
  const getRiskVariant = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'teal' as const
      case 'moderate':
        return 'warning' as const
      case 'high':
      default:
        return 'destructive' as const
    }
  }

  const getSegmentDescription = (segment: string) => {
    switch (segment) {
      case 'Enterprise':
        return 'Top 5% revenue cohort characterized by contract stability and high monetary velocity.'
      case 'Mid-Market':
        return 'Core growth cohort with consistent purchase intervals and stable unit economics.'
      case 'Growth':
        return 'Early-tenure high-velocity accounts demonstrating expansion potential.'
      case 'Standard':
      default:
        return 'Baseline transactional accounts with periodic order frequency.'
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-primary" />
          <CardTitle>CLV & Retention Intelligence</CardTitle>
        </div>
        <CardDescription>
          Cohort classification, churn propensity metrics, and retention indicators.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-5 space-y-4">
        {/* Retention & Churn Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Churn Risk Score */}
          <div className="rounded-lg border border-border/70 bg-card p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <ShieldAlert
                  className={`h-3.5 w-3.5 ${
                    customer.churnRisk === 'high'
                      ? 'text-destructive'
                      : customer.churnRisk === 'moderate'
                        ? 'text-amber-500'
                        : 'text-emerald-500'
                  }`}
                />
                Churn Risk Classification
              </span>
              <Badge variant={getRiskVariant(customer.churnRisk)} dot>
                {customer.churnRisk.toUpperCase()} RISK
              </Badge>
            </div>

            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold tabular-nums text-foreground">
                {(customer.churnProbability * 100).toFixed(1)}%
              </div>
              <span className="text-xs text-muted-foreground">inactivity propensity</span>
            </div>

            <p className="text-[11px] text-muted-foreground leading-normal">
              Estimated statistical probability of customer dormancy over the next 90-day horizon as
              modeled by BG/NBD churn equations.
            </p>
          </div>

          {/* Segment Classification */}
          <div className="rounded-lg border border-border/70 bg-card p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                Assigned Value Segment
              </span>
              <span className="font-semibold text-xs text-foreground">{customer.segment}</span>
            </div>

            <div className="flex items-baseline gap-2">
              <div className="text-base font-bold text-foreground">
                Cohort Tier: {customer.segment}
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground leading-normal">
              {getSegmentDescription(customer.segment)}
            </p>
          </div>
        </div>

        {/* Account Status Telemetry */}
        <div className="rounded-md border border-border/60 bg-muted/20 p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">Account Health State:</span>
            <span className="font-semibold text-foreground capitalize">{customer.status}</span>
          </div>
          <span className="text-[11px] text-muted-foreground">Evaluation Cohort Sync: Active</span>
        </div>

        {/* Transparent Notice Regarding Unavailable Metrics */}
        <div className="flex items-start gap-2.5 rounded-md bg-muted/40 border border-border/80 p-3 text-xs text-muted-foreground">
          <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed text-[11px]">
            <p className="font-medium text-foreground">Model Attribution & Explanations</p>
            <p>
              Detailed ML feature importance scores (SHAP values) and automated customer success
              intervention playbooks are currently unavailable in this evaluation environment. They
              will be populated upon CRM webhook integration.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
