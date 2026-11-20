import { useEffect } from 'react'
import { Menu, PanelLeft, Wifi, WifiOff, LogOut, User as UserIcon } from 'lucide-react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useQuery } from '@tanstack/react-query'
import { prefetchRoute } from '@/lib/router/prefetch'
import { systemService } from '@/services/system'
import { SimpleTooltip } from '@/components/ui/Tooltip'
import { Badge } from '@/components/ui/Badge'
import { ThemeToggle } from '@/components/navigation/ThemeToggle'
import { useAuth } from '@/context/AuthContext'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/Dropdown'

interface AppHeaderProps {
  onToggleMobile: () => void
  onToggleCollapse?: () => void
  collapsed?: boolean
}

const pageTitles: Record<string, string> = {
  '/app': 'Overview',
  '/app/': 'Overview',
  '/app/customers': 'Customers',
  '/app/segments': 'Segments',
  '/app/predictions': 'Predictions',
  '/app/insights': 'Insights',
  '/app/settings': 'Settings',
  '/overview': 'Overview',
  '/customers': 'Customers',
  '/segments': 'Segments',
  '/predictions': 'Predictions',
  '/insights': 'Insights',
  '/settings': 'Settings',
}

export function AppHeader({ onToggleMobile, onToggleCollapse, collapsed = false }: AppHeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const isCustomerDetail =
    location.pathname.startsWith('/app/customers/') || location.pathname.startsWith('/customers/')
  const currentTitle = isCustomerDetail
    ? 'Customer Profile'
    : pageTitles[location.pathname] || 'Customer Intelligence'

  const userDisplayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split('@')[0] ||
    'Evaluator'
  const userInitials = userDisplayName.slice(0, 2).toUpperCase()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  // Dynamic document title synchronization for browser tab identity
  useEffect(() => {
    const tabTitle =
      location.pathname === '/app' || location.pathname === '/app/'
        ? 'Valora — Customer Intelligence'
        : `${currentTitle} — Valora`
    document.title = tabTitle
  }, [location.pathname, currentTitle])

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
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/90 px-4 sm:px-6 backdrop-blur-xs select-none transition-colors duration-150">
      <div className="flex items-center gap-3">
        {/* Mobile & Tablet Hamburger Toggle */}
        <button
          type="button"
          onClick={onToggleMobile}
          aria-label="Open navigation menu"
          className="rounded-md p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:bg-muted/70 hover:text-foreground lg:hidden cursor-pointer transition-all duration-150 active:scale-90"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop Sidebar Toggle */}
        {onToggleCollapse && (
          <SimpleTooltip
            content={collapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
          >
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden lg:flex rounded-md p-1.5 text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-all duration-150 active:scale-90 cursor-pointer"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          </SimpleTooltip>
        )}

        {/* Breadcrumb Hierarchy */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs">
          <Link
            to="/app"
            className="text-muted-foreground hover:text-foreground transition-colors hidden sm:inline font-medium"
          >
            Valora
          </Link>
          <span
            className="text-muted-foreground/40 hidden sm:inline select-none"
            aria-hidden="true"
          >
            /
          </span>

          {isCustomerDetail ? (
            <>
              <Link
                to="/app/customers"
                className="text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
              >
                Customers
              </Link>
              <span
                className="text-muted-foreground/40 hidden sm:inline select-none"
                aria-hidden="true"
              >
                /
              </span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={currentTitle}
                  initial={{ opacity: 0, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 2 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                  className="font-semibold text-foreground inline-block"
                >
                  {currentTitle}
                </motion.span>
              </AnimatePresence>
            </>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={currentTitle}
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 2 }}
                transition={{ duration: 0.14, ease: 'easeOut' }}
                className="font-semibold text-foreground inline-block"
              >
                {currentTitle}
              </motion.span>
            </AnimatePresence>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {/* Link back to marketing website */}
        <Link
          to="/"
          onPointerEnter={() => prefetchRoute('landing')}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden md:inline-flex items-center gap-1 font-medium px-2 py-1 rounded hover:bg-muted/40"
        >
          <span>Website</span>
        </Link>

        {/* Global Theme Toggle */}
        <ThemeToggle />
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
              <span className="relative flex h-1.5 w-1.5">
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
              </span>
              <Wifi className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="font-medium text-foreground hidden sm:inline">API Active</span>
            </>
          ) : isError ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
              <WifiOff className="h-3 w-3 text-amber-500 shrink-0" />
              <span className="font-medium text-foreground hidden sm:inline">API Standby</span>
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse shrink-0" />
              <span className="hidden sm:inline">Connecting</span>
            </>
          )}
        </div>

        {/* Intelligence Platform Badge */}
        <Badge variant="neutral" className="hidden sm:inline-flex text-[11px] font-mono">
          Customer Intelligence
        </Badge>

        {/* User Profile & Account Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border bg-surface p-1 pr-2.5 text-xs text-foreground hover:bg-surface-elevated hover:border-border-strong transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-accent">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground font-mono text-[10px] font-bold">
              {userInitials}
            </div>
            <span className="font-mono text-xs max-w-[100px] truncate hidden md:inline">
              {userDisplayName}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-surface border-border p-1.5 space-y-1"
          >
            <DropdownMenuLabel className="font-mono text-xs text-muted-foreground pb-1">
              <div className="text-foreground font-medium truncate">{userDisplayName}</div>
              <div className="text-[10px] text-muted-foreground/80 truncate font-mono">
                {user?.email || 'authenticated-session'}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={() => navigate('/app/settings')}
              className="cursor-pointer text-xs flex items-center gap-2"
            >
              <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Platform Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer text-xs text-red-400 focus:text-red-300 focus:bg-red-500/10 flex items-center gap-2"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default AppHeader
