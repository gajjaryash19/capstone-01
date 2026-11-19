import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { LoadingState } from '@/components/feedback/LoadingState'

const OverviewPage = lazy(() =>
  import('./routes/OverviewPage').then((m) => ({ default: m.OverviewPage })),
)
const CustomersPage = lazy(() =>
  import('./routes/CustomersPage').then((m) => ({ default: m.CustomersPage })),
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

export function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingState message="Loading module..." fullPage />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="segments" element={<SegmentsPage />} />
            <Route path="predictions" element={<PredictionsPage />} />
            <Route path="insights" element={<InsightsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default Router
