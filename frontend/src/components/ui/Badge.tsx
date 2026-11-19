import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'teal' | 'destructive' | 'success' | 'warning'
  dot?: boolean
}

const badgeVariants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'border-transparent bg-primary text-primary-foreground',
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  outline: 'border-border text-foreground',
  teal: 'border-transparent bg-accent text-accent-foreground font-medium',
  destructive: 'border-transparent bg-destructive/15 text-destructive font-medium',
  success: 'border-transparent bg-emerald-500/15 text-emerald-700 font-medium',
  warning: 'border-transparent bg-amber-500/15 text-amber-700 font-medium',
}

const dotColors: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-primary-foreground',
  secondary: 'bg-secondary-foreground',
  outline: 'bg-foreground',
  teal: 'bg-primary',
  destructive: 'bg-destructive',
  success: 'bg-emerald-600',
  warning: 'bg-amber-600',
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
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors',
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant])} />}
      <span>{children}</span>
    </div>
  )
}
