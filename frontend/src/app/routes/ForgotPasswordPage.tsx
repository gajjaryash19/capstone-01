import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { prefetchRoute } from '@/lib/router/prefetch'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { resetPasswordForEmail, isConfigured } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.')
      return
    }

    setIsSubmitting(true)
    const { error } = await resetPasswordForEmail(email.trim())
    setIsSubmitting(false)

    if (error) {
      setErrorMsg(error.message)
    } else {
      setIsSuccess(true)
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center py-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent border border-accent/30">
          <CheckCircle className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-light text-foreground">Check your email</h1>
          <p className="text-xs text-foreground-muted leading-relaxed max-w-sm mx-auto font-light">
            We&apos;ve sent password reset instructions to{' '}
            <span className="font-mono text-foreground font-medium">{email}</span>. Click the link
            in the email to choose a new password.
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
          Reset your password
        </h1>
        <p className="text-xs text-foreground-muted font-light">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
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
            <code className="font-mono">frontend/.env</code> to trigger password recovery emails.
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
          <label htmlFor="reset-email" className="block text-xs font-mono text-foreground-muted">
            Account email
          </label>
          <Input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            autoComplete="email"
            required
            className="h-10 bg-surface border-border text-foreground placeholder:text-foreground-subtle focus-visible:border-ring"
          />
        </div>

        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full h-10 font-mono text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer mt-2"
        >
          <span>Send reset link</span>
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </form>

      {/* Back to Login */}
      <div className="pt-2 border-t border-border text-center">
        <Link
          to="/login"
          onPointerEnter={() => prefetchRoute('login')}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
