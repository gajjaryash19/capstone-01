import { useCallback } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { Download, Check, Cpu } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/formatters'
import { getStaggerContainer, getItemVariants } from '@/styles/motion'
import {
  useCustomerDirectory,
  CustomerKpiCards,
  CustomerFilterBar,
  CustomerTable,
  CustomerCardList,
  CustomerPagination,
  type CustomerRecord,
} from '@/features/customers'

export function CustomersPage() {
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
    searchQuery,
    segmentFilter,
    churnRiskFilter,
    clvTierFilter,
    sortField,
    sortDirection,
    hasActiveFilters,
    exportSuccess,
    setSearchQuery,
    setSegmentFilter,
    setChurnRiskFilter,
    setClvTierFilter,
    setSort,
    setPage,
    setPageSize,
    resetFilters,
    exportToCsv,
  } = useCustomerDirectory()

  const handleSelectCustomer = useCallback(
    (customer: CustomerRecord) => {
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
      className="space-y-5 sm:space-y-6 min-w-0"
    >
      {/* Page Title & Header */}
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Customers"
          description="View customer accounts, predicted lifetime value, and churn risk."
          badge={
            <Badge variant="neutral" dot className="shrink-0 font-medium">
              {globalKpis.totalCustomers} Customers
            </Badge>
          }
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCsv}
                className="gap-1.5 cursor-pointer text-xs border-border-strong"
                aria-label="Export filtered customers to CSV"
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

      {/* Evaluation Environment Status Bar */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 rounded-lg bg-surface-elevated/70 border border-border/80 px-3.5 py-2 text-xs text-muted-foreground"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Cpu className="h-3.5 w-3.5 text-foreground/80 shrink-0" />
          <span className="truncate">
            <strong className="text-foreground font-semibold">Evaluation Mode:</strong>{' '}
            Deterministic customer intelligence cohort with analytical BG/NBD scoring.
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
          <span className="tabular-nums">
            Accounts: <strong className="text-foreground">{globalKpis.totalCustomers}</strong>
          </span>
          <span className="text-border" aria-hidden="true">
            |
          </span>
          <span className="tabular-nums">
            High-Value: <strong className="text-foreground">{globalKpis.highValueCustomers}</strong>
          </span>
          <span className="text-border hidden md:inline" aria-hidden="true">
            |
          </span>
          <span className="hidden md:inline tabular-nums">
            Avg CLV:{' '}
            <strong className="text-foreground">{formatCurrency(globalKpis.averageClv)}</strong>
          </span>
        </div>
      </motion.div>

      {/* KPI Summary Grid */}
      <motion.section variants={itemVariants} aria-label="Customer KPI Summary">
        <CustomerKpiCards
          kpis={globalKpis}
          filteredCount={totalItems}
          isFiltered={hasActiveFilters}
        />
      </motion.section>

      {/* Search & Filter Controls */}
      <motion.section variants={itemVariants} aria-label="Customer Directory Filters">
        <CustomerFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          segmentFilter={segmentFilter}
          onSegmentChange={setSegmentFilter}
          churnRiskFilter={churnRiskFilter}
          onChurnRiskChange={setChurnRiskFilter}
          clvTierFilter={clvTierFilter}
          onClvTierChange={setClvTierFilter}
          onResetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
          totalFiltered={totalItems}
          totalAll={globalKpis.totalCustomers}
        />
      </motion.section>

      {/* Customer Directory Data Table & Mobile Cards */}
      <motion.section
        variants={itemVariants}
        aria-label="Customer Directory Table"
        className="space-y-3"
      >
        {/* Desktop and Tablet View */}
        <div className="hidden sm:block">
          <CustomerTable
            customers={customers}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={setSort}
            onSelectCustomer={handleSelectCustomer}
            onResetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Mobile View Card List */}
        <div className="sm:hidden">
          {customers.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">No customers match your criteria.</p>
              {hasActiveFilters && (
                <div className="mt-3">
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    Reset All Filters
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <CustomerCardList customers={customers} onSelectCustomer={handleSelectCustomer} />
          )}
        </div>

        {/* Directory Pagination */}
        <CustomerPagination
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

export default CustomersPage
