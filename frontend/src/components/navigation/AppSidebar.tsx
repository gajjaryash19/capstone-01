import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Layers,
  TrendingUp,
  Sparkles,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SimpleTooltip } from '@/components/ui/Tooltip'
import { ValoraLogo, ValoraMark } from '@/components/brand/ValoraLogo'
import { LineSidebar, type LineSidebarItem } from './LineSidebar'
import { prefetchRoute } from '@/lib/router/prefetch'

interface AppSidebarProps {
  collapsed?: boolean
  onToggleCollapse?: () => void
  onCloseMobile?: () => void
  isMobile?: boolean
}

const primaryNavItems: LineSidebarItem[] = [
  { label: 'Overview', to: '/app', icon: LayoutDashboard },
  { label: 'Customers', to: '/app/customers', icon: Users },
  { label: 'Segments', to: '/app/segments', icon: Layers },
  { label: 'Predictions', to: '/app/predictions', icon: TrendingUp },
  { label: 'Insights', to: '/app/insights', icon: Sparkles },
]

const secondaryNavItems: LineSidebarItem[] = [
  { label: 'Settings', to: '/app/settings', icon: Settings },
]

export function AppSidebar({
  collapsed = false,
  onToggleCollapse,
  onCloseMobile,
  isMobile = false,
}: AppSidebarProps) {
  const isCompact = collapsed && !isMobile

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-border bg-card transition-[width] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] select-none',
        isCompact ? 'w-16' : 'w-64',
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          'flex h-16 items-center border-b border-border',
          isCompact ? 'justify-center px-0' : 'justify-between px-4 sm:px-5',
        )}
      >
        {isCompact ? (
          <SimpleTooltip content="Valora — Customer Intelligence" side="right">
            <NavLink
              to="/"
              onPointerEnter={() => prefetchRoute('landing')}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-elevated border border-border shadow-xs text-foreground hover:border-border-strong transition-all duration-150 active:scale-95 cursor-pointer"
              aria-label="Valora Home"
            >
              <ValoraMark size={17} />
            </NavLink>
          </SimpleTooltip>
        ) : (
          <NavLink
            to="/"
            onClick={onCloseMobile}
            onPointerEnter={() => prefetchRoute('landing')}
            className="group flex items-center gap-2.5 overflow-hidden focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring rounded-md cursor-pointer transition-transform duration-150 active:scale-[0.98]"
            aria-label="Valora — Customer Intelligence"
          >
            <ValoraLogo size="md" />
          </NavLink>
        )}

        {/* Sidebar Controls */}
        {!isMobile && !isCompact && onToggleCollapse && (
          <SimpleTooltip content="Collapse sidebar (Ctrl+B)">
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Collapse sidebar"
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-all duration-150 active:scale-90 cursor-pointer"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </SimpleTooltip>
        )}

        {/* Mobile Close Button */}
        {isMobile && onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-all duration-150 active:scale-90 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation Links Area powered by LineSidebar */}
      <div
        className={cn('flex-1 overflow-y-auto py-4 space-y-6', isCompact ? 'px-2' : 'pl-6 pr-3')}
      >
        <div>
          {!isCompact && (
            <div className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground font-mono">
              Core Intelligence
            </div>
          )}
          <LineSidebar
            items={primaryNavItems}
            startIndex={1}
            isCompact={isCompact}
            isMobile={isMobile}
            showIndex={!isCompact}
            showMarker={!isCompact}
            proximityRadius={80}
            maxShift={6}
            markerLength={18}
            markerGap={6}
            itemGap={4}
            onItemClick={onCloseMobile}
          />
        </div>

        <div>
          {!isCompact && (
            <div className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground font-mono">
              Configuration
            </div>
          )}
          <LineSidebar
            items={secondaryNavItems}
            startIndex={primaryNavItems.length + 1}
            isCompact={isCompact}
            isMobile={isMobile}
            showIndex={!isCompact}
            showMarker={!isCompact}
            proximityRadius={80}
            maxShift={6}
            markerLength={18}
            markerGap={6}
            itemGap={4}
            onItemClick={onCloseMobile}
          />
        </div>
      </div>

      {/* Footer / Engine Status */}
      <div className="border-t border-border p-3">
        {isCompact ? (
          <div className="flex flex-col items-center gap-2">
            <SimpleTooltip content="Valora Engine Active • Production" side="right">
              <div className="flex h-6 w-6 items-center justify-center">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent/40 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
              </div>
            </SimpleTooltip>
            {onToggleCollapse && (
              <SimpleTooltip content="Expand sidebar" side="right">
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  aria-label="Expand sidebar"
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-all duration-150 active:scale-90 cursor-pointer"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                </button>
              </SimpleTooltip>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-lg bg-surface-elevated/70 border border-border/80 p-2.5 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent/40 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-foreground text-[11px] leading-tight truncate">
                  Valora Engine v1.0
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight truncate">
                  Customer Intelligence
                </span>
              </div>
            </div>
            <span className="shrink-0 text-[9px] font-mono font-medium text-accent uppercase px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20">
              Prod
            </span>
          </div>
        )}
      </div>
    </aside>
  )
}

export default AppSidebar
