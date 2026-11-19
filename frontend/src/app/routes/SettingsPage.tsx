import { motion } from 'motion/react'
import { Server, ShieldCheck, Database } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/ui/PageHeader'
import { API_BASE_URL, APP_NAME } from '@/config/constants'

export function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 max-w-4xl"
    >
      <PageHeader
        title="Settings"
        description="Platform configurations, API endpoints, and model service parameters."
      />

      <Card className="divide-y divide-border">
        <div className="flex items-start gap-4 p-5">
          <div className="rounded-md bg-accent/60 p-2 text-primary">
            <Server className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-foreground">Backend API Connection</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Target endpoint for customer data pipeline and prediction queries.
            </p>
            <div className="mt-3">
              <span className="inline-block rounded-md bg-muted px-2.5 py-1 font-mono text-xs text-foreground">
                {API_BASE_URL}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4 p-5">
          <div className="rounded-md bg-accent/60 p-2 text-primary">
            <Database className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-foreground">Environment Information</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Application identification and runtime mode.
            </p>
            <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
              <div className="text-muted-foreground">
                App Name: <span className="font-medium text-foreground">{APP_NAME}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Platform Status:</span>
                <Badge variant="teal">Online</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4 p-5">
          <div className="rounded-md bg-accent/60 p-2 text-primary">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-foreground">Data Privacy & Governance</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Client PII hashing and privacy-preserving ML inferencing enforced.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default SettingsPage
