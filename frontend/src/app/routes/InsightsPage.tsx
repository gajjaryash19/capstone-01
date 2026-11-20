import { motion, useReducedMotion } from 'motion/react'
import { Download, Check, Info } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getStaggerContainer, getItemVariants } from '@/styles/motion'
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
  const shouldReduceMotion = useReducedMotion()
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

  const containerVariants = getStaggerContainer(shouldReduceMotion, 0.04)
  const itemVariants = getItemVariants(shouldReduceMotion)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* 1. Header with Data & Model Status Labels */}
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Insights & Recommendations"
          description="Key opportunities, retention risks, and recommended actions based on your customer value data."
          badge={
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="neutral" dot className="shrink-0 font-medium text-[11px]">
                Automated Analysis Active
              </Badge>
              <Badge
                variant="outline"
                className="shrink-0 text-muted-foreground font-mono text-[11px] bg-surface"
              >
                36 Customers Evaluated
              </Badge>
            </div>
          }
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCsv}
                className="gap-1.5 cursor-pointer text-xs h-8 bg-surface border-border text-foreground hover:bg-surface-elevated font-medium"
                aria-label="Export insights to CSV"
              >
                {exportSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-foreground" />
                    <span className="text-foreground font-medium">Exported CSV</span>
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

      {/* Evaluation Cohort Informational Callout */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-surface border border-border px-3.5 py-2.5 text-xs text-muted-foreground"
      >
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>
            <strong className="text-foreground font-medium">Demo Data:</strong> Insights and
            recommendations calculated from 36 sample customer accounts and CLV models.
          </span>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground/80 whitespace-nowrap hidden sm:inline">
          Automated Analysis
        </span>
      </motion.div>

      {/* 2. Top-Level Analytical KPI Summary */}
      <motion.section variants={itemVariants} aria-label="Key Analytical Indicators">
        <InsightKpiCards summary={kpiSummary} />
      </motion.section>

      {/* 3. Interactive Functional Filters */}
      <motion.section variants={itemVariants} aria-label="Insight Filters">
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
      </motion.section>

      {/* 4. Priority Business Insights */}
      <motion.div variants={itemVariants}>
        <PriorityInsightsSection
          insights={filteredInsights}
          onInspectRule={(insight) => setSelectedInsightModal(insight)}
        />
      </motion.div>

      {/* 5. Customer Retention Opportunities */}
      <motion.section variants={itemVariants} aria-label="Customer Retention Deep Dive">
        <RetentionOpportunitiesSection data={retentionOpportunities} />
      </motion.section>

      {/* 6. Segment Value Contribution & Skew */}
      <motion.section variants={itemVariants} aria-label="Segment Skew and Value Analysis">
        <SegmentInsightsSection segmentData={segmentComparisons} />
      </motion.section>

      {/* 7. Action Playbook Recommendations */}
      <motion.section variants={itemVariants} aria-label="Decision Action Playbooks">
        <ActionRecommendationsSection recommendations={filteredRecommendations} />
      </motion.section>

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
