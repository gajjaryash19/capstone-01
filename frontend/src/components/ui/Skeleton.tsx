import * as React from 'react'
import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted/60', className)}
      aria-hidden="true"
      {...props}
    />
  )
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg border border-border bg-card p-6 space-y-3', className)}>
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-2 p-4">
      <div className="flex gap-4 border-b border-border pb-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-2 border-b border-border/40">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton({
  height = 240,
  className,
}: {
  height?: number
  className?: string
}) {
  return (
    <div
      style={{ height }}
      className={cn(
        'w-full rounded-lg border border-border bg-card p-4 flex flex-col justify-between',
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex justify-between items-center pb-2 border-b border-border/40">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex items-end justify-between gap-3 h-36 pt-4 px-2">
        <Skeleton className="h-16 flex-1 rounded-t" />
        <Skeleton className="h-28 flex-1 rounded-t" />
        <Skeleton className="h-24 flex-1 rounded-t" />
        <Skeleton className="h-32 flex-1 rounded-t" />
        <Skeleton className="h-20 flex-1 rounded-t" />
        <Skeleton className="h-36 flex-1 rounded-t" />
      </div>
      <div className="flex justify-between pt-2 border-t border-border/40">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  )
}
