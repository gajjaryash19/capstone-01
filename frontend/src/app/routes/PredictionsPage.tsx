import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Download, Check, Sparkles, Database } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
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

  const handleSelectCustomer = (customer: EnrichedPredictionCustomer) => {
    navigate(`/customers/${customer.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-5 sm:space-y-6"
    >
      {/* Page Title & Context Header */}
      <PageHeader
        title="CLV Predictions"
        description="Probabilistic customer lifetime value forecasts, value distributions, and model validation status."
        badge={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="teal" dot className="shrink-0 font-medium">
              Demo Cohort • Synthetic Evaluation Baseline
            </Badge>
            <Badge
              variant="outline"
              className="shrink-0 text-muted-foreground font-mono text-[11px]"
            >
              12-Month Forward Horizon (Fixed)
            </Badge>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCsv}
              className="gap-1.5 cursor-pointer text-xs"
              aria-label="Export prediction records to CSV"
            >
              {exportSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
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

      {/* Demo / Experimental Transparency Notice */}
      <div className="rounded-lg border border-primary/20 bg-accent/40 p-3 sm:p-4 text-xs text-muted-foreground flex items-start gap-3">
        <Database className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">
            Model Environment: Offline BG/NBD + Gamma-Gamma Baseline
          </p>
          <p className="text-[11px] leading-relaxed">
            Customer-level projections are generated using deterministic synthetic data
            parameterized to match probabilistic transaction cadence (BG/NBD) and monetary value
            (Gamma-Gamma) across a fixed 12-month forward horizon. Ground truth holdout validation
            is scheduled for Phase 5 batch backtesting.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <section aria-label="Prediction Summary Metrics">
        <PredictionKpiCards
          kpis={hasActiveFilters ? filteredKpis : globalKpis}
          filteredCount={totalItems}
          isFiltered={hasActiveFilters}
        />
      </section>

      {/* Predicted Value Distribution & Model Evaluation Cards */}
      <div className="grid gap-5 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <section aria-label="Customer Value Distribution Chart">
          <PredictionDistributionChart
            distributionBins={distributionBins}
            segmentBreakdown={segmentBreakdown}
          />
        </section>

        <section aria-label="Model Performance & Evaluation Protocol">
          <ModelEvaluationCard metadata={MODEL_METADATA} kpis={globalKpis} />
        </section>
      </div>

      {/* Prediction Explorer Section */}
      <section aria-label="Customer Prediction Explorer" className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Prediction Explorer</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Search, filter, and compare account-level forward forecasts against historical spend.
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
      </section>
    </motion.div>
  )
}

export default PredictionsPage
