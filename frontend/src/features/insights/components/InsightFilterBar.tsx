import { Search, X, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { InsightCategory, InsightPriority, InsightSegmentFilter } from '../types'

interface InsightFilterBarProps {
  categoryFilter: InsightCategory
  priorityFilter: InsightPriority
  segmentFilter: InsightSegmentFilter
  searchQuery: string
  totalCount: number
  filteredCount: number
  hasActiveFilters: boolean
  onCategoryChange: (category: InsightCategory) => void
  onPriorityChange: (priority: InsightPriority) => void
  onSegmentChange: (segment: InsightSegmentFilter) => void
  onSearchChange: (query: string) => void
  onResetFilters: () => void
}

const CATEGORY_TABS: Array<{ id: InsightCategory; label: string }> = [
  { id: 'all', label: 'All Signals' },
  { id: 'retention', label: 'Retention Risk' },
  { id: 'segment', label: 'Segment Skew' },
  { id: 'growth', label: 'Expansion' },
  { id: 'efficiency', label: 'Efficiency' },
]

const PRIORITY_OPTIONS: Array<{ id: InsightPriority; label: string }> = [
  { id: 'all', label: 'All Priorities' },
  { id: 'high', label: 'High Priority' },
  { id: 'medium', label: 'Medium Priority' },
  { id: 'low', label: 'Low Priority' },
]

const SEGMENT_OPTIONS: Array<{ id: InsightSegmentFilter; label: string }> = [
  { id: 'all', label: 'All Segments' },
  { id: 'Enterprise', label: 'Enterprise' },
  { id: 'Mid-Market', label: 'Mid-Market' },
  { id: 'Growth', label: 'Growth' },
  { id: 'Standard', label: 'Standard' },
]

export function InsightFilterBar({
  categoryFilter,
  priorityFilter,
  segmentFilter,
  searchQuery,
  totalCount,
  filteredCount,
  hasActiveFilters,
  onCategoryChange,
  onPriorityChange,
  onSegmentChange,
  onSearchChange,
  onResetFilters,
}: InsightFilterBarProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3.5 sm:p-4 space-y-3 shadow-2xs">
      {/* Search and Secondary Filter Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search signals, rules, observations, or accounts..."
            className="pl-9 pr-8 h-9 text-xs bg-surface-elevated/70 border-border"
            aria-label="Search insights"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5 transition-transform duration-100 active:scale-90"
              aria-label="Clear search text"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="insight-priority-filter"
            className="text-xs text-muted-foreground shrink-0 font-medium hidden sm:inline"
          >
            Priority:
          </label>
          <select
            id="insight-priority-filter"
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value as InsightPriority)}
            className="h-9 rounded-md border border-border bg-surface-elevated px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            aria-label="Filter by priority"
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Segment Filter */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="insight-segment-filter"
            className="text-xs text-muted-foreground shrink-0 font-medium hidden sm:inline"
          >
            Segment:
          </label>
          <select
            id="insight-segment-filter"
            value={segmentFilter}
            onChange={(e) => onSegmentChange(e.target.value as InsightSegmentFilter)}
            className="h-9 rounded-md border border-border bg-surface-elevated px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            aria-label="Filter by customer segment"
          >
            {SEGMENT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="gap-1 text-xs h-9 cursor-pointer bg-surface-elevated border-border text-muted-foreground hover:text-foreground"
            aria-label="Reset all filters"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </Button>
        )}
      </div>

      {/* Category Tabs & Active Count Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-border/60">
        <div className="flex flex-wrap items-center gap-1.5" role="tablist">
          {CATEGORY_TABS.map((tab) => {
            const isActive = categoryFilter === tab.id
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onCategoryChange(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ease-out active:scale-[0.97] cursor-pointer border ${
                  isActive
                    ? 'bg-foreground text-background font-semibold border-transparent shadow-xs'
                    : 'bg-surface-elevated text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="text-[11px] font-mono text-muted-foreground text-right tabular-nums">
          Showing <strong className="text-foreground">{filteredCount}</strong> of{' '}
          <strong className="text-foreground">{totalCount}</strong> active signals
        </div>
      </div>
    </div>
  )
}
