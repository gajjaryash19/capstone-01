/**
 * Valora Auth Layout
 *
 * Distinctive, premium split composition tailored to Valora's brand aesthetic.
 * Left brand panel features typography, architectural metadata, and platform ethos.
 * Right panel houses the centered authentication form with controlled spacing.
 * On mobile/tablet, smoothly transitions to a clean, focused single-column composition.
 * Fully supports Light Mode and Dark Mode via centralized design tokens.
 */

import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { ValoraLogo, ValoraMark } from '@/components/brand/ValoraLogo'
import { ThemeToggle } from '@/components/navigation/ThemeToggle'
import { prefetchRoute } from '@/lib/router/prefetch'

interface AuthLayoutProps {
  children?: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground antialiased selection:bg-foreground selection:text-background">
      {/* Left Brand Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16 border-r border-border bg-surface relative overflow-hidden select-none">
        {/* Subtle Architectural Grid Lines */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border-subtle)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border-subtle)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 pointer-events-none"
        />

        {/* Top Header Identity */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            to="/"
            onPointerEnter={() => prefetchRoute('landing')}
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md transition-opacity hover:opacity-90"
            aria-label="Valora Home"
          >
            <ValoraLogo size="md" />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="font-mono text-xs text-foreground-subtle uppercase tracking-wider">
              AUTH CONSOLE
            </span>
          </div>
        </div>

        {/* Center Philosophy Composition */}
        <div className="relative z-10 my-auto py-12 max-w-lg space-y-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-elevated border border-border shadow-sm">
            <ValoraMark size={24} className="text-foreground" />
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl xl:text-4xl font-light tracking-tight text-foreground leading-tight">
              Know the value of every customer. Before it happens.
            </h2>
            <p className="text-sm xl:text-base text-foreground-muted font-light leading-relaxed">
              Predict customer lifetime value, spot churn risk early, and take action with
              confidence.
            </p>
          </div>

          {/* Minimal Live Intelligence Metric Pill */}
          <div className="rounded-xl border border-border bg-surface-elevated/80 p-4 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-foreground-subtle">
              <span>CALIBRATED CORE</span>
              <span className="text-accent font-semibold">BG/NBD + GAMMA</span>
            </div>
            <div className="flex justify-between items-baseline pt-1 border-t border-border/60 text-[11px]">
              <span className="text-foreground-muted">Evaluation Benchmark:</span>
              <span className="text-foreground font-bold">94.2% MAPE (36 Accounts)</span>
            </div>
          </div>
        </div>

        {/* Bottom Technical Baseline */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-foreground-subtle border-t border-border/60 pt-6">
          <span>SECURE AUTHENTICATION</span>
          <span>ENCRYPTED TOKENS</span>
        </div>
      </div>

      {/* Right Authentication Form Area */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 min-h-screen lg:min-h-0 bg-background">
        {/* Mobile Top Header */}
        <div className="flex lg:hidden items-center justify-between pb-6 border-b border-border select-none">
          <Link
            to="/"
            onPointerEnter={() => prefetchRoute('landing')}
            className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md"
            aria-label="Valora Home"
          >
            <ValoraLogo size="sm" />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="text-[10px] font-mono text-foreground-subtle uppercase tracking-wider hidden sm:inline">
              Customer Intelligence
            </span>
          </div>
        </div>

        {/* Centered Form Wrapper with Fluid Transition */}
        <div className="my-auto py-8 sm:py-12 w-full max-w-md mx-auto">
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xl space-y-6 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={location.pathname}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.14, ease: [0.16, 1, 0.3, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Mobile/Footer Notice */}
        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-foreground-subtle select-none">
          <span>© 2026 Valora Customer Intelligence</span>
          <div className="flex items-center gap-3 text-[11px]">
            <Link
              to="/"
              onPointerEnter={() => prefetchRoute('landing')}
              className="hover:text-foreground transition-colors"
            >
              Website
            </Link>
            <span>•</span>
            <Link
              to="/app"
              onPointerEnter={() => {
                prefetchRoute('appLayout')
                prefetchRoute('overview')
              }}
              className="hover:text-foreground transition-colors"
            >
              Platform
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
