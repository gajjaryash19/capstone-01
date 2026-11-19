import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { CustomerSegment } from '@/features/customers'
import type {
  PredictionSortField,
  SortDirection,
  PredictionTierFilter,
  DeltaFilter,
} from '../types'
import { MOCK_CUSTOMERS } from '@/features/customers'
import { enrichCustomerPredictions, calculatePredictionSummary } from '../predictionAnalytics'

const VALID_SEGMENTS: CustomerSegment[] = ['Enterprise', 'Mid-Market', 'Growth', 'Standard']
const VALID_TIERS: PredictionTierFilter[] = ['high', 'mid', 'standard']
const VALID_DELTAS: DeltaFilter[] = ['expansion', 'contraction']
const VALID_SORT_FIELDS: PredictionSortField[] = [
  'name',
  'segment',
  'predictedClv',
  'historicalRevenue',
  'valueDelta',
  'churnProbability',
]

export function usePredictionsDirectory(initialCustomers = MOCK_CUSTOMERS) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [exportSuccess, setExportSuccess] = useState(false)

  // Enriched records
  const allEnrichedCustomers = useMemo(
    () => enrichCustomerPredictions(initialCustomers),
    [initialCustomers],
  )

  // Search query
  const searchQuery = searchParams.get('q') || ''

  // Segment filter
  const rawSegment = searchParams.get('segment') as CustomerSegment | null
  const segmentFilter: 'all' | CustomerSegment =
    rawSegment && VALID_SEGMENTS.includes(rawSegment) ? rawSegment : 'all'

  // Tier filter
  const rawTier = searchParams.get('tier') as PredictionTierFilter | null
  const tierFilter: PredictionTierFilter =
    rawTier && VALID_TIERS.includes(rawTier) ? rawTier : 'all'

  // Delta filter
  const rawDelta = searchParams.get('delta') as DeltaFilter | null
  const deltaFilter: DeltaFilter = rawDelta && VALID_DELTAS.includes(rawDelta) ? rawDelta : 'all'

  // Sorting
  const rawSort = searchParams.get('sort') as PredictionSortField | null
  const sortField: PredictionSortField =
    rawSort && VALID_SORT_FIELDS.includes(rawSort) ? rawSort : 'predictedClv'

  const rawDir = searchParams.get('dir')
  const sortDirection: SortDirection = rawDir === 'asc' ? 'asc' : 'desc'

  // Pagination
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const pageSize = Math.max(1, parseInt(searchParams.get('size') || '10', 10) || 10)

  // Overall Global KPIs
  const globalKpis = useMemo(() => calculatePredictionSummary(initialCustomers), [initialCustomers])

  // Helper to update search params immutably
  const updateParams = useCallback(
    (updater: (prev: URLSearchParams) => void) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          updater(next)
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const handleSearchChange = useCallback(
    (query: string) => {
      updateParams((params) => {
        if (query.trim()) {
          params.set('q', query)
        } else {
          params.delete('q')
        }
        params.delete('page')
      })
    },
    [updateParams],
  )

  const handleSegmentChange = useCallback(
    (segment: 'all' | CustomerSegment) => {
      updateParams((params) => {
        if (segment !== 'all') {
          params.set('segment', segment)
        } else {
          params.delete('segment')
        }
        params.delete('page')
      })
    },
    [updateParams],
  )

  const handleTierChange = useCallback(
    (tier: PredictionTierFilter) => {
      updateParams((params) => {
        if (tier !== 'all') {
          params.set('tier', tier)
        } else {
          params.delete('tier')
        }
        params.delete('page')
      })
    },
    [updateParams],
  )

  const handleDeltaChange = useCallback(
    (delta: DeltaFilter) => {
      updateParams((params) => {
        if (delta !== 'all') {
          params.set('delta', delta)
        } else {
          params.delete('delta')
        }
        params.delete('page')
      })
    },
    [updateParams],
  )

  const handleResetFilters = useCallback(() => {
    updateParams((params) => {
      params.delete('q')
      params.delete('segment')
      params.delete('tier')
      params.delete('delta')
      params.delete('sort')
      params.delete('dir')
      params.delete('page')
    })
  }, [updateParams])

  const handleSort = useCallback(
    (field: PredictionSortField) => {
      updateParams((params) => {
        if (sortField === field) {
          const nextDir = sortDirection === 'asc' ? 'desc' : 'asc'
          params.set('dir', nextDir)
        } else {
          params.set('sort', field)
          const defaultDir = field === 'name' || field === 'segment' ? 'asc' : 'desc'
          params.set('dir', defaultDir)
        }
        params.delete('page')
      })
    },
    [sortField, sortDirection, updateParams],
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateParams((params) => {
        if (newPage > 1) {
          params.set('page', String(newPage))
        } else {
          params.delete('page')
        }
      })
    },
    [updateParams],
  )

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      updateParams((params) => {
        if (newSize !== 10) {
          params.set('size', String(newSize))
        } else {
          params.delete('size')
        }
        params.delete('page')
      })
    },
    [updateParams],
  )

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim().length > 0 ||
      segmentFilter !== 'all' ||
      tierFilter !== 'all' ||
      deltaFilter !== 'all'
    )
  }, [searchQuery, segmentFilter, tierFilter, deltaFilter])

  // Filtered dataset
  const filteredCustomers = useMemo(() => {
    return allEnrichedCustomers.filter((customer) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesName = customer.name.toLowerCase().includes(query)
        const matchesEmail = customer.email.toLowerCase().includes(query)
        const matchesId = customer.id.toLowerCase().includes(query)
        const matchesCompany = customer.company.toLowerCase().includes(query)
        if (!matchesName && !matchesEmail && !matchesId && !matchesCompany) {
          return false
        }
      }

      // Segment
      if (segmentFilter !== 'all' && customer.segment !== segmentFilter) {
        return false
      }

      // Tier
      if (tierFilter !== 'all') {
        if (tierFilter === 'high' && customer.predictedClv < 10000) return false
        if (
          tierFilter === 'mid' &&
          (customer.predictedClv < 2500 || customer.predictedClv >= 10000)
        )
          return false
        if (tierFilter === 'standard' && customer.predictedClv >= 2500) return false
      }

      // Delta
      if (deltaFilter !== 'all') {
        if (deltaFilter === 'expansion' && customer.valueDelta <= 0) return false
        if (deltaFilter === 'contraction' && customer.valueDelta > 0) return false
      }

      return true
    })
  }, [allEnrichedCustomers, searchQuery, segmentFilter, tierFilter, deltaFilter])

  // Sorted dataset
  const sortedCustomers = useMemo(() => {
    return [...filteredCustomers].sort((a, b) => {
      let comparison: number
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'segment':
          comparison = a.segment.localeCompare(b.segment)
          break
        case 'predictedClv':
          comparison = a.predictedClv - b.predictedClv
          break
        case 'historicalRevenue':
          comparison = a.historicalRevenue - b.historicalRevenue
          break
        case 'valueDelta':
          comparison = a.valueDelta - b.valueDelta
          break
        case 'churnProbability':
          comparison = a.churnProbability - b.churnProbability
          break
        default:
          comparison = 0
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredCustomers, sortField, sortDirection])

  // Pagination calculation
  const totalItems = sortedCustomers.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(page, totalPages)

  const paginatedCustomers = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return sortedCustomers.slice(start, start + pageSize)
  }, [sortedCustomers, safePage, pageSize])

  const startIndex = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1
  const endIndex = Math.min(safePage * pageSize, totalItems)

  // Filtered KPIs for context
  const filteredKpis = useMemo(
    () => calculatePredictionSummary(filteredCustomers),
    [filteredCustomers],
  )

  // CSV Export
  const exportToCsv = useCallback(() => {
    try {
      const headers = [
        'Customer ID',
        'Customer Name',
        'Company',
        'Email',
        'Segment',
        'Prediction Horizon',
        'Historical Spend ($)',
        'Predicted CLV ($)',
        'Projected Net Delta ($)',
        'Delta Share (%)',
        'Churn Risk Level',
        'Churn Probability (%)',
      ]

      const rows = sortedCustomers.map((c) => [
        `"${c.id}"`,
        `"${c.name}"`,
        `"${c.company}"`,
        `"${c.email}"`,
        `"${c.segment}"`,
        `"${c.predictionHorizon}"`,
        c.historicalRevenue,
        c.predictedClv,
        c.valueDelta,
        c.valueDeltaPercent.toFixed(1),
        `"${c.churnRisk.toUpperCase()}"`,
        (c.churnProbability * 100).toFixed(1),
      ])

      const dateStr = new Date().toISOString().slice(0, 10)
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [
          `# Capstone-1 CLV Intelligence Platform — Prediction Records Export`,
          `# Model: BG/NBD + Gamma-Gamma Probabilistic Baseline (v1.4-beta)`,
          `# Prediction Horizon: 12 Months Forward`,
          `# Export Date: ${new Date().toISOString()}`,
          `# Records: ${sortedCustomers.length} of ${initialCustomers.length}`,
          headers.join(','),
          ...rows.map((r) => r.join(',')),
        ].join('\n')

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', `clv-predictions-export-${dateStr}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 2500)
    } catch {
      // Graceful fallback
    }
  }, [sortedCustomers, initialCustomers.length])

  return {
    customers: paginatedCustomers,
    allFilteredCustomers: sortedCustomers,
    totalItems,
    totalPages,
    page: safePage,
    pageSize,
    startIndex,
    endIndex,
    globalKpis,
    filteredKpis,

    // Controls
    searchQuery,
    segmentFilter,
    tierFilter,
    deltaFilter,
    sortField,
    sortDirection,
    hasActiveFilters,
    exportSuccess,

    // Setters
    setSearchQuery: handleSearchChange,
    setSegmentFilter: handleSegmentChange,
    setTierFilter: handleTierChange,
    setDeltaFilter: handleDeltaChange,
    setSort: handleSort,
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    resetFilters: handleResetFilters,
    exportToCsv,
  }
}
