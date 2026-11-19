import { motion } from 'motion/react'
import { Users, Filter } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { EmptyState } from '@/components/feedback/EmptyState'

export function CustomersPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 max-w-7xl"
    >
      <PageHeader
        title="Customers"
        description="Customer directory, individual lifetime value trajectories, and churn propensity indicators."
        actions={
          <Button variant="outline" size="sm">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            Filter Accounts
          </Button>
        }
      />

      <Card>
        <CardHeader className="border-b border-border pb-4">
          <CardTitle>Customer Directory</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <EmptyState
            icon={Users}
            title="Customer intelligence data ready to connect"
            description="Account profiles and granular transaction history will populate once data pipeline syncing is initiated."
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default CustomersPage
