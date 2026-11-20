import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { prefetchRoute } from '@/lib/router/prefetch'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="text-center max-w-sm">
        <span className="font-mono text-4xl font-bold tracking-tight text-foreground">404</span>
        <h1 className="mt-3 text-lg font-semibold text-foreground">Page Not Found</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button asChild size="sm">
            <Link
              to="/app"
              onPointerEnter={() => {
                prefetchRoute('appLayout')
                prefetchRoute('overview')
              }}
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link
              to="/"
              onPointerEnter={() => {
                prefetchRoute('landing')
              }}
            >
              Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
