import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { prefetchRoute } from '@/lib/router/prefetch'

export function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { updatePassword, isConfigured } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    const { error } = await updatePassword(newPassword)
    setIsSubmitting(false)

    if (error) {
      setErrorMsg(error.message)
    } else {
      setIsSuccess(true)
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 2500)
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center py-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent border border-accent/30">
          <CheckCircle className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-light text-foreground">Password Updated</h1>
          <p className="text-xs text-foreground-muted leading-relaxed max-w-sm mx-auto font-light">
            Your password has been reset successfully. Redirecting you to sign in...
          </p>
        </div>
        <div className="pt-2">
          <Button
            asChild
            className="w-full h-10 font-mono text-xs bg-surface-elevated text-foreground border border-border hover:bg-muted"
          >
            <Link to="/login" onPointerEnter={() => prefetchRoute('login')}>
              Back to Sign In
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-light tracking-tight text-foreground">
          Set New Password
        </h1>
        <p className="text-xs text-foreground-muted font-light">Enter your new password below.</p>
      </div>

      {/* Supabase Configuration Warning */}
      {!isConfigured && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-300 space-y-1">
          <div className="flex items-center gap-1.5 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
            <span>Supabase Setup Required</span>
          </div>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-200/80 leading-relaxed">
            Please define <code className="font-mono">VITE_SUPABASE_URL</code> and{' '}
            <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> in{' '}
            <code className="font-mono">frontend/.env</code> to complete the password update.
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
          <label
            htmlFor="reset-new-password"
            className="block text-xs font-mono text-foreground-muted"
          >
            New password
          </label>
          <div className="relative">
            <Input
              id="reset-new-password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
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

        <div className="space-y-1.5">
          <label
            htmlFor="reset-confirm-password"
            className="block text-xs font-mono text-foreground-muted"
          >
            Confirm new password
          </label>
          <Input
            id="reset-confirm-password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your password"
            autoComplete="new-password"
            required
            className="h-10 bg-surface border-border text-foreground placeholder:text-foreground-subtle focus-visible:border-ring"
          />
        </div>

        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full h-10 font-mono text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer mt-2"
        >
          <span>Save new password</span>
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </form>

      {/* Back to Login */}
      <div className="pt-2 border-t border-border text-center text-xs text-foreground-muted">
        <Link
          to="/login"
          onPointerEnter={() => prefetchRoute('login')}
          className="text-foreground font-medium hover:text-accent transition-colors underline-offset-4 hover:underline"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}

export default ResetPasswordPage
