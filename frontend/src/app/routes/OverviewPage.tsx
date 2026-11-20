import { useState, useMemo, useCallback } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { RefreshCw, Download, Check, Cpu } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getStaggerContainer, getItemVariants } from '@/styles/motion'
import {
  MOCK_CLV_OVERVIEW_DATA,
  OverviewFilterBar,
  ClvKpiGrid,
  ClvTrajectoryChart,
  ValueDistributionChart,
  SegmentHealthTable,
  ActionableInsightsCard,
  type TimeHorizon,
  type SegmentFilter,
  type OverviewKpi,
} from '@/features/clv-overview'

export function OverviewPage() {
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('12m')
  const [segmentFilter, setSegmentFilter] = useState<SegmentFilter>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('Just now')
  const [exportSuccess, setExportSuccess] = useState(false)

  const shouldReduceMotion = useReducedMotion()
  const data = MOCK_CLV_OVERVIEW_DATA

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      const now = new Date()
      setLastRefreshedTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      )
    }, 500)
  }, [])

  // Filter segments dynamically based on selected cohort tier
  const displayedSegments = useMemo(() => {
    if (segmentFilter === 'all') return data.segmentHealth
    return data.segmentHealth.filter((s) => {
      if (segmentFilter === 'enterprise') return s.tier.includes('Enterprise')
      if (segmentFilter === 'mid-market') return s.tier.includes('Mid-Market')
      if (segmentFilter === 'growth')
        return s.tier.includes('Growth') || s.tier.includes('Standard')
      return true
    })
  }, [segmentFilter, data.segmentHealth])

  // Filter insights dynamically based on selected cohort
  const displayedInsights = useMemo(() => {
    if (segmentFilter === 'all') return data.actionableInsights
    return data.actionableInsights.filter((item) => {
      if (segmentFilter === 'enterprise')
        return item.cohortTarget.includes('Tier 1') || item.type === 'opportunity'
      if (segmentFilter === 'mid-market')
        return item.cohortTarget.includes('Mid-Market') || item.type === 'risk'
      if (segmentFilter === 'growth')
        return item.cohortTarget.includes('Cohort') || item.type === 'optimization'
      return true
    })
  }, [segmentFilter, data.actionableInsights])

  // Slice trajectory dynamically based on time horizon
  const displayedTrajectory = useMemo(() => {
    switch (timeHorizon) {
      case '30d':
        return data.trajectory.filter((p) => ['M0', 'M3'].includes(p.month))
      case '90d':
        return data.trajectory.filter((p) => ['M0', 'M3', 'M6'].includes(p.month))
      case '12m':
        return data.trajectory.filter((p) => ['M0', 'M3', 'M6', 'M9', 'M12'].includes(p.month))
      case 'all':
      default:
        return data.trajectory
    }
  }, [timeHorizon, data.trajectory])

  // Dynamically update KPI card metrics based on Horizon and Segment selections
  const displayedKpis: OverviewKpi[] = useMemo(() => {
    return data.kpis.map((kpi) => {
      if (kpi.id === 'kpi-avg-clv') {
        if (segmentFilter === 'enterprise') {
          return {
            ...kpi,
            value: '$18,450',
            numericValue: 18450,
            change: '+18.4%',
            period: 'Enterprise Tier Benchmark',
            secondaryContext: 'Benchmark: $14,200 (+29.9% above peers)',
          }
        }
        if (segmentFilter === 'mid-market') {
          return {
            ...kpi,
            value: '$4,275',
            numericValue: 4275,
            change: '+7.8%',
            period: 'Mid-Market Tier Benchmark',
            secondaryContext: 'Benchmark: $3,900 (+9.6% above peers)',
          }
        }
        if (segmentFilter === 'growth') {
          return {
            ...kpi,
            value: '$1,820',
            numericValue: 1820,
            change: '+22.1%',
            period: 'Growth & Standard Benchmark',
            secondaryContext: 'Benchmark: $1,450 (+25.5% above peers)',
          }
        }
      }

      if (kpi.id === 'kpi-projected-ltv') {
        switch (timeHorizon) {
          case '30d':
            return {
              ...kpi,
              title: '30-Day Projected Revenue',
              value: '$1.19M',
              numericValue: 1190000,
              period: '30-day projected run-rate',
              secondaryContext: 'Active pool: 7,125 accounts (Month 1 pace)',
            }
          case '90d':
            return {
              ...kpi,
              title: '90-Day Projected Pipeline',
              value: '$3.57M',
              numericValue: 3570000,
              period: '90-day projected pipeline',
              secondaryContext: 'Active pool: 7,125 accounts (Quarterly horizon)',
            }
          case 'all':
            return {
              ...kpi,
              title: '36-Month Cumulative Lifespan',
              value: '$42.84M',
              numericValue: 42840000,
              period: '36-month cumulative lifespan',
              secondaryContext: 'Full customer lifespan trajectory ($14.28M × 3 yrs)',
            }
          case '12m':
          default:
            return {
              ...kpi,
              title: '12-Month Projected LTV Pipeline',
              value: '$14.28M',
              numericValue: 14280000,
              period: 'projected annualized run-rate',
              secondaryContext: 'Total active pool: 7,125 accounts (Year 1 pace)',
            }
        }
      }

      return kpi
    })
  }, [segmentFilter, timeHorizon, data.kpis])

  // Export current filtered dashboard matrix as clean CSV
  const handleExport = useCallback(() => {
    try {
      const headers = [
        'Cohort Name',
        'Classification',
        'Active Accounts',
        'Average Spend ($)',
        'Retention Rate (%)',
        'Churn Risk Profile',
        'CLV Growth',
      ]
      const rows = displayedSegments.map((s) => [
        `"${s.name}"`,
        `"${s.tier}"`,
        s.customerCount,
        s.averageSpend,
        s.retentionRate,
        `"${s.churnRisk}"`,
        `"${s.clvGrowth}"`,
      ])

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [
          `# Valora Customer Intelligence Summary Report (Horizon: ${timeHorizon.toUpperCase()} | Segment: ${segmentFilter.toUpperCase()})`,
          `# Generated: ${new Date().toISOString()}`,
          headers.join(','),
          ...rows.map((r) => r.join(',')),
        ].join('\n')

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', `clv-summary-${segmentFilter}-${timeHorizon}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 2500)
    } catch {
      // Fallback silently
    }
  }, [displayedSegments, timeHorizon, segmentFilter])

  const containerVariants = getStaggerContainer(shouldReduceMotion, 0.04)
  const itemVariants = getItemVariants(shouldReduceMotion)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-5 sm:space-y-6 min-w-0"
    >
      {/* Page Title & Context Header */}
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Customer Lifetime Value"
          description="Track lifetime value trends, retention rates, and revenue across customer segments."
          badge={
            <Badge variant="neutral" dot className="shrink-0 font-medium">
              Sample Data • BG/NBD Model
            </Badge>
          }
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <span className="hidden xl:inline text-[11px] text-muted-foreground mr-1 tabular-nums font-mono">
                Refreshed: {lastRefreshedTime}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                loading={isRefreshing}
                className="gap-1.5 cursor-pointer"
                aria-label="Refresh metrics"
              >
                {!isRefreshing && <RefreshCw className="h-3.5 w-3.5" />}
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-1.5 hidden sm:inline-flex cursor-pointer"
                aria-label="Export summary CSV"
              >
                {exportSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-foreground" />
                    <span>Exported CSV</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" />
                    <span>Export CSV</span>
                  </>
                )}
              </Button>
            </div>
          }
        />
      </motion.div>

      {/* Model & Evaluation Environment Bar */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 rounded-lg bg-surface-elevated/70 border border-border/80 px-3.5 py-2 text-xs text-muted-foreground"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Cpu className="h-3.5 w-3.5 text-foreground/80 shrink-0" />
          <span className="truncate">
            <strong className="text-foreground font-semibold">Demo Mode:</strong> Displaying sample
            customer metrics modeled with BG/NBD and Gamma-Gamma algorithms.
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
          <span className="tabular-nums">
            MAPE: <strong className="text-foreground">{data.modelMetadata.mapeAccuracy}</strong>
          </span>
          <span className="text-border" aria-hidden="true">
            |
          </span>
          <span className="tabular-nums">
            Cohort:{' '}
            <strong className="text-foreground">
              {data.modelMetadata.trainingCohortSize.toLocaleString()}
            </strong>
          </span>
          <span className="text-border hidden md:inline" aria-hidden="true">
            |
          </span>
          <span className="hidden md:inline text-muted-foreground">
            {data.modelMetadata.version}
          </span>
        </div>
      </motion.div>

      {/* Filter Controls: Time Horizon + Segment Cohort */}
      <motion.div variants={itemVariants}>
        <OverviewFilterBar
          timeHorizon={timeHorizon}
          onTimeHorizonChange={setTimeHorizon}
          segmentFilter={segmentFilter}
          onSegmentFilterChange={setSegmentFilter}
          modelVersion={data.modelMetadata.version}
          modelAccuracy={data.modelMetadata.mapeAccuracy}
        />
      </motion.div>

      {/* High-Level CLV Key Performance Indicators */}
      <motion.section variants={itemVariants} aria-label="Key Performance Indicators">
        <ClvKpiGrid kpis={displayedKpis} />
      </motion.section>

      {/* Primary Visualizations: Trajectory + Pareto Distribution */}
      <motion.div
        variants={itemVariants}
        className="grid gap-5 sm:gap-6 grid-cols-1 xl:grid-cols-3 min-w-0"
      >
        <ClvTrajectoryChart data={displayedTrajectory} />
        <ValueDistributionChart tiers={data.tierDistribution} />
      </motion.div>

      {/* Operational Matrix: Segment Health + Actionable Decisions */}
      <motion.div
        variants={itemVariants}
        className="grid gap-5 sm:gap-6 grid-cols-1 xl:grid-cols-3 min-w-0 items-start"
      >
        <SegmentHealthTable segments={displayedSegments} />
        <ActionableInsightsCard insights={displayedInsights} />
      </motion.div>
    </motion.div>
  )
}

export default OverviewPage
