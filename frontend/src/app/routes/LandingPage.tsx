import { useState, useCallback, useEffect } from 'react'
import { LandingView } from '@/features/landing'
import { SmoothScrollProvider } from '@/lib/motion/SmoothScrollProvider'
import { ValoraLoader } from '@/components/brand/ValoraLoader'
import { prefetchEntryRoutes } from '@/lib/router/prefetch'
import { isTouchOrMobileDevice, prefersReducedMotion } from '@/lib/motion/device'

export function LandingPage() {
  const [isRevealed, setIsRevealed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    try {
      return (
        Boolean(sessionStorage.getItem('valora_has_loaded_session')) ||
        isTouchOrMobileDevice() ||
        prefersReducedMotion()
      )
    } catch {
      return false
    }
  })

  // Prefetch dashboard and auth routes in idle time for zero-latency entry
  useEffect(() => {
    prefetchEntryRoutes()
  }, [])

  const handleReveal = useCallback(() => {
    setIsRevealed(true)
  }, [])

  return (
    <SmoothScrollProvider enabled={true}>
      <ValoraLoader onReveal={handleReveal} />
      <LandingView isRevealed={isRevealed} />
    </SmoothScrollProvider>
  )
}

export default LandingPage
