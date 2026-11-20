import { useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { Download, Check, Sparkles, Database } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { getStaggerContainer, getItemVariants } from '@/styles/motion'
import {
  usePredictionsDirectory,
  PredictionKpiCards,
  PredictionDistributionChart,
  ModelEvaluationCard,
  PredictionFilterBar,
  PredictionTable,
  PredictionCardList,
  PredictionPagination,
  calculatePredictionDistribution,
  calculateSegmentPredictionBreakdown,
  MODEL_METADATA,
  type EnrichedPredictionCustomer,
} from '@/features/predictions'
import { MOCK_CUSTOMERS } from '@/features/customers/mockData'

export function PredictionsPage() {
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()

  const {
    customers,
    totalItems,
    totalPages,
    page,
    pageSize,
    startIndex,
    endIndex,
    globalKpis,
    filteredKpis,
    searchQuery,
    segmentFilter,
    tierFilter,
    deltaFilter,
    sortField,
    sortDirection,
    hasActiveFilters,
    exportSuccess,
    setSearchQuery,
    setSegmentFilter,
    setTierFilter,
    setDeltaFilter,
    setSort,
    setPage,
    setPageSize,
    resetFilters,
    exportToCsv,
  } = usePredictionsDirectory()

  // Deterministic chart data
  const distributionBins = useMemo(() => calculatePredictionDistribution(MOCK_CUSTOMERS), [])
  const segmentBreakdown = useMemo(() => calculateSegmentPredictionBreakdown(MOCK_CUSTOMERS), [])

  const handleSelectCustomer = useCallback(
    (customer: EnrichedPredictionCustomer) => {
      navigate(`/app/customers/${customer.id}`)
    },
    [navigate],
  )

  const containerVariants = getStaggerContainer(shouldReduceMotion, 0.04)
  const itemVariants = getItemVariants(shouldReduceMotion)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-5 sm:space-y-6 max-w-7xl mx-auto"
    >
      {/* Page Title & Context Header */}
      <motion.div variants={itemVariants}>
        <PageHeader
          title="CLV Predictions"
          description="Forecast customer lifetime value, value distributions, and model accuracy."
          badge={
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground bg-surface px-2.5 py-1 rounded-md border border-border">
                Sample Data • 36 Accounts
              </span>
              <span className="font-mono text-xs text-foreground/80 bg-surface-elevated px-2 py-0.5 rounded border border-border">
                12-Month Forecast
              </span>
            </div>
          }
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCsv}
                className="gap-1.5 cursor-pointer text-xs h-8 bg-surface border-border"
                aria-label="Export prediction records to CSV"
              >
                {exportSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-foreground" />
                    <span>Exported CSV</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Export CSV</span>
                  </>
                )}
              </Button>
            </div>
          }
        />
      </motion.div>

      {/* Model Environment Transparency Notice */}
      <motion.div
        variants={itemVariants}
        className="rounded-lg border border-border bg-surface p-3.5 sm:p-4 text-xs text-muted-foreground flex items-start gap-3"
      >
        <Database className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">
            Model Environment: BG/NBD + Gamma-Gamma Baseline
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Customer projections estimate purchase frequency (BG/NBD) and expected monetary value
            (Gamma-Gamma) across a 12-month forward horizon using sample customer data. Live billing
            sync activates when data connectors are linked.
          </p>
        </div>
      </motion.div>

      {/* Summary KPI Cards */}
      <motion.section variants={itemVariants} aria-label="Prediction Summary Metrics">
        <PredictionKpiCards
          kpis={hasActiveFilters ? filteredKpis : globalKpis}
          filteredCount={totalItems}
          isFiltered={hasActiveFilters}
        />
      </motion.section>

      {/* Predicted Value Distribution & Model Evaluation Cards */}
      <motion.div
        variants={itemVariants}
        className="grid gap-5 sm:gap-6 grid-cols-1 lg:grid-cols-2"
      >
        <section aria-label="Customer Value Distribution Chart">
          <PredictionDistributionChart
            distributionBins={distributionBins}
            segmentBreakdown={segmentBreakdown}
          />
        </section>

        <section aria-label="Model Performance & Evaluation Protocol">
          <ModelEvaluationCard metadata={MODEL_METADATA} kpis={globalKpis} />
        </section>
      </motion.div>

      {/* Prediction Explorer Section */}
      <motion.section
        variants={itemVariants}
        aria-label="Customer Prediction Explorer"
        className="space-y-3 sm:space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-foreground/80" />
              <span>Prediction Explorer</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Search, filter, and compare predicted customer value against past purchases.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <PredictionFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          segmentFilter={segmentFilter}
          onSegmentChange={setSegmentFilter}
          tierFilter={tierFilter}
          onTierChange={setTierFilter}
          deltaFilter={deltaFilter}
          onDeltaChange={setDeltaFilter}
          onResetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
          totalFiltered={totalItems}
          totalAll={globalKpis.totalCustomers}
        />

        {/* Desktop & Tablet Table */}
        <div className="hidden sm:block">
          <PredictionTable
            customers={customers}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={setSort}
            onSelectCustomer={handleSelectCustomer}
            onResetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Mobile Card List */}
        <div className="block sm:hidden">
          <PredictionCardList customers={customers} onSelectCustomer={handleSelectCustomer} />
        </div>

        {/* Pagination Controls */}
        <PredictionPagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </motion.section>
    </motion.div>
  )
}

export default PredictionsPage
