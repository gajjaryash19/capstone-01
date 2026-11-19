import { Calendar, Cpu, Sparkles, Filter } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { TimeHorizon, SegmentFilter } from '../types'

interface OverviewFilterBarProps {
  timeHorizon: TimeHorizon
  onTimeHorizonChange: (horizon: TimeHorizon) => void
  segmentFilter: SegmentFilter
  onSegmentFilterChange: (segment: SegmentFilter) => void
  modelVersion: string
  modelAccuracy: string
}

const horizonOptions: { label: string; value: TimeHorizon }[] = [
  { label: '30 Days', value: '30d' },
  { label: '90 Days', value: '90d' },
  { label: '12 Months', value: '12m' },
  { label: 'All-Time', value: 'all' },
]

const segmentOptions: { label: string; value: SegmentFilter }[] = [
  { label: 'All Cohorts', value: 'all' },
  { label: 'Enterprise', value: 'enterprise' },
  { label: 'Mid-Market', value: 'mid-market' },
  { label: 'Growth', value: 'growth' },
]

export function OverviewFilterBar({
  timeHorizon,
  onTimeHorizonChange,
  segmentFilter,
  onSegmentFilterChange,
  modelVersion,
  modelAccuracy,
}: OverviewFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-2xs lg:flex-row lg:items-center lg:justify-between">
      {/* Time Horizon Segmented Control */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 font-medium">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Horizon:</span>
        </span>
        <div
          role="tablist"
          aria-label="Time Horizon Selection"
          className="flex flex-wrap items-center rounded-md bg-muted/60 p-0.5 border border-border/60"
        >
          {horizonOptions.map((opt) => {
            const isSelected = timeHorizon === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onTimeHorizonChange(opt.value)}
                className={cn(
                  'rounded-xs px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer min-h-[30px] flex items-center',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isSelected
                    ? 'bg-card text-foreground shadow-2xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Segment Selector & Model Badge */}
      <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium shrink-0">
            <Filter className="h-3 w-3 text-muted-foreground" />
            <span>Segment:</span>
          </span>
          <div className="flex flex-wrap items-center gap-1">
            {segmentOptions.map((opt) => (
              <Button
                key={opt.value}
                type="button"
                variant={segmentFilter === opt.value ? 'default' : 'outline'}
                size="sm"
                aria-pressed={segmentFilter === opt.value}
                className="h-7 px-2.5 text-[11px]"
                onClick={() => onSegmentFilterChange(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-1.5 pl-2 border-l border-border">
          <Badge variant="outline" className="text-[11px] gap-1 font-mono">
            <Cpu className="h-3 w-3 text-muted-foreground" />
            {modelVersion}
          </Badge>
          <span className="text-[11px] text-muted-foreground font-medium tabular-nums">
            <Sparkles className="h-3 w-3 text-primary inline mr-0.5" />
            {modelAccuracy} Acc.
          </span>
        </div>
      </div>
    </div>
  )
}
