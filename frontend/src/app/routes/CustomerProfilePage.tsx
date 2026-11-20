import { useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { getStaggerContainer, getItemVariants } from '@/styles/motion'
import {
  MOCK_CUSTOMERS,
  CustomerProfileHeader,
  CustomerProfileKpiCards,
  CustomerValueAnalysisCard,
  CustomerPurchaseBehaviorCard,
  CustomerRetentionIntelligenceCard,
  CustomerAnalyticalInsightCard,
  CustomerNotFound,
} from '@/features/customers'

export function CustomerProfilePage() {
  const { customerId } = useParams<{ customerId: string }>()
  const shouldReduceMotion = useReducedMotion()

  const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId)

  if (!customer) {
    return (
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <CustomerNotFound customerId={customerId} />
      </motion.div>
    )
  }

  const containerVariants = getStaggerContainer(shouldReduceMotion, 0.05)
  const itemVariants = getItemVariants(shouldReduceMotion)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-5 sm:space-y-6"
    >
      {/* Profile Header & Identity */}
      <motion.div variants={itemVariants}>
        <CustomerProfileHeader customer={customer} />
      </motion.div>

      {/* Profile KPI Cards */}
      <motion.section variants={itemVariants} aria-label="Customer KPI Summary">
        <CustomerProfileKpiCards customer={customer} />
      </motion.section>

      {/* Main Customer Valuation & Benchmark Analysis */}
      <motion.section variants={itemVariants} aria-label="Valuation and Benchmark Analysis">
        <CustomerValueAnalysisCard customer={customer} />
      </motion.section>

      {/* Behavioral Analysis & Retention Intelligence Grid */}
      <motion.div
        variants={itemVariants}
        className="grid gap-5 sm:gap-6 grid-cols-1 lg:grid-cols-2"
      >
        <CustomerPurchaseBehaviorCard customer={customer} />
        <CustomerRetentionIntelligenceCard customer={customer} />
      </motion.div>

      {/* Analytical Insight & Strategic Recommendation */}
      <motion.section variants={itemVariants} aria-label="Analytical Insights">
        <CustomerAnalyticalInsightCard customer={customer} />
      </motion.section>

      {/* Model Attribution and Evaluation Footer */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground pt-2 border-t border-border/60"
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
          <span>Evaluation Engine: BG/NBD + Gamma-Gamma v2.4</span>
          <span>•</span>
          <span>Cohort Reference: 2026-11-19</span>
        </div>
        <div className="font-mono text-muted-foreground/80">
          Account Intelligence Record: {customer.id}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CustomerProfilePage
