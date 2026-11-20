import { Search, X, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
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
  { label: 'All CLV Tiers', value: 'all' },
  { label: 'High Value (≥ $10k)', value: 'high' },
  { label: 'Mid Tier ($2.5k–$10k)', value: 'mid' },
  { label: 'Standard (< $2.5k)', value: 'standard' },
]

export function CustomerFilterBar({
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
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 sm:p-4 shadow-2xs">
      {/* Top Row: Search and Active State Counter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by customer name, email, company, or ID..."
            aria-label="Search customers"
            className="pl-9 pr-8 h-9 text-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search query"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Directory Count Summary & Reset */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
          <span className="text-muted-foreground tabular-nums">
            Showing <strong className="text-foreground font-semibold">{totalFiltered}</strong> of{' '}
            <strong className="text-foreground font-semibold">{totalAll}</strong> accounts
          </span>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="h-8 gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Reset all filters"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Row: Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mr-1 shrink-0">
          Filters:
        </span>

        {/* Segment Filter */}
        <div className="flex items-center">
          <select
            id="segment-filter"
            aria-label="Filter by Customer Segment"
            value={segmentFilter}
            onChange={(e) => onSegmentChange(e.target.value as CustomerSegmentFilter)}
            className="h-8 rounded-md border border-border bg-card px-2.5 py-1 text-xs text-foreground shadow-2xs hover:border-border-strong focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
          >
            {segmentOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
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
            className="h-8 rounded-md border border-border bg-card px-2.5 py-1 text-xs text-foreground shadow-2xs hover:border-border-strong focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
          >
            {riskOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
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
            className="h-8 rounded-md border border-border bg-card px-2.5 py-1 text-xs text-foreground shadow-2xs hover:border-border-strong focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
          >
            {clvTierOptions.map((opt) => (
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
