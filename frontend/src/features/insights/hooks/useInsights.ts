import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MOCK_CUSTOMERS } from '@/features/customers/mockData'
import type { CustomerRecord } from '@/features/customers/types'
import {
  generateInsights,
  generateRecommendations,
  calculateInsightKpis,
  calculateSegmentValueComparison,
  getRetentionOpportunities,
} from '../insightsAnalytics'
import type {
  BusinessInsight,
  InsightCategory,
  InsightPriority,
  InsightSegmentFilter,
} from '../types'

const VALID_CATEGORIES: InsightCategory[] = ['all', 'retention', 'segment', 'growth', 'efficiency']
const VALID_PRIORITIES: InsightPriority[] = ['all', 'high', 'medium', 'low']
const VALID_SEGMENTS: InsightSegmentFilter[] = [
  'all',
  'Enterprise',
  'Mid-Market',
  'Growth',
  'Standard',
]

export function useInsights(initialCustomers: CustomerRecord[] = MOCK_CUSTOMERS) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [exportSuccess, setExportSuccess] = useState(false)
  const [selectedInsightModal, setSelectedInsightModal] = useState<BusinessInsight | null>(null)

  // URL state bindings
  const rawCategory = searchParams.get('category') as InsightCategory | null
  const categoryFilter: InsightCategory =
    rawCategory && VALID_CATEGORIES.includes(rawCategory) ? rawCategory : 'all'

  const rawPriority = searchParams.get('priority') as InsightPriority | null
  const priorityFilter: InsightPriority =
    rawPriority && VALID_PRIORITIES.includes(rawPriority) ? rawPriority : 'all'

  const rawSegment = searchParams.get('segment') as InsightSegmentFilter | null
  const segmentFilter: InsightSegmentFilter =
    rawSegment && VALID_SEGMENTS.includes(rawSegment) ? rawSegment : 'all'

  const searchQuery = searchParams.get('q') || ''

  // Deterministic computations
  const allInsights = useMemo(() => generateInsights(initialCustomers), [initialCustomers])
  const allRecommendations = useMemo(
    () => generateRecommendations(initialCustomers),
    [initialCustomers],
  )
  const kpiSummary = useMemo(
    () => calculateInsightKpis(allInsights, initialCustomers),
    [allInsights, initialCustomers],
  )
  const segmentComparisons = useMemo(
    () => calculateSegmentValueComparison(initialCustomers),
    [initialCustomers],
  )
  const retentionOpportunities = useMemo(
    () => getRetentionOpportunities(initialCustomers),
    [initialCustomers],
  )

  // Filter setters that sync with URL params
  const setCategoryFilter = useCallback(
    (category: InsightCategory) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (category && category !== 'all') {
            next.set('category', category)
          } else {
            next.delete('category')
          }
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setPriorityFilter = useCallback(
    (priority: InsightPriority) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (priority && priority !== 'all') {
            next.set('priority', priority)
          } else {
            next.delete('priority')
          }
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setSegmentFilter = useCallback(
    (segment: InsightSegmentFilter) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (segment && segment !== 'all') {
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

  const setSearchQuery = useCallback(
    (query: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (query.trim()) {
            next.set('q', query.trim())
          } else {
            next.delete('q')
          }
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const resetFilters = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete('category')
        next.delete('priority')
        next.delete('segment')
        next.delete('q')
        return next
      },
      { replace: true },
    )
  }, [setSearchParams])

  const hasActiveFilters =
    categoryFilter !== 'all' ||
    priorityFilter !== 'all' ||
    segmentFilter !== 'all' ||
    Boolean(searchQuery)

  // Filtered Insights
  const filteredInsights = useMemo(() => {
    return allInsights.filter((insight) => {
      if (categoryFilter !== 'all' && insight.category !== categoryFilter) return false
      if (priorityFilter !== 'all' && insight.priority !== priorityFilter) return false
      if (
        segmentFilter !== 'all' &&
        insight.segment !== segmentFilter &&
        insight.segment !== 'All Segments'
      ) {
        return false
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = insight.title.toLowerCase().includes(query)
        const matchesObs = insight.supportingObservation.toLowerCase().includes(query)
        const matchesImp = insight.businessImplication.toLowerCase().includes(query)
        const matchesRule = insight.ruleName.toLowerCase().includes(query)
        if (!matchesTitle && !matchesObs && !matchesImp && !matchesRule) return false
      }
      return true
    })
  }, [allInsights, categoryFilter, priorityFilter, segmentFilter, searchQuery])

  // Filtered Recommendations
  const filteredRecommendations = useMemo(() => {
    return allRecommendations.filter((rec) => {
      if (categoryFilter !== 'all') {
        if (categoryFilter === 'retention' && rec.category !== 'retention') return false
        if (categoryFilter === 'growth' && rec.category !== 'growth') return false
        if (categoryFilter === 'efficiency' && rec.category !== 'efficiency') return false
        if (categoryFilter === 'segment' && rec.category !== 'loyalty') return false
      }
      if (priorityFilter !== 'all' && rec.priority !== priorityFilter) return false
      if (
        segmentFilter !== 'all' &&
        rec.affectedSegment &&
        rec.affectedSegment !== segmentFilter &&
        rec.affectedSegment !== 'All Segments'
      ) {
        return false
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = rec.title.toLowerCase().includes(query)
        const matchesTarget = rec.targetAudience.toLowerCase().includes(query)
        const matchesTrigger = rec.dataTrigger.toLowerCase().includes(query)
        if (!matchesTitle && !matchesTarget && !matchesTrigger) return false
      }
      return true
    })
  }, [allRecommendations, categoryFilter, priorityFilter, segmentFilter, searchQuery])

  // Export to CSV
  const exportToCsv = useCallback(() => {
    try {
      const headers = [
        'Insight ID',
        'Title',
        'Category',
        'Priority',
        'Target Segment',
        'Supporting Observation',
        'Business Implication',
        'Suggested Action',
        'Rule Name',
        'Rule Formula',
        'Estimated Impact',
        'Generation Type',
      ]

      const rows = filteredInsights.map((i) => [
        `"${i.id}"`,
        `"${i.title.replace(/"/g, '""')}"`,
        `"${i.category}"`,
        `"${i.priority}"`,
        `"${i.segment}"`,
        `"${i.supportingObservation.replace(/"/g, '""')}"`,
        `"${i.businessImplication.replace(/"/g, '""')}"`,
        `"${i.suggestedAction.replace(/"/g, '""')}"`,
        `"${i.ruleName.replace(/"/g, '""')}"`,
        `"${i.ruleFormula.replace(/"/g, '""')}"`,
        `"${i.impactEstimate.replace(/"/g, '""')}"`,
        `"${i.generationType}"`,
      ])

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute(
        'download',
        `clv-insights-recommendations-${new Date().toISOString().split('T')[0]}.csv`,
      )
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 3000)
    } catch {
      setExportSuccess(false)
    }
  }, [filteredInsights])

  return {
    allInsights,
    filteredInsights,
    allRecommendations,
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
  }
}
