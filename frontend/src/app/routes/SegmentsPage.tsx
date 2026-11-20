import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { Download, Check, Info, Filter, X } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { getStaggerContainer, getItemVariants } from '@/styles/motion'
import {
  calculateSegmentAnalytics,
  SegmentSummaryCards,
  SegmentDistributionChart,
  SegmentRevenueContributionChart,
  SegmentClvComparisonChart,
  SegmentRiskComparisonChart,
  SegmentPerformanceTable,
  SegmentDetailDrillDown,
  type CustomerSegment,
} from '@/features/customer-segments'
import { MOCK_CUSTOMERS } from '@/features/customers/mockData'

const VALID_SEGMENTS: CustomerSegment[] = ['Enterprise', 'Mid-Market', 'Growth', 'Standard']

export function SegmentsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [exportSuccess, setExportSuccess] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  // Pure deterministic calculations separate from UI
  const analyticsData = useMemo(() => calculateSegmentAnalytics(MOCK_CUSTOMERS), [])

  // Sync selected segment with URL query params: ?segment=Enterprise
  const rawSegment = searchParams.get('segment') as CustomerSegment | null
  const selectedSegment: CustomerSegment | null =
    rawSegment && VALID_SEGMENTS.includes(rawSegment) ? rawSegment : null

  const handleSelectSegment = useCallback(
    (segment: CustomerSegment | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (segment && VALID_SEGMENTS.includes(segment)) {
            next.set('segment', segment)
          } else {
            next.delete('segment')
          }
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const selectedSegmentMetrics = useMemo(() => {
    if (!selectedSegment) return undefined
    return analyticsData.segments.find((s) => s.name === selectedSegment)
  }, [selectedSegment, analyticsData.segments])

  // Export CSV summary of segmentation metrics
  const exportToCsv = useCallback(() => {
    try {
      const headers = [
        'Segment Name',
        'Customer Count',
        'Customer Share (%)',
        'Avg Predicted CLV ($)',
        'Total Predicted CLV ($)',
        'CLV Share (%)',
        'Historical Revenue ($)',
        'Revenue Share (%)',
        'Avg Historical Revenue ($)',
        'Total Orders',
        'Avg Orders / Acct',
        'Avg Order Value ($)',
        'Low Risk Count',
        'Moderate Risk Count',
        'High Risk Count',
        'High Risk Share (%)',
        'Status',
      ]

      const rows = analyticsData.segments.map((seg) => [
        `"${seg.name}"`,
        seg.customerCount,
        seg.customerShare,
        seg.averageClv,
        seg.totalClv,
        seg.clvShare,
        seg.totalHistoricalRevenue,
        seg.revenueShare,
        seg.averageHistoricalRevenue,
        seg.totalOrders,
        seg.averageOrders,
        seg.averageOrderValue,
        seg.churnRiskDistribution.low,
        seg.churnRiskDistribution.moderate,
        seg.churnRiskDistribution.high,
        seg.highRiskPercentage,
        `"${seg.status}"`,
      ])

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute(
        'download',
        `valora_segment_analytics_${new Date().toISOString().slice(0, 10)}.csv`,
      )
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 2500)
    } catch (err) {
      console.error('Failed to export CSV:', err)
    }
  }, [analyticsData.segments])

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
          title="Customer Segments"
          description="Compare customer groups by size, lifetime value, and churn risk."
          badge={
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground bg-surface px-2.5 py-1 rounded-md border border-border">
                {analyticsData.summary.totalSegments} Segments •{' '}
                {analyticsData.summary.totalCustomers} Customers
              </span>
              <span className="font-mono text-xs text-foreground/80 bg-surface-elevated px-2 py-0.5 rounded border border-border">
                BG/NBD Baseline
              </span>
            </div>
          }
          actions={
            <div className="flex items-center gap-2">
              {selectedSegment && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectSegment(null)}
                  className="gap-1.5 cursor-pointer text-xs h-8 bg-surface border-border"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Clear Selection</span>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCsv}
                className="gap-1.5 cursor-pointer text-xs h-8 bg-surface border-border"
                aria-label="Export segmentation metrics to CSV"
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

      {/* Evaluation Environment Informational Callout */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-surface border border-border px-3.5 py-2.5 text-xs text-muted-foreground"
      >
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>
            <strong className="text-foreground font-medium">Demo Data:</strong> Metrics and segment
            distributions are calculated across 36 customer accounts.
          </span>
        </div>
      </motion.div>

      {/* Segment Summary KPI Cards */}
      <motion.section variants={itemVariants} aria-label="Segment KPI Summary">
        <SegmentSummaryCards summary={analyticsData.summary} selectedSegment={selectedSegment} />
      </motion.section>

      {/* Cohort Quick-Filter Pill Bar */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 rounded-lg bg-surface border border-border"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Segment:</span>
          </div>

          <button
            type="button"
            onClick={() => handleSelectSegment(null)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer border ${
              selectedSegment === null
                ? 'bg-foreground text-background font-semibold border-transparent shadow-xs'
                : 'bg-surface-elevated text-muted-foreground border-border hover:bg-muted hover:text-foreground'
            }`}
          >
            All ({analyticsData.summary.totalCustomers})
          </button>

          {analyticsData.segments.map((seg) => {
            const isSelected = selectedSegment === seg.name
            return (
              <button
                key={seg.name}
                type="button"
                onClick={() => handleSelectSegment(isSelected ? null : seg.name)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-foreground text-background font-semibold border-transparent shadow-xs'
                    : 'bg-surface-elevated text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                }`}
              >
                <span>{seg.name}</span>
                <span
                  className={`text-[10px] font-mono px-1 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-background/20 text-background'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {seg.customerCount}
                </span>
              </button>
            )
          })}
        </div>

        {selectedSegment && (
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span>
              Highlighting <strong>{selectedSegment}</strong> (
              {selectedSegmentMetrics?.customerCount} accounts)
            </span>
            <button
              type="button"
              onClick={() => handleSelectSegment(null)}
              className="text-foreground hover:underline text-xs cursor-pointer font-medium ml-1"
            >
              Reset
            </button>
          </div>
        )}
      </motion.div>

      {/* Analytical Visualizations (2x2 Grid) */}
      <motion.section
        variants={itemVariants}
        aria-label="Customer Segmentation Visualizations"
        className="space-y-4 sm:space-y-6"
      >
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Chart 1: Customer Base Distribution */}
          <SegmentDistributionChart
            segments={analyticsData.segments}
            selectedSegment={selectedSegment}
            onSelectSegment={handleSelectSegment}
          />

          {/* Chart 2: Revenue Contribution vs Customer Share (Pareto) */}
          <SegmentRevenueContributionChart
            segments={analyticsData.segments}
            selectedSegment={selectedSegment}
            onSelectSegment={handleSelectSegment}
          />

          {/* Chart 3: CLV Valuation & Historical Spend */}
          <SegmentClvComparisonChart
            segments={analyticsData.segments}
            selectedSegment={selectedSegment}
            onSelectSegment={handleSelectSegment}
          />

          {/* Chart 4: Churn Risk Profile Distribution */}
          <SegmentRiskComparisonChart
            segments={analyticsData.segments}
            selectedSegment={selectedSegment}
            onSelectSegment={handleSelectSegment}
          />
        </div>
      </motion.section>

      {/* Segment Performance Comparison Table */}
      <motion.section variants={itemVariants} aria-label="Segment Performance Table">
        <SegmentPerformanceTable
          segments={analyticsData.segments}
          selectedSegment={selectedSegment}
          onSelectSegment={handleSelectSegment}
        />
      </motion.section>

      {/* Selected Segment Drill-Down & Member Roster */}
      <motion.section variants={itemVariants} aria-label="Selected Segment Drill-Down">
        <SegmentDetailDrillDown
          selectedSegment={selectedSegment}
          segmentMetrics={selectedSegmentMetrics}
          customers={analyticsData.customers}
          onClearSelection={() => handleSelectSegment(null)}
        />
      </motion.section>
    </motion.div>
  )
}

export default SegmentsPage
