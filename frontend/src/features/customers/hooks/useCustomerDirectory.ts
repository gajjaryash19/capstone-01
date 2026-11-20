import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import type {
  CustomerRecord,
  CustomerSegmentFilter,
  ChurnRiskFilter,
  ClvTierFilter,
  CustomerSortField,
  SortDirection,
} from '../types'
import { MOCK_CUSTOMERS, calculateCustomerKpis } from '../mockData'

const RISK_WEIGHTS: Record<string, number> = {
  low: 1,
  moderate: 2,
  high: 3,
}

const VALID_SEGMENTS: CustomerSegmentFilter[] = ['Enterprise', 'Mid-Market', 'Growth', 'Standard']
const VALID_RISKS: ChurnRiskFilter[] = ['low', 'moderate', 'high']
const VALID_TIERS: ClvTierFilter[] = ['high', 'mid', 'standard']
const VALID_SORT_FIELDS: CustomerSortField[] = [
  'name',
  'segment',
  'predictedClv',
  'historicalRevenue',
  'totalOrders',
  'averageOrderValue',
  'lastPurchaseDate',
  'churnRisk',
]

export function useCustomerDirectory(initialCustomers: CustomerRecord[] = MOCK_CUSTOMERS) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [exportSuccess, setExportSuccess] = useState(false)

  // Read state from URL query parameters (with fallback to defaults)
  const searchQuery = searchParams.get('q') || ''

  const rawSegment = searchParams.get('segment') as CustomerSegmentFilter | null
  const segmentFilter: CustomerSegmentFilter =
    rawSegment && VALID_SEGMENTS.includes(rawSegment) ? rawSegment : 'all'

  const rawRisk = searchParams.get('risk') as ChurnRiskFilter | null
  const churnRiskFilter: ChurnRiskFilter =
    rawRisk && VALID_RISKS.includes(rawRisk) ? rawRisk : 'all'

  const rawTier = searchParams.get('tier') as ClvTierFilter | null
  const clvTierFilter: ClvTierFilter = rawTier && VALID_TIERS.includes(rawTier) ? rawTier : 'all'

  const rawSort = searchParams.get('sort') as CustomerSortField | null
  const sortField: CustomerSortField =
    rawSort && VALID_SORT_FIELDS.includes(rawSort) ? rawSort : 'predictedClv'

  const rawDir = searchParams.get('dir')
  const sortDirection: SortDirection = rawDir === 'asc' ? 'asc' : 'desc'

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const pageSize = Math.max(1, parseInt(searchParams.get('size') || '10', 10) || 10)

  const selectedCustomerId = searchParams.get('customerId')
  const selectedCustomer = useMemo(() => {
    if (!selectedCustomerId) return null
    return initialCustomers.find((c) => c.id === selectedCustomerId) || null
  }, [selectedCustomerId, initialCustomers])

  // Centralized dataset KPIs
  const globalKpis = useMemo(() => calculateCustomerKpis(initialCustomers), [initialCustomers])

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
    (segment: CustomerSegmentFilter) => {
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

  const handleChurnRiskChange = useCallback(
    (risk: ChurnRiskFilter) => {
      updateParams((params) => {
        if (risk !== 'all') {
          params.set('risk', risk)
        } else {
          params.delete('risk')
        }
        params.delete('page')
      })
    },
    [updateParams],
  )

  const handleClvTierChange = useCallback(
    (tier: ClvTierFilter) => {
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

  const handleResetFilters = useCallback(() => {
    updateParams((params) => {
      params.delete('q')
      params.delete('segment')
      params.delete('risk')
      params.delete('tier')
      params.delete('sort')
      params.delete('dir')
      params.delete('page')
    })
  }, [updateParams])

  const handleSort = useCallback(
    (field: CustomerSortField) => {
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

  const handleSelectCustomer = useCallback(
    (customer: CustomerRecord | null) => {
      updateParams((params) => {
        if (customer) {
          params.set('customerId', customer.id)
        } else {
          params.delete('customerId')
        }
      })
    },
    [updateParams],
  )

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim().length > 0 ||
      segmentFilter !== 'all' ||
      churnRiskFilter !== 'all' ||
      clvTierFilter !== 'all'
    )
  }, [searchQuery, segmentFilter, churnRiskFilter, clvTierFilter])

  // Filtered dataset
  const filteredCustomers = useMemo(() => {
    return initialCustomers.filter((customer) => {
      // Search filter (name, email, id, company)
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

      // Segment filter
      if (segmentFilter !== 'all' && customer.segment !== segmentFilter) {
        return false
      }

      // Churn risk filter
      if (churnRiskFilter !== 'all' && customer.churnRisk !== churnRiskFilter) {
        return false
      }

      // CLV Tier filter
      if (clvTierFilter !== 'all') {
        if (clvTierFilter === 'high' && customer.predictedClv < 10000) return false
        if (
          clvTierFilter === 'mid' &&
          (customer.predictedClv < 2500 || customer.predictedClv >= 10000)
        )
          return false
        if (clvTierFilter === 'standard' && customer.predictedClv >= 2500) return false
      }

      return true
    })
  }, [initialCustomers, searchQuery, segmentFilter, churnRiskFilter, clvTierFilter])

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
        case 'totalOrders':
          comparison = a.totalOrders - b.totalOrders
          break
        case 'averageOrderValue':
          comparison = a.averageOrderValue - b.averageOrderValue
          break
        case 'lastPurchaseDate':
          comparison = a.lastPurchaseDate.localeCompare(b.lastPurchaseDate)
          break
        case 'churnRisk':
          comparison = (RISK_WEIGHTS[a.churnRisk] ?? 0) - (RISK_WEIGHTS[b.churnRisk] ?? 0)
          break
        default:
          comparison = 0
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredCustomers, sortField, sortDirection])

  // Paginated records
  const totalItems = sortedCustomers.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(page, totalPages)

  const paginatedCustomers = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return sortedCustomers.slice(start, start + pageSize)
  }, [sortedCustomers, safePage, pageSize])

  const startIndex = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1
  const endIndex = Math.min(safePage * pageSize, totalItems)

  // Filtered dataset KPIs for immediate context
  const filteredKpis = useMemo(() => calculateCustomerKpis(filteredCustomers), [filteredCustomers])

  // Export filtered dataset to CSV
  const exportToCsv = useCallback(() => {
    try {
      const headers = [
        'Customer ID',
        'Customer Name',
        'Email',
        'Company',
        'Segment',
        'Predicted CLV ($)',
        'Historical Revenue ($)',
        'Total Orders',
        'Average Order Value ($)',
        'Last Purchase Date',
        'Churn Risk Level',
        'Churn Probability (%)',
        'Status',
      ]

      const rows = sortedCustomers.map((c) => [
        `"${c.id}"`,
        `"${c.name}"`,
        `"${c.email}"`,
        `"${c.company}"`,
        `"${c.segment}"`,
        c.predictedClv,
        c.historicalRevenue,
        c.totalOrders,
        c.averageOrderValue.toFixed(2),
        `"${c.lastPurchaseDate}"`,
        `"${c.churnRisk.toUpperCase()}"`,
        (c.churnProbability * 100).toFixed(1),
        `"${c.status}"`,
      ])

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [
          `# Valora Customer Directory Export`,
          `# Generated: ${new Date().toISOString()}`,
          `# Active Filter Count: ${sortedCustomers.length} of ${initialCustomers.length}`,
          headers.join(','),
          ...rows.map((r) => r.join(',')),
        ].join('\n')

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute(
        'download',
        `clv-customers-export-${new Date().toISOString().slice(0, 10)}.csv`,
      )
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
    // Data
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
    churnRiskFilter,
    clvTierFilter,
    sortField,
    sortDirection,
    hasActiveFilters,
    selectedCustomer,
    exportSuccess,

    // Actions
    setSearchQuery: handleSearchChange,
    setSegmentFilter: handleSegmentChange,
    setChurnRiskFilter: handleChurnRiskChange,
    setClvTierFilter: handleClvTierChange,
    setSort: handleSort,
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    resetFilters: handleResetFilters,
    setSelectedCustomer: handleSelectCustomer,
    exportToCsv,
  }
}
