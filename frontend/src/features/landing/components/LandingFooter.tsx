import { Link } from 'react-router-dom'
import { ValoraLogo } from '@/components/brand/ValoraLogo'

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background text-foreground-muted select-none">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-5">
            <Link to="/" className="inline-block" aria-label="Valora Home">
              <ValoraLogo size="md" />
            </Link>
            <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed max-w-sm font-light">
              Deterministic customer lifetime value intelligence and predictive retention
              architecture.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-mono text-foreground-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>Deterministic Mode</span>
              </span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-3 md:col-span-3">
            <span className="font-mono text-xs uppercase tracking-wider text-foreground font-medium">
              Platform Modules
            </span>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <Link to="/app" className="hover:text-foreground transition-colors">
                  Overview Dashboard
                </Link>
              </li>
              <li>
                <Link to="/app/customers" className="hover:text-foreground transition-colors">
                  Customer Directory
                </Link>
              </li>
              <li>
                <Link to="/app/segments" className="hover:text-foreground transition-colors">
                  Behavioral Segments
                </Link>
              </li>
              <li>
                <Link to="/app/predictions" className="hover:text-foreground transition-colors">
                  CLV Predictions
                </Link>
              </li>
              <li>
                <Link to="/app/insights" className="hover:text-foreground transition-colors">
                  Decision Signals
                </Link>
              </li>
            </ul>
          </div>

          {/* Methodological Foundations */}
          <div className="space-y-3 md:col-span-4">
            <span className="font-mono text-xs uppercase tracking-wider text-foreground font-medium">
              Methodology & Rigor
            </span>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <span className="text-foreground-subtle">Buy-Till-You-Die (BTYD) Modeling</span>
              </li>
              <li>
                <span className="text-foreground-subtle">BG/NBD Continuous Transaction Rate</span>
              </li>
              <li>
                <span className="text-foreground-subtle">Gamma-Gamma Monetary Independence</span>
              </li>
              <li>
                <span className="text-foreground-subtle">Pareto Concentration Analysis</span>
              </li>
              <li>
                <span className="text-foreground-subtle">94.2% Calibration Accuracy (MAPE)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Baseline Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-foreground-subtle">
          <p>© 2026 Valora Customer Intelligence. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Deterministic 36-Account Benchmark</span>
            <span>•</span>
            <span>v1.0 Production Release</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default LandingFooter
