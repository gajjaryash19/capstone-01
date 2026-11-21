import { memo, useState, useEffect } from 'react'
import { Search, X, RotateCcw, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useDebounce } from '@/hooks/useDebounce'
import type { CustomerSegmentFilter, ChurnRiskFilter, ClvTierFilter } from '../types'

interface CustomerFilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  segmentFilter: CustomerSegmentFilter
  onSegmentChange: (segment: CustomerSegmentFilter) => void
  churnRiskFilter: ChurnRiskFilter
  onChurnRiskChange: (risk: ChurnRiskFilter) => void
  clvTierFilter: ClvTierFilter
  onClvTierChange: (tier: ClvTierFilter) => void
  onResetFilters: () => void
  hasActiveFilters: boolean
  totalFiltered: number
  totalAll: number
}

const segmentOptions: { label: string; value: CustomerSegmentFilter }[] = [
  { label: 'All Segments', value: 'all' },
  { label: 'Enterprise', value: 'Enterprise' },
  { label: 'Mid-Market', value: 'Mid-Market' },
  { label: 'Growth', value: 'Growth' },
  { label: 'Standard', value: 'Standard' },
]

const riskOptions: { label: string; value: ChurnRiskFilter }[] = [
  { label: 'All Risk Levels', value: 'all' },
  { label: 'Low Risk (<30%)', value: 'low' },
  { label: 'Moderate (30–65%)', value: 'moderate' },
  { label: 'High Risk (>65%)', value: 'high' },
]

const clvTierOptions: { label: string; value: ClvTierFilter }[] = [
  { label: 'All Value Levels', value: 'all' },
  { label: 'High Value (≥ $10k)', value: 'high' },
  { label: 'Mid Tier ($2.5k–$10k)', value: 'mid' },
  { label: 'Standard (< $2.5k)', value: 'standard' },
]

function CustomerFilterBarComponent({
  searchQuery,
  onSearchChange,
  segmentFilter,
  onSegmentChange,
  churnRiskFilter,
  onChurnRiskChange,
  clvTierFilter,
  onClvTierChange,
  onResetFilters,
  hasActiveFilters,
  totalFiltered,
  totalAll,
}: CustomerFilterBarProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery)
  const debouncedQuery = useDebounce(localQuery, 150)

  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery)
    setLocalQuery(searchQuery)
  }

  useEffect(() => {
    if (debouncedQuery !== searchQuery) {
      onSearchChange(debouncedQuery)
    }
  }, [debouncedQuery, searchQuery, onSearchChange])

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 sm:p-4 shadow-xs min-w-0">
      {/* Top Row: Search and Active Results Counter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 min-w-0">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search customers by name, company, email, or ID..."
            aria-label="Search customer directory"
            className="pl-9 pr-8 h-9 text-xs bg-surface-elevated/40 border-border"
          />
          {localQuery && (
            <button
              type="button"
              onClick={() => {
                setLocalQuery('')
                onSearchChange('')
              }}
              aria-label="Clear search input"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-xs p-0.5 text-muted-foreground hover:text-foreground cursor-pointer transition-transform duration-100 active:scale-90"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Directory Count Summary & Filter Reset */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
          <span className="text-muted-foreground tabular-nums font-mono text-[11px]">
            Showing <strong className="text-foreground font-semibold">{totalFiltered}</strong> of{' '}
            <strong className="text-foreground font-semibold">{totalAll}</strong> accounts
          </span>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="h-8 gap-1.5 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer border-border-strong"
              aria-label="Reset all filters"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Row: Filter Selectors */}
      <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-border/60">
        <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider mr-1 shrink-0">
          <Filter className="h-3 w-3" />
          <span>Filters:</span>
        </span>

        {/* Segment Filter */}
        <div className="flex items-center">
          <select
            id="segment-filter"
            aria-label="Filter by Customer Segment"
            value={segmentFilter}
            onChange={(e) => onSegmentChange(e.target.value as CustomerSegmentFilter)}
            className="h-8 rounded-md border border-border bg-surface-elevated/60 px-2.5 py-1 text-xs text-foreground shadow-2xs hover:border-border-strong focus:outline-hidden focus:ring-1 focus:ring-ring cursor-pointer"
          >
            {segmentOptions.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-popover text-popover-foreground"
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Churn Risk Filter */}
        <div className="flex items-center">
          <select
            id="churn-risk-filter"
            aria-label="Filter by Churn Risk Level"
            value={churnRiskFilter}
            onChange={(e) => onChurnRiskChange(e.target.value as ChurnRiskFilter)}
            className="h-8 rounded-md border border-border bg-surface-elevated/60 px-2.5 py-1 text-xs text-foreground shadow-2xs hover:border-border-strong focus:outline-hidden focus:ring-1 focus:ring-ring cursor-pointer"
          >
            {riskOptions.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-popover text-popover-foreground"
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* CLV Tier Filter */}
        <div className="flex items-center">
          <select
            id="clv-tier-filter"
            aria-label="Filter by CLV Range"
            value={clvTierFilter}
            onChange={(e) => onClvTierChange(e.target.value as ClvTierFilter)}
            className="h-8 rounded-md border border-border bg-surface-elevated/60 px-2.5 py-1 text-xs text-foreground shadow-2xs hover:border-border-strong focus:outline-hidden focus:ring-1 focus:ring-ring cursor-pointer"
          >
            {clvTierOptions.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-popover text-popover-foreground"
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export const CustomerFilterBar = memo(CustomerFilterBarComponent)
export default CustomerFilterBar
