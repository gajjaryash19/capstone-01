import { motion } from 'motion/react'
import { Sparkles, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { EmptyState } from '@/components/feedback/EmptyState'

export function InsightsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 max-w-7xl"
    >
      <PageHeader
        title="Insights"
        description="Automated cohort discoveries, CLV anomaly detections, and AI-recommended retention actions."
      />

      <Card>
        <CardHeader className="border-b border-border pb-4">
          <CardTitle>Autonomous Analytical Discoveries</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <EmptyState
            icon={Sparkles}
            title="Insights engine ready"
            description="The intelligence model continuously scans cohort behavior for expansion signals and retention opportunities."
            action={
              <Button variant="outline" size="sm">
                Run Diagnostics
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            }
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default InsightsPage
