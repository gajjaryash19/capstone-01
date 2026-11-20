import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { prefetchRoute } from '@/lib/router/prefetch'

export function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { signUp, isConfigured } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.')
      return
    }

    if (!email.trim() || !password) {
      setErrorMsg('Please complete all required fields.')
      return
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    if (!agreeTerms) {
      setErrorMsg('Please agree to the Terms of Service and Privacy Policy to continue.')
      return
    }

    setIsSubmitting(true)
    const { error } = await signUp(email.trim(), password, fullName.trim())
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
            We&apos;ve sent a confirmation link to{' '}
            <span className="font-mono text-foreground font-medium">{email}</span>. Click the link
            in the email to activate your account.
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
          Create Valora Account
        </h1>
        <p className="text-xs text-foreground-muted font-light">
          Start analyzing and predicting customer lifetime value.
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
            <code className="font-mono">frontend/.env</code> to enable live registration.
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
          <label htmlFor="signup-name" className="block text-xs font-mono text-foreground-muted">
            Full name
          </label>
          <Input
            id="signup-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Doe"
            autoComplete="name"
            required
            className="h-10 bg-surface border-border text-foreground placeholder:text-foreground-subtle focus-visible:border-ring"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="signup-email" className="block text-xs font-mono text-foreground-muted">
            Work email
          </label>
          <Input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@company.com"
            autoComplete="email"
            required
            className="h-10 bg-surface border-border text-foreground placeholder:text-foreground-subtle focus-visible:border-ring"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="signup-password"
            className="block text-xs font-mono text-foreground-muted"
          >
            Password
          </label>
          <div className="relative">
            <Input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <label htmlFor="signup-confirm" className="block text-xs font-mono text-foreground-muted">
            Confirm password
          </label>
          <Input
            id="signup-confirm"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your password"
            autoComplete="new-password"
            required
            className="h-10 bg-surface border-border text-foreground placeholder:text-foreground-subtle focus-visible:border-ring"
          />
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-2 pt-1">
          <input
            id="signup-terms"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 rounded border-border bg-surface text-accent focus:ring-ring cursor-pointer"
          />
          <label
            htmlFor="signup-terms"
            className="text-[11px] text-foreground-muted leading-relaxed cursor-pointer select-none"
          >
            I agree to the Valora data governance terms, privacy policy, and client PII hashing
            protocol.
          </label>
        </div>

        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full h-10 font-mono text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer mt-2"
        >
          <span>Create Account</span>
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </form>

      {/* Footer link to Sign In */}
      <div className="pt-2 border-t border-border text-center text-xs text-foreground-muted">
        <span>Already have an account? </span>
        <Link
          to="/login"
          onPointerEnter={() => prefetchRoute('login')}
          className="text-foreground font-medium hover:text-accent transition-colors underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}

export default SignupPage
