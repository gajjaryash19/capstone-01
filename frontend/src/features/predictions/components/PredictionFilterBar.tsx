import { useState, useEffect } from 'react'
import { Search, X, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useDebounce } from '@/hooks/useDebounce'
import type { CustomerSegment } from '@/features/customers'
import type { PredictionTierFilter, DeltaFilter } from '../types'

interface PredictionFilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  segmentFilter: 'all' | CustomerSegment
  onSegmentChange: (segment: 'all' | CustomerSegment) => void
  tierFilter: PredictionTierFilter
  onTierChange: (tier: PredictionTierFilter) => void
  deltaFilter: DeltaFilter
  onDeltaChange: (delta: DeltaFilter) => void
  onResetFilters: () => void
  hasActiveFilters: boolean
  totalFiltered: number
  totalAll: number
}

const segmentOptions: { label: string; value: 'all' | CustomerSegment }[] = [
  { label: 'All Segments', value: 'all' },
  { label: 'Enterprise', value: 'Enterprise' },
  { label: 'Mid-Market', value: 'Mid-Market' },
  { label: 'Growth', value: 'Growth' },
  { label: 'Standard', value: 'Standard' },
]

const tierOptions: { label: string; value: PredictionTierFilter }[] = [
  { label: 'All Value Tiers', value: 'all' },
  { label: 'High Value (≥ $10k)', value: 'high' },
  { label: 'Mid Tier ($2.5k–$10k)', value: 'mid' },
  { label: 'Standard (< $2.5k)', value: 'standard' },
]

const deltaOptions: { label: string; value: DeltaFilter }[] = [
  { label: 'All Growth Trends', value: 'all' },
  { label: 'Projected Growth (+)', value: 'expansion' },
  { label: 'Projected Decline (–)', value: 'contraction' },
]

export function PredictionFilterBar({
  searchQuery,
  onSearchChange,
  segmentFilter,
  onSegmentChange,
  tierFilter,
  onTierChange,
  deltaFilter,
  onDeltaChange,
  onResetFilters,
  hasActiveFilters,
  totalFiltered,
  totalAll,
}: PredictionFilterBarProps) {
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
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-3.5 sm:p-4 shadow-2xs">
      {/* Search and Count Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search accounts by name, company, email, or ID..."
            aria-label="Search prediction records"
            className="pl-9 pr-8 h-9 text-xs bg-surface-elevated/70 border-border"
          />
          {localQuery && (
            <button
              type="button"
              onClick={() => {
                setLocalQuery('')
                onSearchChange('')
              }}
              aria-label="Clear search query"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground cursor-pointer transition-transform duration-100 active:scale-90"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
          <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
            Showing <strong className="text-foreground font-semibold">{totalFiltered}</strong> of{' '}
            <strong className="text-foreground font-semibold">{totalAll}</strong> accounts
          </span>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="h-8 gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer bg-surface-elevated border-border"
              aria-label="Reset all prediction filters"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-border/60">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mr-1 shrink-0">
          Filters:
        </span>

        {/* Segment Filter */}
        <div className="flex items-center">
          <select
            id="pred-segment-filter"
            aria-label="Filter by Customer Segment"
            value={segmentFilter}
            onChange={(e) => onSegmentChange(e.target.value as 'all' | CustomerSegment)}
            className="h-8 rounded-md border border-border bg-surface-elevated px-2.5 py-1 text-xs text-foreground shadow-2xs hover:border-border-strong focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            {segmentOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tier Filter */}
        <div className="flex items-center">
          <select
            id="pred-tier-filter"
            aria-label="Filter by Predicted CLV Tier"
            value={tierFilter}
            onChange={(e) => onTierChange(e.target.value as PredictionTierFilter)}
            className="h-8 rounded-md border border-border bg-surface-elevated px-2.5 py-1 text-xs text-foreground shadow-2xs hover:border-border-strong focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            {tierOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Delta Filter */}
        <div className="flex items-center">
          <select
            id="pred-delta-filter"
            aria-label="Filter by Projected Expansion Delta"
            value={deltaFilter}
            onChange={(e) => onDeltaChange(e.target.value as DeltaFilter)}
            className="h-8 rounded-md border border-border bg-surface-elevated px-2.5 py-1 text-xs text-foreground shadow-2xs hover:border-border-strong focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            {deltaOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
