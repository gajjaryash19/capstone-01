import { motion } from 'motion/react'
import { Download, Check } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  useInsights,
  InsightKpiCards,
  InsightFilterBar,
  PriorityInsightsSection,
  RetentionOpportunitiesSection,
  SegmentInsightsSection,
  ActionRecommendationsSection,
  InsightDetailModal,
} from '@/features/insights'

export function InsightsPage() {
  const {
    allInsights,
    filteredInsights,
    filteredRecommendations,
    kpiSummary,
    segmentComparisons,
    retentionOpportunities,
    categoryFilter,
    priorityFilter,
    segmentFilter,
    searchQuery,
    hasActiveFilters,
    exportSuccess,
    selectedInsightModal,
    setCategoryFilter,
    setPriorityFilter,
    setSegmentFilter,
    setSearchQuery,
    resetFilters,
    exportToCsv,
    setSelectedInsightModal,
  } = useInsights()

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 max-w-7xl"
    >
      {/* 1. Header with Data & Model Status Labels */}
      <PageHeader
        title="Insights & Recommendations"
        description="Decision-oriented business observations, retention opportunities, and action playbooks derived deterministically from customer lifetime value forecasts and segment behaviors."
        badge={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="teal" dot className="shrink-0 font-medium text-[11px]">
              Deterministic Rule Engine Active
            </Badge>
            <Badge
              variant="outline"
              className="shrink-0 text-muted-foreground font-mono text-[11px]"
            >
              36 Customer Accounts Evaluated
            </Badge>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCsv}
              className="gap-1.5 cursor-pointer text-xs h-8"
              aria-label="Export insights to CSV"
            >
              {exportSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Exported CSV</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Insights Brief</span>
                </>
              )}
            </Button>
          </div>
        }
      />

      {/* 2. Top-Level Analytical KPI Summary */}
      <section aria-label="Key Analytical Indicators">
        <InsightKpiCards summary={kpiSummary} />
      </section>

      {/* 3. Interactive Functional Filters */}
      <section aria-label="Insight Filters">
        <InsightFilterBar
          categoryFilter={categoryFilter}
          priorityFilter={priorityFilter}
          segmentFilter={segmentFilter}
          searchQuery={searchQuery}
          totalCount={allInsights.length}
          filteredCount={filteredInsights.length}
          hasActiveFilters={hasActiveFilters}
          onCategoryChange={setCategoryFilter}
          onPriorityChange={setPriorityFilter}
          onSegmentChange={setSegmentFilter}
          onSearchChange={setSearchQuery}
          onResetFilters={resetFilters}
        />
      </section>

      {/* 4. Priority Business Insights */}
      <PriorityInsightsSection
        insights={filteredInsights}
        onInspectRule={(insight) => setSelectedInsightModal(insight)}
      />

      {/* 5. Customer Retention Opportunities */}
      <section aria-label="Customer Retention Deep Dive">
        <RetentionOpportunitiesSection data={retentionOpportunities} />
      </section>

      {/* 6. Segment Value Contribution & Skew */}
      <section aria-label="Segment Skew and Value Analysis">
        <SegmentInsightsSection segmentData={segmentComparisons} />
      </section>

      {/* 7. Action Playbook Recommendations */}
      <ActionRecommendationsSection recommendations={filteredRecommendations} />

      {/* 8. Mathematical Formula & Data Lineage Audit Modal */}
      <InsightDetailModal
        insight={selectedInsightModal}
        isOpen={Boolean(selectedInsightModal)}
        onClose={() => setSelectedInsightModal(null)}
      />
    </motion.div>
  )
}

export default InsightsPage
