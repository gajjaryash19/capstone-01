import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'default'
    | 'secondary'
    | 'outline'
    | 'neutral'
    | 'teal'
    | 'accent'
    | 'destructive'
    | 'success'
    | 'warning'
  dot?: boolean
}

const badgeVariants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'border-transparent bg-primary text-primary-foreground',
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  outline: 'border-border text-foreground',
  neutral: 'border-border bg-surface-elevated text-foreground font-medium',
  teal: 'border-border bg-surface-elevated text-foreground font-medium', // Monochromatic alias for legacy callers
  accent: 'border-accent/30 bg-accent/10 text-accent font-medium',
  destructive: 'border-transparent bg-destructive/15 text-destructive font-medium',
  success: 'border-transparent bg-success/15 text-success font-medium',
  warning: 'border-transparent bg-warning/15 text-warning font-medium',
}

const dotColors: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-primary-foreground',
  secondary: 'bg-secondary-foreground',
  outline: 'bg-foreground',
  neutral: 'bg-foreground',
  teal: 'bg-foreground',
  accent: 'bg-accent',
  destructive: 'bg-destructive',
  success: 'bg-success',
  warning: 'bg-warning',
}

export function Badge({
  className,
  variant = 'default',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0',
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </div>
  )
}
