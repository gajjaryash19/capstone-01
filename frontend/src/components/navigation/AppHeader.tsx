import { Menu, PanelLeft, Wifi, WifiOff } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { systemService } from '@/services/system'
import { SimpleTooltip } from '@/components/ui/Tooltip'
import { Badge } from '@/components/ui/Badge'

interface AppHeaderProps {
  onToggleMobile: () => void
  onToggleCollapse?: () => void
  collapsed?: boolean
}

const pageTitles: Record<string, string> = {
  '/': 'Overview',
  '/customers': 'Customer Directory',
  '/segments': 'Customer Segments',
  '/predictions': 'CLV Predictions & Churn',
  '/insights': 'Autonomous Insights',
  '/settings': 'System Settings',
}

export function AppHeader({ onToggleMobile, onToggleCollapse, collapsed = false }: AppHeaderProps) {
  const location = useLocation()
  const currentTitle = pageTitles[location.pathname] || 'Analytics'

  const {
    data: health,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ['system-health'],
    queryFn: systemService.getHealth,
    refetchInterval: 30000,
    retry: 1,
  })

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/90 px-4 sm:px-6 backdrop-blur-xs">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={onToggleMobile}
          aria-label="Toggle navigation menu"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/70 hover:text-foreground md:hidden cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop Sidebar Toggle */}
        {onToggleCollapse && (
          <SimpleTooltip content={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden md:flex rounded-md p-1.5 text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors cursor-pointer"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          </SimpleTooltip>
        )}

        {/* Breadcrumb Hierarchy */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground hidden sm:inline">Platform</span>
          <span className="text-muted-foreground/40 hidden sm:inline">/</span>
          <span className="font-semibold text-foreground">{currentTitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Environment / Health Indicator */}
        <div
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] text-muted-foreground"
          title={
            isSuccess
              ? `Backend Status: ${health?.status}`
              : isError
                ? 'Backend disconnected'
                : 'Connecting to backend...'
          }
        >
          {isSuccess ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              <Wifi className="h-3 w-3 text-emerald-600 shrink-0" />
              <span className="font-medium text-foreground hidden sm:inline">API Connected</span>
            </>
          ) : isError ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
              <WifiOff className="h-3 w-3 text-amber-600 shrink-0" />
              <span className="font-medium text-foreground hidden sm:inline">API Standby</span>
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse shrink-0" />
              <span className="hidden sm:inline">Connecting</span>
            </>
          )}
        </div>

        {/* Intelligence Mode Badge */}
        <Badge variant="teal" className="hidden sm:inline-flex">
          CLV Core v1.0
        </Badge>
      </div>
    </header>
  )
}

export default AppHeader
