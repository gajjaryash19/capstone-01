import { useState, useEffect, Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { AppSidebar } from '@/components/navigation/AppSidebar'
import { AppHeader } from '@/components/navigation/AppHeader'
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary'
import { LoadingState } from '@/components/feedback/LoadingState'

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Accessible keyboard ESC listener for mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileOpen])

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground antialiased">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:flex md:shrink-0">
        <AppSidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((prev) => !prev)} />
      </div>

      {/* Mobile Slide-Over Navigation */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-50 flex md:hidden"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer Panel */}
          <div className="relative z-50 flex w-72 max-w-[80vw] flex-col shadow-md animate-in slide-in-from-left duration-200">
            <AppSidebar isMobile collapsed={false} onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main App Content Flow */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <AppHeader
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
          onToggleMobile={() => setMobileOpen((prev) => !prev)}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background p-3.5 sm:p-5 md:p-8">
          <div className="mx-auto max-w-7xl">
            <ErrorBoundary>
              <Suspense
                fallback={<LoadingState message="Loading module view..." className="h-64" />}
              >
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout
