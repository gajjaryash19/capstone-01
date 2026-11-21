import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { ValoraLogo } from '@/components/brand/ValoraLogo'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/navigation/ThemeToggle'
import { gsap } from '@/lib/motion/gsap'
import { useSmoothScroll } from '@/lib/motion/useSmoothScroll'
import { prefersReducedMotion } from '@/lib/motion/device'
import { prefetchRoute } from '@/lib/router/prefetch'
import { cn } from '@/lib/utils'

interface NavLinkItem {
  label: string
  href: string
}

const navLinks: NavLinkItem[] = [
  { label: 'Problem', href: '#problem' },
  { label: 'Platform', href: '#product-showcase' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Journey', href: '#journey' },
  { label: 'Methodology', href: '#methodology' },
]

export interface LandingNavProps {
  /**
   * Synchronized with ValoraLoader reveal
   */
  isRevealed?: boolean
}

export function LandingNav({ isRevealed = true }: LandingNavProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const hasAnimatedRef = useRef(false)
  const { scrollTo, isReducedMotion } = useSmoothScroll()

  // Coordinated entrance animation
  useEffect(() => {
    if (!headerRef.current) return
    const isReduced = prefersReducedMotion()

    if (isReduced) {
      gsap.set(headerRef.current, { opacity: 1, y: 0, clearProps: 'all' })
      return
    }

    if (!isRevealed) {
      gsap.set(headerRef.current, { opacity: 0, y: -24 })
      return
    }

    if (hasAnimatedRef.current) return
    hasAnimatedRef.current = true

    gsap.to(headerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power3.out',
      delay: 0.08,
      clearProps: 'transform',
    })
  }, [isRevealed])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      scrollTo(href, { offset: -70 })
      setMobileMenuOpen(false)
    }
  }

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 select-none transition-colors duration-200 py-3.5',
          isScrolled
            ? 'border-b border-border bg-background/95 shadow-xs'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2.5 outline-hidden focus-visible:ring-1 focus-visible:ring-ring rounded-md transition-transform duration-150 active:scale-[0.98]"
              aria-label="Valora Home"
            >
              <ValoraLogo size="md" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Marketing Navigation"
            className="hidden md:flex items-center gap-1 rounded-full border border-border bg-surface-elevated/95 px-4 py-1.5"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="rounded-full px-3.5 py-1 text-xs font-medium text-foreground-muted transition-all duration-150 hover:text-foreground hover:bg-surface-elevated active:scale-[0.98]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs & Theme Toggle */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/app"
              onPointerEnter={() => prefetchRoute('login')}
              className="text-xs font-medium text-foreground-muted hover:text-foreground transition-colors duration-150 px-2 py-1"
            >
              Sign in
            </Link>
            <Button
              asChild
              size="sm"
              className="h-8 px-3.5 gap-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-all duration-150 active:scale-[0.98] shadow-xs font-mono"
            >
              <Link
                to="/app"
                onPointerEnter={() => {
                  prefetchRoute('appLayout')
                  prefetchRoute('overview')
                }}
              >
                <span>Open Dashboard</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>

          {/* Mobile Hamburger Button & Theme Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              asChild
              size="sm"
              className="h-8 px-2.5 text-[11px] font-mono bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link to="/app">Enter</Link>
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobileMenuOpen}
              className="rounded-md p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground-muted hover:bg-surface-elevated hover:text-foreground transition-colors duration-150 active:scale-90 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={isReducedMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-background/98 md:hidden pt-24 px-6 flex flex-col justify-between pb-8"
          >
            <div className="space-y-6">
              <div className="border-b border-border pb-5">
                <span className="text-[10px] font-mono tracking-widest text-foreground-subtle uppercase">
                  Index
                </span>
                <nav className="mt-4 flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-xl font-light tracking-tight text-foreground hover:text-foreground-muted transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-foreground-subtle uppercase">
                  Direct Workspace Modules
                </span>
                <div className="grid grid-cols-1 gap-2 pt-1">
                  <Link
                    to="/app"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors"
                  >
                    <span>Overview Dashboard</span>
                    <ArrowRight className="h-3.5 w-3.5 text-foreground-muted" />
                  </Link>
                  <Link
                    to="/app/customers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors"
                  >
                    <span>Customer Directory</span>
                    <ArrowRight className="h-3.5 w-3.5 text-foreground-muted" />
                  </Link>
                  <Link
                    to="/app/predictions"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors"
                  >
                    <span>Predictions</span>
                    <ArrowRight className="h-3.5 w-3.5 text-foreground-muted" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-border">
              <Button
                asChild
                className="w-full h-11 text-xs font-mono font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link to="/app" onClick={() => setMobileMenuOpen(false)}>
                  <span>Open Dashboard</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
