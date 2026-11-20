/**
 * Valora Intelligent Route Prefetching Engine
 *
 * Silently prefetches route chunks during idle time or hover interactions.
 * Eliminates loading spinner flashes and ensures zero-latency navigation
 * across marketing, authentication, and the analytics workspace.
 *
 * Connection-aware: skips idle prefetching when the user enables data-saver
 * or is on slow cellular connections (2G / slow-2G).
 */

// Route dynamic import loaders matching router.tsx
export const routeLoaders = {
  landing: () => Promise.resolve(),
  login: () => import('@/app/routes/LoginPage'),
  signup: () => import('@/app/routes/SignupPage'),
  forgotPassword: () => import('@/app/routes/ForgotPasswordPage'),
  resetPassword: () => import('@/app/routes/ResetPasswordPage'),
  appLayout: () => import('@/app/layouts/AppLayout'),
  overview: () => import('@/app/routes/OverviewPage'),
  customers: () => import('@/app/routes/CustomersPage'),
  customerProfile: () => import('@/app/routes/CustomerProfilePage'),
  segments: () => import('@/app/routes/SegmentsPage'),
  predictions: () => import('@/app/routes/PredictionsPage'),
  insights: () => import('@/app/routes/InsightsPage'),
  settings: () => import('@/app/routes/SettingsPage'),
} as const

type RouteKey = keyof typeof routeLoaders

const loadedRoutes = new Set<RouteKey>()

/**
 * Checks if the user is on a bandwidth-constrained connection or data-saver mode.
 */
export function shouldAvoidPrefetch(): boolean {
  if (typeof navigator === 'undefined') return false
  const nav = navigator as {
    connection?: {
      saveData?: boolean
      effectiveType?: string
    }
  }
  if (nav.connection?.saveData === true) return true
  if (nav.connection?.effectiveType && ['slow-2g', '2g'].includes(nav.connection.effectiveType)) {
    return true
  }
  return false
}

/**
 * Prefetch a single route module chunk.
 */
export function prefetchRoute(key: RouteKey): void {
  if (loadedRoutes.has(key) || typeof window === 'undefined') return
  if (shouldAvoidPrefetch()) return

  loadedRoutes.add(key)

  try {
    const loader = routeLoaders[key]
    if (loader) {
      loader()
    }
  } catch {
    // Non-blocking background prefetch
  }
}

/**
 * Prefetches primary workspace routes during idle browser time.
 */
export function prefetchWorkspaceRoutes(): void {
  if (typeof window === 'undefined' || shouldAvoidPrefetch()) return

  const schedule = window.requestIdleCallback || ((cb: () => void) => setTimeout(cb, 200))

  schedule(() => {
    prefetchRoute('overview')
    prefetchRoute('customers')
    prefetchRoute('segments')
    prefetchRoute('predictions')
    prefetchRoute('insights')
    prefetchRoute('settings')
  })
}

/**
 * Prefetches high-value entry routes (login, signup) from the landing page during idle browser time.
 * Eager workspace and visualization chunks are deferred until direct user pointer hover.
 */
export function prefetchEntryRoutes(): void {
  if (typeof window === 'undefined' || shouldAvoidPrefetch()) return

  const schedule = window.requestIdleCallback || ((cb: () => void) => setTimeout(cb, 400))

  schedule(() => {
    prefetchRoute('login')
    prefetchRoute('signup')
  })
}
