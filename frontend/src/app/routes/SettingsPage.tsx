import { motion, useReducedMotion } from 'motion/react'
import { Server, ShieldCheck, Database, Palette, Moon, Sun, Monitor, Check } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/ui/PageHeader'
import { API_BASE_URL, APP_NAME } from '@/config/constants'
import { useTheme, type Theme } from '@/hooks/useTheme'
import { systemService } from '@/services/system'
import { cn } from '@/lib/utils'
import { DURATION, EASINGS } from '@/styles/motion'

interface ThemeOption {
  value: Theme
  label: string
  description: string
  icon: typeof Moon
}

const themeOptions: ThemeOption[] = [
  {
    value: 'dark',
    label: 'Dark',
    description: 'Dark surfaces with high-contrast text (Default).',
    icon: Moon,
  },
  {
    value: 'light',
    label: 'Light',
    description: 'Clean light theme for bright environments.',
    icon: Sun,
  },
  {
    value: 'system',
    label: 'System',
    description: 'Matches your system preferences.',
    icon: Monitor,
  },
]

export function SettingsPage() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  const { data: health, isSuccess } = useQuery({
    queryKey: ['system-health'],
    queryFn: systemService.getHealth,
    refetchInterval: 30000,
    retry: 1,
  })

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : DURATION.normal, ease: EASINGS.out }}
      className="space-y-6 max-w-4xl"
    >
      <PageHeader
        title="Settings"
        description="Manage theme preferences, API connections, and system status."
      />

      <Card className="divide-y divide-border bg-surface border-border">
        {/* Appearance & Interface Theme */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="rounded-md bg-surface-elevated p-2 text-foreground shrink-0 border border-border">
              <Palette className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
                <Badge variant="neutral" className="text-[10px] font-mono capitalize">
                  Active: {theme === 'system' ? `System (${resolvedTheme})` : resolvedTheme}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose your preferred theme. Changes apply immediately and are saved to your
                browser.
              </p>
            </div>
          </div>

          {/* Theme Selector Radio Group */}
          <div
            role="radiogroup"
            aria-label="Interface Theme Selection"
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1"
          >
            {themeOptions.map((option) => {
              const Icon = option.icon
              const isSelected = theme === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onClick={() => setTheme(option.value)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault()
                      setTheme(option.value)
                    }
                  }}
                  className={cn(
                    'flex flex-col text-left p-3.5 rounded-lg border cursor-pointer relative select-none',
                    'transition-all duration-150 ease-out active:scale-[0.98]',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
                    isSelected
                      ? 'border-accent bg-surface-elevated text-foreground shadow-xs'
                      : 'border-border bg-surface/60 hover:bg-surface-elevated/50 hover:border-border-strong text-muted-foreground',
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'p-1.5 rounded-md border transition-colors duration-150',
                          isSelected
                            ? 'bg-accent text-accent-foreground border-accent'
                            : 'bg-surface-elevated text-muted-foreground border-border',
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span
                        className={cn(
                          'text-xs font-semibold',
                          isSelected ? 'text-foreground' : 'text-foreground/90',
                        )}
                      >
                        {option.label}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="h-4 w-4 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {option.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Backend API Connection */}
        <div className="flex items-start gap-4 p-5 sm:p-6">
          <div className="rounded-md bg-surface-elevated p-2 text-foreground shrink-0 border border-border">
            <Server className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-foreground">API Connection</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Backend service endpoint for data queries and model predictions.
            </p>
            <div className="mt-3">
              <span className="inline-block rounded-md bg-surface-elevated px-2.5 py-1 font-mono text-xs text-foreground border border-border">
                {API_BASE_URL}
              </span>
            </div>
          </div>
        </div>

        {/* Environment Information */}
        <div className="flex items-start gap-4 p-5 sm:p-6">
          <div className="rounded-md bg-surface-elevated p-2 text-foreground shrink-0 border border-border">
            <Database className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-foreground">System Information</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Application version and service health status.
            </p>
            <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
              <div className="text-muted-foreground">
                App Name: <span className="font-medium text-foreground">{APP_NAME}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Platform Status:</span>
                {isSuccess ? (
                  <Badge variant="outline" className="font-mono text-[10px]">
                    Online ({health?.status || 'Connected'})
                  </Badge>
                ) : (
                  <Badge variant="outline" className="font-mono text-[10px] text-amber-400">
                    API Standby
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Data Privacy & Governance */}
        <div className="flex items-start gap-4 p-5 sm:p-6">
          <div className="rounded-md bg-surface-elevated p-2 text-foreground shrink-0 border border-border">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-foreground">Privacy & Security</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customer data protection and encryption standards.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default SettingsPage
