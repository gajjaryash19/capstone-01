import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { Download, Check, Info } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
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

  const handleSelectCustomer = (customer: CustomerRecord) => {
    navigate(`/customers/${customer.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Page Title & Context Header */}
      <PageHeader
        title="Customers"
        description="Explore customer value, behavior, and retention risk."
        badge={
          <Badge variant="teal" dot className="shrink-0 font-medium">
            {globalKpis.totalCustomers} Accounts • BG/NBD ML Cohort
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCsv}
              className="gap-1.5 cursor-pointer text-xs"
              aria-label="Export filtered customers to CSV"
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

      {/* Evaluation Environment Informational Callout */}
      <div className="flex items-center justify-between gap-3 rounded-md bg-muted/40 border border-border/70 px-3 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
          <span>
            <strong className="text-foreground font-medium">
              Deterministic Evaluation Cohort:
            </strong>{' '}
            Metrics and predictions are synthetically calculated for verification and testing.
          </span>
        </div>
        <span className="hidden md:inline font-mono text-[10px] text-muted-foreground/80 shrink-0">
          Cohort Size: {globalKpis.totalCustomers} | High-Value: {globalKpis.highValueCustomers}
        </span>
      </div>

      {/* KPI Summary Grid */}
      <section aria-label="Customer KPI Summary">
        <CustomerKpiCards
          kpis={globalKpis}
          filteredCount={totalItems}
          isFiltered={hasActiveFilters}
        />
      </section>

      {/* Search & Filter Controls */}
      <section aria-label="Customer Directory Filters">
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
      </section>

      {/* Customer Directory Data Table & Mobile Cards */}
      <section aria-label="Customer Directory Table" className="space-y-3">
        {/* Desktop and Tablet Table */}
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
            <div className="rounded-lg border border-border bg-card p-6 text-center text-xs text-muted-foreground">
              No customers match your criteria.
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
      </section>
    </motion.div>
  )
}

export default CustomersPage
