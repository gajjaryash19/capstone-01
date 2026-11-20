import { Search, X, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
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
    <div className="rounded-lg border border-border bg-card p-3.5 sm:p-4 space-y-3 shadow-2xs">
      {/* Search and Secondary Filter Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search insights, observations, rules, or accounts..."
            className="pl-8 pr-8 h-9 text-xs"
            aria-label="Search insights"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Clear search text"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="priority-filter"
            className="text-xs text-muted-foreground shrink-0 font-medium hidden sm:inline"
          >
            Priority:
          </label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value as InsightPriority)}
            className="h-9 rounded-md border border-input bg-card px-2.5 py-1 text-xs text-foreground focus:border-ring focus:outline-hidden cursor-pointer"
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
            htmlFor="segment-filter"
            className="text-xs text-muted-foreground shrink-0 font-medium hidden sm:inline"
          >
            Segment:
          </label>
          <select
            id="segment-filter"
            value={segmentFilter}
            onChange={(e) => onSegmentChange(e.target.value as InsightSegmentFilter)}
            className="h-9 rounded-md border border-input bg-card px-2.5 py-1 text-xs text-foreground focus:border-ring focus:outline-hidden cursor-pointer"
            aria-label="Filter by customer segment"
          >
            {SEGMENT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-9 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
            aria-label="Reset all filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>

      {/* Category Pills and Count Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-border/60">
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="tablist"
          aria-label="Insight category tabs"
        >
          {CATEGORY_TABS.map((tab) => {
            const isActive = categoryFilter === tab.id
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onCategoryChange(tab.id)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors font-medium cursor-pointer ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Badge variant="outline" className="text-[11px] font-mono">
            Showing {filteredCount} of {totalCount} Signals
          </Badge>
          {hasActiveFilters && (
            <Badge variant="teal" dot className="text-[10px]">
              Active Filter
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
