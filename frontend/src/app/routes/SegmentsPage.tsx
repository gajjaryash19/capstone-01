import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { Download, Check, Info, Filter, X } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
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
        `valence_segment_analytics_${new Date().toISOString().slice(0, 10)}.csv`,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-5 sm:space-y-6 max-w-7xl mx-auto"
    >
      {/* Page Title & Context Header */}
      <PageHeader
        title="Customer Segmentation"
        description="Analyze cohort behavior, lifetime value concentration, and churn vulnerability across customer tiers."
        badge={
          <Badge variant="teal" dot className="shrink-0 font-medium">
            {analyticsData.summary.totalSegments} Cohorts • {analyticsData.summary.totalCustomers}{' '}
            Accounts • BG/NBD Baseline
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            {selectedSegment && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelectSegment(null)}
                className="gap-1.5 cursor-pointer text-xs"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Clear Selection</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCsv}
              className="gap-1.5 cursor-pointer text-xs"
              aria-label="Export segmentation metrics to CSV"
            >
              {exportSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Exported CSV</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Export Summary</span>
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
            Metrics, segment aggregations, and value distributions are calculated directly from
            centralized customer cohort data.
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground whitespace-nowrap hidden md:inline">
          Last calculated: Synchronized
        </span>
      </div>

      {/* Segment Summary KPI Cards */}
      <section aria-label="Segment KPI Summary">
        <SegmentSummaryCards summary={analyticsData.summary} selectedSegment={selectedSegment} />
      </section>

      {/* Cohort Quick-Filter Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 rounded-lg bg-card border border-border">
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter Cohort:</span>
          </div>

          <button
            type="button"
            onClick={() => handleSelectSegment(null)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer border ${
              selectedSegment === null
                ? 'bg-primary text-primary-foreground border-transparent font-semibold shadow-xs'
                : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
            }`}
          >
            All Cohorts ({analyticsData.summary.totalCustomers})
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
                    ? 'bg-primary text-primary-foreground border-transparent font-semibold shadow-xs'
                    : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                }`}
              >
                <span>{seg.name}</span>
                <span
                  className={`text-[10px] px-1 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-primary-foreground/20 text-primary-foreground'
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
              className="text-primary hover:underline text-xs cursor-pointer font-medium"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Analytical Visualizations (2x2 Grid) */}
      <section aria-label="Customer Segmentation Visualizations" className="space-y-4 sm:space-y-6">
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
      </section>

      {/* Segment Performance Comparison Table */}
      <section aria-label="Segment Performance Table">
        <SegmentPerformanceTable
          segments={analyticsData.segments}
          selectedSegment={selectedSegment}
          onSelectSegment={handleSelectSegment}
        />
      </section>

      {/* Selected Segment Drill-Down & Member Roster */}
      <section aria-label="Selected Segment Drill-Down">
        <SegmentDetailDrillDown
          selectedSegment={selectedSegment}
          segmentMetrics={selectedSegmentMetrics}
          customers={analyticsData.customers}
          onClearSelection={() => handleSelectSegment(null)}
        />
      </section>
    </motion.div>
  )
}

export default SegmentsPage
