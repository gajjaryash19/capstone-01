import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled UI boundary error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.reload()
  }

  public override render() {
    if (this.state.hasError) {
      if (this.fallback) {
        return this.fallback
      }

      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="rounded-full bg-destructive/10 p-3 text-destructive mb-3">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Something went wrong</h2>
          <p className="mt-1 max-w-md text-xs text-muted-foreground">
            {this.state.error?.message || 'An unexpected runtime error occurred.'}
          </p>
          <div className="mt-5">
            <Button variant="outline" size="sm" onClick={this.handleReset}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Reload Application
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }

  private get fallback() {
    return this.props.fallback
  }
}
