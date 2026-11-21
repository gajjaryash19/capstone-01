import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { LoadingState } from '@/components/feedback/LoadingState'
import { ProtectedRoute, PublicAuthRoute } from './routes/ProtectedRoute'
import { AuthLayout } from './layouts/AuthLayout'
import { routeLoaders } from '@/lib/router/prefetch'

// Trigger prefetch immediately on initial root load
if (
  typeof window !== 'undefined' &&
  (window.location.pathname === '/' || window.location.pathname === '')
) {
  routeLoaders.landing()
}

const LandingPage = lazy(() =>
  import('./routes/LandingPage').then((m) => ({ default: m.LandingPage })),
)

const AppLayout = lazy(() => import('./layouts/AppLayout').then((m) => ({ default: m.AppLayout })))
const LoginPage = lazy(() => import('./routes/LoginPage').then((m) => ({ default: m.LoginPage })))
const SignupPage = lazy(() =>
  import('./routes/SignupPage').then((m) => ({ default: m.SignupPage })),
)
const ForgotPasswordPage = lazy(() =>
  import('./routes/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })),
)
const ResetPasswordPage = lazy(() =>
  import('./routes/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
)

const OverviewPage = lazy(() =>
  import('./routes/OverviewPage').then((m) => ({ default: m.OverviewPage })),
)
const CustomersPage = lazy(() =>
  import('./routes/CustomersPage').then((m) => ({ default: m.CustomersPage })),
)
const CustomerProfilePage = lazy(() =>
  import('./routes/CustomerProfilePage').then((m) => ({ default: m.CustomerProfilePage })),
)
const SegmentsPage = lazy(() =>
  import('./routes/SegmentsPage').then((m) => ({ default: m.SegmentsPage })),
)
const PredictionsPage = lazy(() =>
  import('./routes/PredictionsPage').then((m) => ({ default: m.PredictionsPage })),
)
const InsightsPage = lazy(() =>
  import('./routes/InsightsPage').then((m) => ({ default: m.InsightsPage })),
)
const SettingsPage = lazy(() =>
  import('./routes/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)
const NotFoundPage = lazy(() =>
  import('./routes/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

function CustomerRedirect() {
  const { customerId } = useParams()
  return <Navigate to={`/app/customers/${customerId}`} replace />
}

export function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingState message="Loading Valora..." fullPage />}>
        <Routes>
          {/* Standalone Marketing Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication Routes (Public only: redirects to /app if already signed in) */}
          <Route
            path="/login"
            element={
              <PublicAuthRoute>
                <AuthLayout>
                  <LoginPage />
                </AuthLayout>
              </PublicAuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicAuthRoute>
                <AuthLayout>
                  <SignupPage />
                </AuthLayout>
              </PublicAuthRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicAuthRoute>
                <AuthLayout>
                  <ForgotPasswordPage />
                </AuthLayout>
              </PublicAuthRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <AuthLayout>
                <ResetPasswordPage />
              </AuthLayout>
            }
          />

          {/* Protected Valora Analytics Workspace */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<OverviewPage />} />
              <Route path="overview" element={<Navigate to="/app" replace />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="customers/:customerId" element={<CustomerProfilePage />} />
              <Route path="segments" element={<SegmentsPage />} />
              <Route path="predictions" element={<PredictionsPage />} />
              <Route path="insights" element={<InsightsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Backward compatibility redirects for legacy direct URLs */}
          <Route path="/overview" element={<Navigate to="/app" replace />} />
          <Route path="/customers" element={<Navigate to="/app/customers" replace />} />
          <Route path="/customers/:customerId" element={<CustomerRedirect />} />
          <Route path="/segments" element={<Navigate to="/app/segments" replace />} />
          <Route path="/predictions" element={<Navigate to="/app/predictions" replace />} />
          <Route path="/insights" element={<Navigate to="/app/insights" replace />} />
          <Route path="/settings" element={<Navigate to="/app/settings" replace />} />

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default Router
