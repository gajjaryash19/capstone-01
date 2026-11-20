import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, AlertCircle, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { prefetchRoute } from '@/lib/router/prefetch'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { signIn, isConfigured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as { from?: { pathname: string; search: string } } | null
  const redirectPath = state?.from ? `${state.from.pathname}${state.from.search}` : '/app'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.')
      return
    }

    setIsSubmitting(true)
    const { error } = await signIn(email.trim(), password)
    setIsSubmitting(false)

    if (error) {
      setErrorMsg(error.message)
    } else {
      navigate(redirectPath, { replace: true })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-light tracking-tight text-foreground">
          Sign in to Valora
        </h1>
        <p className="text-xs text-foreground-muted font-light">
          Sign in to access your customer intelligence dashboard.
        </p>
      </div>

      {/* Supabase Configuration Warning if Environment Variables are missing */}
      {!isConfigured && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-300 space-y-1">
          <div className="flex items-center gap-1.5 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
            <span>Supabase Setup Required</span>
          </div>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-200/80 leading-relaxed">
            Please define <code className="font-mono">VITE_SUPABASE_URL</code> and{' '}
            <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> in{' '}
            <code className="font-mono">frontend/.env</code> to enable live authentication.
          </p>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="block text-xs font-mono text-foreground-muted">
            Email address
          </label>
          <Input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            autoComplete="email"
            required
            className="h-10 bg-surface border-border text-foreground placeholder:text-foreground-subtle focus-visible:border-ring"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="block text-xs font-mono text-foreground-muted"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              onPointerEnter={() => prefetchRoute('forgotPassword')}
              className="text-[11px] font-mono text-foreground-muted hover:text-foreground transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
              className="h-10 pr-10 bg-surface border-border text-foreground placeholder:text-foreground-subtle focus-visible:border-ring"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground-subtle hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full h-10 font-mono text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer mt-2"
        >
          <span>Sign In</span>
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </form>

      {/* Footer link to Signup */}
      <div className="pt-2 border-t border-border text-center text-xs text-foreground-muted">
        <span>Don't have an account? </span>
        <Link
          to="/signup"
          onPointerEnter={() => prefetchRoute('signup')}
          className="text-foreground font-medium hover:text-accent transition-colors underline-offset-4 hover:underline"
        >
          Create account
        </Link>
      </div>
    </div>
  )
}

export default LoginPage
