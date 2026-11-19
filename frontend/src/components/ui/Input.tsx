import * as React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error = false, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        disabled={disabled}
        className={cn(
          'flex h-9 w-full rounded-md border bg-card px-3 py-1 text-xs text-foreground shadow-xs transition-colors',
          'placeholder:text-muted-foreground file:border-0 file:bg-transparent file:text-xs file:font-medium',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-destructive focus-visible:ring-destructive'
            : 'border-border hover:border-border-strong',
          className,
        )}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export interface SearchInputProps extends Omit<InputProps, 'onChange'> {
  value?: string
  onChange?: (value: string) => void
  onClear?: () => void
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      value,
      onChange,
      onClear,
      placeholder = 'Search accounts, cohorts, metrics...',
      ...props
    },
    ref,
  ) => {
    return (
      <div className="relative flex items-center w-full">
        <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          ref={ref}
          type="search"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={cn('pl-8 pr-8', className)}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-2.5 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    )
  },
)
SearchInput.displayName = 'SearchInput'
