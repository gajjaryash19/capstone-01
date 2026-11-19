import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Layers,
  TrendingUp,
  Sparkles,
  Settings,
  BarChart2,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SimpleTooltip } from '@/components/ui/Tooltip'

interface AppSidebarProps {
  collapsed?: boolean
  onToggleCollapse?: () => void
  onCloseMobile?: () => void
  isMobile?: boolean
}

const primaryNavItems = [
  { label: 'Overview', to: '/', icon: LayoutDashboard },
  { label: 'Customers', to: '/customers', icon: Users },
  { label: 'Segments', to: '/segments', icon: Layers },
  { label: 'CLV Predictions', to: '/predictions', icon: TrendingUp },
  { label: 'Insights', to: '/insights', icon: Sparkles },
]

const secondaryNavItems = [{ label: 'Settings', to: '/settings', icon: Settings }]

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
        'flex h-full flex-col border-r border-border bg-card transition-[width] duration-200 ease-in-out select-none',
        isCompact ? 'w-16' : 'w-64',
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          'flex h-16 items-center border-b border-border',
          isCompact ? 'justify-center px-0' : 'justify-between px-5',
        )}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-xs">
            <BarChart2 className="h-4 w-4" />
          </div>
          {!isCompact && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold tracking-tight text-foreground leading-tight truncate">
                Valence CLV
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight truncate">
                Customer Intelligence
              </span>
            </div>
          )}
        </div>

        {!isMobile && !isCompact && onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Collapse sidebar"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors cursor-pointer"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-6">
        <div>
          {!isCompact && (
            <div className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Core Intelligence
            </div>
          )}
          <nav className="space-y-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon
              const link = (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center rounded-md text-xs font-medium transition-colors cursor-pointer',
                      isCompact ? 'h-10 w-10 justify-center mx-auto' : 'gap-5 px-3 py-2 ',
                      isActive
                        ? 'bg-accent text-accent-foreground font-semibold border border-primary'
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive
                            ? 'text-primary'
                            : 'text-muted-foreground group-hover:text-foreground',
                        )}
                      />
                      {!isCompact && <span className="truncate">{item.label}</span>}
                    </>
                  )}
                </NavLink>
              )

              if (isCompact) {
                return (
                  <SimpleTooltip key={item.to} content={item.label} side="right">
                    {link}
                  </SimpleTooltip>
                )
              }

              return link
            })}
          </nav>
        </div>

        <div>
          {!isCompact && (
            <div className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Configuration
            </div>
          )}
          <nav className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon
              const link = (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center rounded-md text-xs font-medium transition-colors cursor-pointer',
                      isCompact ? 'h-10 w-10 justify-center mx-auto' : 'gap-5 px-3 py-2 ',
                      isActive
                        ? 'bg-accent text-accent-foreground font-semibold border border-primary'
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive
                            ? 'text-primary'
                            : 'text-muted-foreground group-hover:text-foreground',
                        )}
                      />
                      {!isCompact && <span className="truncate">{item.label}</span>}
                    </>
                  )}
                </NavLink>
              )

              if (isCompact) {
                return (
                  <SimpleTooltip key={item.to} content={item.label} side="right">
                    {link}
                  </SimpleTooltip>
                )
              }

              return link
            })}
          </nav>
        </div>
      </div>

      {/* Footer / Engine Status */}
      <div className="border-t border-border p-3">
        {isCompact ? (
          <div className="flex flex-col items-center gap-2">
            <SimpleTooltip content="CLV Engine Active" side="right">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </SimpleTooltip>
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Expand sidebar"
                className="mt-1 rounded-md p-1.5 text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors cursor-pointer"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-md bg-muted/40 p-2.5 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="flex flex-col">
                <span className="font-medium text-foreground text-[11px] leading-tight">
                  Engine v1.0
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight">
                  CLV Models Active
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Prod</span>
          </div>
        )}
      </div>
    </aside>
  )
}

export default AppSidebar
