import * as React from 'react'
import { cn } from '@/lib/utils'

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  badge?: React.ReactNode
  actions?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  className,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 sm:pb-5 border-b border-border/80',
        className,
      )}
      {...props}
    >
      <div className="space-y-0.5 sm:space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground leading-normal">{description}</p>
        )}
        {children}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">{actions}</div>}
    </div>
  )
}
