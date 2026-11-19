import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  message?: string
  className?: string
  fullPage?: boolean
}

export function LoadingState({
  message = 'Loading platform metrics...',
  className,
  fullPage = false,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 text-xs text-muted-foreground',
        fullPage ? 'min-h-[50vh]' : 'h-48',
        className,
      )}
    >
      <Loader2 className="h-5 w-5 animate-spin text-primary mb-2.5" />
      <span>{message}</span>
    </div>
  )
}
