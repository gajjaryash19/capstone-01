import { motion } from 'motion/react'
import { Sparkles, AlertTriangle, ArrowUpRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/ui/PageHeader'

export function PredictionsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 max-w-7xl"
    >
      <PageHeader
        title="CLV Predictions"
        description="Machine-learning forecasts, purchase frequency projections, and churn probability."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 border-b border-border pb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle>High-Probability Expansion</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {[
              { company: 'Acme Global Corp', confidence: '94%', expectedClv: '$18,400' },
              { company: 'Nova Labs International', confidence: '89%', expectedClv: '$12,850' },
              { company: 'Apex Digital Inc', confidence: '87%', expectedClv: '$11,200' },
            ].map((account) => (
              <div
                key={account.company}
                className="flex items-center justify-between rounded-md border border-border/60 p-3 text-xs"
              >
                <div>
                  <div className="font-medium text-foreground">{account.company}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Confidence:{' '}
                    <span className="tabular-nums text-primary">{account.confidence}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold tabular-nums text-foreground">
                    {account.expectedClv}
                  </div>
                  <div className="inline-flex items-center text-[11px] text-primary font-medium">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> High Propensity
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 border-b border-border pb-4">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <CardTitle>Churn Early Warnings</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {[
              { account: 'Vertex Media Group', risk: 'Critical (82%)', ltvAtRisk: '$9,200' },
              { account: 'Solaris Cloud Systems', risk: 'High (68%)', ltvAtRisk: '$6,450' },
              { account: 'Beacon Logistics', risk: 'Elevated (55%)', ltvAtRisk: '$5,100' },
            ].map((item) => (
              <div
                key={item.account}
                className="flex items-center justify-between rounded-md border border-border/60 p-3 text-xs"
              >
                <div>
                  <div className="font-medium text-foreground">{item.account}</div>
                  <div className="mt-0.5">
                    <Badge variant="destructive">{item.risk}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold tabular-nums text-foreground">{item.ltvAtRisk}</div>
                  <div className="text-[11px] text-muted-foreground">LTV at Risk</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

export default PredictionsPage
