import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  loading?: boolean
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  default:
    'bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs border border-transparent active:brightness-95 font-medium',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/60 active:bg-surface-hover',
  outline:
    'border border-border bg-card text-foreground hover:bg-muted/60 hover:border-border-strong active:bg-muted/80',
  ghost: 'text-foreground hover:bg-muted/60 active:bg-muted/80 border border-transparent',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs border border-transparent active:bg-red-600',
  link: 'text-primary underline-offset-4 hover:underline p-0 h-auto active:opacity-80 border-transparent',
}

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  default: 'h-9 px-4 py-2 text-xs font-medium active:scale-[0.98]',
  sm: 'h-8 px-3 text-[11px] font-medium rounded-md active:scale-[0.98]',
  lg: 'h-10 px-6 text-sm font-medium active:scale-[0.98]',
  icon: 'h-9 w-9 p-0 active:scale-[0.92]',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      asChild = false,
      disabled,
      loading = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    const isDisabled = disabled || loading

    return (
      <Comp
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md font-medium select-none whitespace-nowrap',
          'transition-[transform,background-color,border-color,box-shadow,opacity] duration-120 ease-[cubic-bezier(0.25,1,0.5,1)]',
          'active:translate-y-[0.5px]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          'disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100 disabled:active:translate-y-0 disabled:cursor-not-allowed',
          'cursor-pointer',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" aria-hidden="true" />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  },
)

Button.displayName = 'Button'
