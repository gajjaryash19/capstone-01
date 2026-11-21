import { useState, useEffect, useRef, Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { AppSidebar } from '@/components/navigation/AppSidebar'
import { AppHeader } from '@/components/navigation/AppHeader'
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary'
import { LoadingState } from '@/components/feedback/LoadingState'
import { EASINGS, DURATION } from '@/styles/motion'
import { prefetchWorkspaceRoutes } from '@/lib/router/prefetch'

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // Silently prefetch remaining workspace tabs for instant navigation
  useEffect(() => {
    prefetchWorkspaceRoutes()
  }, [])

  // Keyboard shortcut listener: ESC to close drawer, Ctrl/Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false)
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        // Prevent default browser bookmark behavior on Ctrl+B
        e.preventDefault()
        setCollapsed((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileOpen])

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Ensure the dashboard viewport never creates an outer document scrollbar
  useEffect(() => {
    document.documentElement.classList.add('overflow-hidden')
    document.body.classList.add('overflow-hidden')
    return () => {
      document.documentElement.classList.remove('overflow-hidden')
      document.body.classList.remove('overflow-hidden')
    }
  }, [])

  // Instant scroll-to-top on distinct route change (avoids scroll memory preserving awkward offsets)
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [location.pathname])

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground antialiased selection:bg-foreground selection:text-background">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:flex lg:shrink-0">
        <AppSidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((prev) => !prev)} />
      </div>

      {/* Mobile / Tablet Slide-Over Navigation with fluid entrance/exit */}
      <AnimatePresence>
        {mobileOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            className="fixed inset-0 z-50 flex lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : DURATION.fast }}
              className="fixed inset-0 bg-black/70"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : DURATION.moderate,
                ease: EASINGS.out,
              }}
              className="relative z-50 flex w-72 max-w-[85vw] flex-col shadow-xl"
            >
              <AppSidebar isMobile collapsed={false} onCloseMobile={() => setMobileOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main App Content Flow */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <AppHeader
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
          onToggleMobile={() => setMobileOpen((prev) => !prev)}
        />
        <main
          ref={mainRef}
          className="relative flex-1 overflow-y-auto overflow-x-hidden bg-background p-3.5 sm:p-5 md:p-8 scroll-smooth"
        >
          {/* Fluid route cross-fade without layout shift */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={location.pathname}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.14,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mx-auto max-w-7xl"
            >
              <ErrorBoundary>
                <Suspense
                  fallback={
                    <LoadingState message="Loading module view..." className="h-64" branded />
                  }
                >
                  <Outlet />
                </Suspense>
              </ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default AppLayout
