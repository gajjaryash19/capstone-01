import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ValoraMark } from '@/components/brand/ValoraLogo'

interface LoadingStateProps {
  message?: string
  className?: string
  fullPage?: boolean
  branded?: boolean
}

export function LoadingState({
  message = 'Loading...',
  className,
  fullPage = false,
  branded = false,
}: LoadingStateProps) {
  const showBranded = branded || fullPage

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 text-xs text-muted-foreground select-none',
        fullPage ? 'min-h-[50vh]' : 'h-48',
        className,
      )}
    >
      {showBranded ? (
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-surface-elevated border border-border shadow-xs text-foreground">
            <ValoraMark size={20} className="animate-pulse" />
          </div>
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase font-mono">
            {message}
          </span>
        </div>
      ) : (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-foreground mb-2.5" />
          <span className="text-xs">{message}</span>
        </>
      )}
    </div>
  )
}
