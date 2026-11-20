import { memo } from 'react'
import { Calendar, Filter, Cpu, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
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
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
  { label: '12M', value: '12m' },
  { label: 'All-Time', value: 'all' },
]

const segmentOptions: { label: string; value: SegmentFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Enterprise', value: 'enterprise' },
  { label: 'Mid-Market', value: 'mid-market' },
  { label: 'Growth', value: 'growth' },
]

function OverviewFilterBarComponent({
  timeHorizon,
  onTimeHorizonChange,
  segmentFilter,
  onSegmentFilterChange,
  modelVersion,
  modelAccuracy,
}: OverviewFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-xs lg:flex-row lg:items-center lg:justify-between min-w-0">
      {/* Time Horizon Segmented Control */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 font-medium">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Period:</span>
        </span>
        <div
          role="tablist"
          aria-label="Time Horizon Selection"
          className="inline-flex rounded-lg bg-surface-elevated p-0.5 border border-border"
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
                  'rounded-md px-3 py-1.5 text-xs font-medium cursor-pointer min-h-[32px] flex items-center select-none',
                  'transition-all duration-150 ease-out active:scale-[0.98]',
                  'outline-hidden focus-visible:ring-1 focus-visible:ring-ring',
                  isSelected
                    ? 'bg-foreground text-background font-semibold shadow-xs border border-transparent'
                    : 'text-muted-foreground hover:text-foreground border border-transparent hover:bg-surface/50',
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
          <div className="inline-flex flex-wrap items-center gap-1">
            {segmentOptions.map((opt) => {
              const isSelected = segmentFilter === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSegmentFilterChange(opt.value)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer min-h-[30px] flex items-center select-none',
                    'transition-all duration-150 ease-out active:scale-[0.98]',
                    'outline-hidden focus-visible:ring-1 focus-visible:ring-ring border',
                    isSelected
                      ? 'bg-surface-elevated text-foreground font-semibold border-border-strong shadow-xs'
                      : 'border-border/70 bg-card text-muted-foreground hover:bg-surface-elevated/50 hover:text-foreground',
                  )}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Model Accuracy & Pipeline Version */}
        <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-border/80 shrink-0">
          <Badge variant="neutral" className="text-[10px] gap-1 font-mono shrink-0">
            <Cpu className="h-3 w-3 text-muted-foreground shrink-0" />
            <span>{modelVersion}</span>
          </Badge>
          <span className="text-[11px] text-muted-foreground font-mono tabular-nums flex items-center gap-1 shrink-0">
            <CheckCircle className="h-3 w-3 text-foreground/70 shrink-0" />
            <span>{modelAccuracy} Acc.</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export const OverviewFilterBar = memo(OverviewFilterBarComponent)
export default OverviewFilterBar
