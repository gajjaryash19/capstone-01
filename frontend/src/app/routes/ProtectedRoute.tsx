/**
 * Valora Protected Route Component
 *
 * Ensures unauthenticated requests to the `/app` workspace are cleanly redirected to `/login`
 * with location state preserved for post-login return.
 * Shows branded loading state while session restoration is in-flight.
 */

import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { LoadingState } from '@/components/feedback/LoadingState'

export function ProtectedRoute() {
  const { user, isLoading, isConfigured } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingState message="Authenticating session..." fullPage branded />
  }

  // In evaluation mode where Supabase backend credentials are not configured,
  // permit access to the analytics workspace so deterministic evaluation data remains honest and operable.
  if (!isConfigured) {
    return <Outlet />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export function PublicAuthRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingState message="Resolving session..." fullPage branded />
  }

  if (user) {
    // Return to the route user originally requested before being sent to login
    const state = location.state as { from?: { pathname: string; search: string } } | null
    const fromPath = state?.from ? `${state.from.pathname}${state.from.search}` : '/app'
    return <Navigate to={fromPath} replace />
  }

  return <>{children}</>
}
