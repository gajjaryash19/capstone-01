import { cn } from '@/lib/utils'

export interface ValoraMarkProps {
  className?: string
  size?: number | string
  useImage?: boolean
  monochrome?: boolean
}

/**
 * ValoraMark: Displays the official Valora V brand mark.
 * Rendered natively as an optimized, responsive vector SVG adhering to the
 * master geometry: Precision, Motion, Intelligence, Restraint.
 */
export function ValoraMark({
  className,
  size = 18,
  useImage = false,
  monochrome = false,
}: ValoraMarkProps) {
  if (useImage) {
    return (
      <img
        src="/brand/valora-symbol.svg"
        alt="Valora"
        width={typeof size === 'number' ? size : undefined}
        height={typeof size === 'number' ? size : undefined}
        className={cn('shrink-0 select-none object-contain', className)}
        style={
          typeof size === 'string'
            ? { width: size, height: size }
            : { width: `${size}px`, height: `${size}px` }
        }
      />
    )
  }

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={cn('shrink-0 select-none overflow-visible', className)}
      aria-hidden="true"
    >
      {/* Left Foundation Vector (Historical Ingest & Customer Cohorts) */}
      <polygon points="15,22 33,22 47,76 30,76" fill="currentColor" />
      {/* Right Trajectory Vector (Compounding Value Velocity) */}
      <polygon points="41,86 58,86 78,33 62,33 48,70 41,86" fill="currentColor" />
      {/* Right Apex Horizon Facet (Predictive CLV Insight) */}
      <polygon points="65,26 81,26 87,12 71,12" fill={monochrome ? 'currentColor' : '#C8F169'} />
    </svg>
  )
}

export interface ValoraLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showWordmark?: boolean
  showSubtitle?: boolean
  className?: string
  markContainerClassName?: string
  monochrome?: boolean
}

export function ValoraLogo({
  size = 'md',
  showWordmark = true,
  showSubtitle = true,
  className,
  markContainerClassName,
  monochrome = false,
}: ValoraLogoProps) {
  const sizeConfig = {
    sm: {
      container: 'h-7 w-7 rounded-md',
      iconSize: 15,
      title: 'text-xs',
      subtitle: 'text-[9px]',
      gap: 'gap-2',
    },
    md: {
      container: 'h-8 w-8 rounded-lg',
      iconSize: 17,
      title: 'text-sm',
      subtitle: 'text-[10px]',
      gap: 'gap-2.5',
    },
    lg: {
      container: 'h-10 w-10 rounded-lg',
      iconSize: 22,
      title: 'text-base',
      subtitle: 'text-xs',
      gap: 'gap-3',
    },
  }[size]

  return (
    <div className={cn('flex items-center overflow-hidden', sizeConfig.gap, className)}>
      {/* Geometric Mark Container */}
      <div
        className={cn(
          'flex shrink-0 items-center justify-center bg-surface-elevated border border-border shadow-xs text-foreground transition-colors group-hover:border-border-strong',
          sizeConfig.container,
          markContainerClassName,
        )}
      >
        <ValoraMark size={sizeConfig.iconSize} monochrome={monochrome} />
      </div>

      {/* Brand Wordmark & Subtitle */}
      {showWordmark && (
        <div className="flex flex-col overflow-hidden min-w-0">
          <span
            className={cn(
              'font-semibold tracking-tight text-foreground leading-tight truncate select-none',
              sizeConfig.title,
            )}
          >
            Valora
          </span>
          {showSubtitle && (
            <span
              className={cn(
                'text-muted-foreground font-normal tracking-normal leading-tight truncate select-none mt-0.5',
                sizeConfig.subtitle,
              )}
            >
              Customer Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default ValoraLogo
