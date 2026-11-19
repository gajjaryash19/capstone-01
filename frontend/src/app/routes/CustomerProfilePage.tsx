import { useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  MOCK_CUSTOMERS,
  CustomerProfileHeader,
  CustomerProfileKpiCards,
  CustomerValueAnalysisCard,
  CustomerPurchaseBehaviorCard,
  CustomerRetentionIntelligenceCard,
  CustomerNotFound,
} from '@/features/customers'

export function CustomerProfilePage() {
  const { customerId } = useParams<{ customerId: string }>()

  const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId)

  if (!customer) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <CustomerNotFound customerId={customerId} />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-5 sm:space-y-6"
    >
      {/* Profile Header & Identity */}
      <CustomerProfileHeader customer={customer} />

      {/* Profile KPI Cards */}
      <section aria-label="Customer KPI Summary">
        <CustomerProfileKpiCards customer={customer} />
      </section>

      {/* Customer Value Analysis & Retention Intelligence Grid */}
      <div className="grid gap-5 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <CustomerValueAnalysisCard customer={customer} />
        <CustomerRetentionIntelligenceCard customer={customer} />
      </div>

      {/* Behavioral Analysis & Order History */}
      <section aria-label="Purchase Behavior and Order History">
        <CustomerPurchaseBehaviorCard customer={customer} />
      </section>
    </motion.div>
  )
}

export default CustomerProfilePage
