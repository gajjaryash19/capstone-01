import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, ExternalLink, Clock, AlertCircle, Zap } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import type { RetentionOpportunitiesDataset } from '../types'

interface RetentionOpportunitiesSectionProps {
  data: RetentionOpportunitiesDataset
}

type ActiveTab = 'high-risk' | 'outperformers' | 'dormant'

export function RetentionOpportunitiesSection({ data }: RetentionOpportunitiesSectionProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('high-risk')
  const navigate = useNavigate()

  return (
    <Card className="flex flex-col">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-destructive" />
              <CardTitle>Customer Retention Opportunities</CardTitle>
            </div>
            <CardDescription className="mt-0.5">
              Targeted retention and expansion cohorts derived from individual customer churn
              probabilities and value benchmarks.
            </CardDescription>
          </div>

          {/* Sub-tab navigation */}
          <div
            className="flex items-center gap-1 p-1 bg-muted/40 rounded-lg border border-border self-start sm:self-auto text-xs"
            role="tablist"
          >
            <button
              role="tab"
              aria-selected={activeTab === 'high-risk'}
              onClick={() => setActiveTab('high-risk')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'high-risk'
                  ? 'bg-card text-foreground shadow-2xs border border-border/80'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <AlertCircle className="h-3.5 w-3.5 text-destructive" />
              <span>High-Value at Risk ({data.highValueAtRisk.length})</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'outperformers'}
              onClick={() => setActiveTab('outperformers')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'outperformers'
                  ? 'bg-card text-foreground shadow-2xs border border-border/80'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span>Segment Leaders ({data.outperformers.length})</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'dormant'}
              onClick={() => setActiveTab('dormant')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dormant'
                  ? 'bg-card text-foreground shadow-2xs border border-border/80'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Dormant Accounts ({data.dormantAccounts.length})</span>
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Tab 1: High-Value at Risk */}
        {activeTab === 'high-risk' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground pb-1">
              <span>
                Accounts with{' '}
                <strong className="text-foreground font-semibold">predicted CLV ≥ $4,000</strong>{' '}
                and <strong className="text-destructive font-semibold">churn risk &gt; 65%</strong>.
              </span>
              <span className="font-medium text-foreground">
                Total At-Risk Exposure:{' '}
                <strong className="text-destructive font-semibold tabular-nums">
                  {formatCurrency(data.totalAtRiskClv)}
                </strong>
              </span>
            </div>

            <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
              {data.highValueAtRisk.map(
                ({ customer, exposureShareOfCohort, daysSinceLastPurchase }) => (
                  <div
                    key={customer.id}
                    className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex flex-col justify-between space-y-3 hover:border-destructive/60 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-card border border-border flex items-center justify-center text-xs font-semibold text-foreground shrink-0 shadow-2xs">
                            {customer.avatarInitials}
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-foreground leading-tight">
                              {customer.name}
                            </h4>
                            <span className="text-[11px] text-muted-foreground truncate block max-w-36">
                              {customer.company}
                            </span>
                          </div>
                        </div>
                        <Badge variant="destructive" dot className="text-[10px]">
                          High Risk
                        </Badge>
                      </div>

                      <div className="space-y-1.5 pt-1 text-xs">
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>Predicted CLV:</span>
                          <strong className="text-foreground font-semibold tabular-nums">
                            {formatCurrency(customer.predictedClv)}
                          </strong>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>Segment:</span>
                          <Badge variant="outline" className="text-[10px]">
                            {customer.segment}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>Churn Probability:</span>
                          <span className="font-semibold text-destructive tabular-nums">
                            {formatPercent(customer.churnProbability * 100, 0)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>Last Purchase:</span>
                          <span className="text-[11px] tabular-nums">
                            {daysSinceLastPurchase} days ago
                          </span>
                        </div>
                      </div>

                      {/* Churn Probability Visual Meter */}
                      <div className="space-y-1 pt-1">
                        <div className="w-full bg-destructive/15 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-destructive h-full rounded-full"
                            style={{ width: `${customer.churnProbability * 100}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-muted-foreground flex justify-between">
                          <span>Risk Score: {customer.churnProbability.toFixed(2)}</span>
                          <span>{exposureShareOfCohort}% of total cohort</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/customers/${customer.id}`)}
                      className="w-full text-xs h-7 gap-1.5 cursor-pointer mt-2"
                      aria-label={`Open customer profile for ${customer.name}`}
                    >
                      Open Profile
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Segment Outperformers */}
        {activeTab === 'outperformers' && (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground pb-1">
              Top individual accounts whose predicted lifetime value exceeds their segment benchmark
              average with low churn risk.
            </div>

            <div className="grid gap-3 grid-cols-1 md:grid-cols-4">
              {data.outperformers.map(({ customer, segmentAverageClv, outperformancePercent }) => (
                <div
                  key={customer.id}
                  className="rounded-lg border border-primary/20 bg-primary/5 p-3.5 flex flex-col justify-between space-y-3 hover:border-primary/50 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-semibold text-foreground leading-tight">
                          {customer.name}
                        </h4>
                        <span className="text-[11px] text-muted-foreground truncate block">
                          {customer.company}
                        </span>
                      </div>
                      <Badge variant="teal" className="text-[10px]">
                        +{outperformancePercent}%
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs pt-1">
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Predicted CLV:</span>
                        <strong className="text-foreground font-semibold tabular-nums">
                          {formatCurrency(customer.predictedClv)}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Segment Mean:</span>
                        <span className="text-muted-foreground tabular-nums">
                          {formatCurrency(segmentAverageClv)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Total Orders:</span>
                        <span className="font-semibold text-foreground tabular-nums">
                          {customer.totalOrders}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/customers/${customer.id}`)}
                    className="w-full text-xs h-7 gap-1.5 cursor-pointer"
                    aria-label={`Open customer profile for ${customer.name}`}
                  >
                    View Account
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Dormant Accounts */}
        {activeTab === 'dormant' && (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground pb-1">
              Accounts in dormant status with high churn probability requiring automated win-back
              triggers.
            </div>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              {data.dormantAccounts.map(({ customer, churnProbability }) => (
                <div
                  key={customer.id}
                  className="rounded-lg border border-border bg-muted/20 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-border-strong transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-foreground">{customer.name}</h4>
                      <Badge variant="outline" className="text-[10px]">
                        {customer.segment}
                      </Badge>
                      <Badge variant="warning" className="text-[10px]">
                        Dormant
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {customer.company} • Last purchase: {customer.lastPurchaseDate} • Churn Prob:{' '}
                      {formatPercent(churnProbability * 100, 0)}
                    </p>
                    <div className="text-xs text-foreground font-medium pt-0.5">
                      Predicted CLV:{' '}
                      <span className="tabular-nums font-semibold">
                        {formatCurrency(customer.predictedClv)}
                      </span>{' '}
                      (Historical Spend: {formatCurrency(customer.historicalRevenue)})
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/customers/${customer.id}`)}
                    className="h-7 text-xs gap-1 cursor-pointer shrink-0"
                    aria-label={`View dormant account ${customer.name}`}
                  >
                    Review Account
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
