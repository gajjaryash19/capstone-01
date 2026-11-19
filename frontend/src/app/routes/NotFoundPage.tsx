import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="text-center max-w-sm">
        <span className="font-mono text-4xl font-bold tracking-tight text-primary">404</span>
        <h1 className="mt-3 text-lg font-semibold text-foreground">Page Not Found</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          The requested analytical view does not exist or has been relocated.
        </p>
        <div className="mt-6">
          <Button asChild size="sm">
            <Link to="/">
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to Overview
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
