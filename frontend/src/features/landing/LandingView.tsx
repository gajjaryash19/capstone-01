import { useEffect } from 'react'
import { LandingNav } from './components/LandingNav'
import { LandingHero } from './components/LandingHero'
import { LandingProblemSection } from './components/LandingProblemSection'
import { LandingProductShowcase } from './components/LandingProductShowcase'
import { LandingClvValueSection } from './components/LandingClvValueSection'
import { LandingCapabilitiesSection } from './components/LandingCapabilitiesSection'
import { LandingDataJourneySection } from './components/LandingDataJourneySection'
import { LandingMethodologySection } from './components/LandingMethodologySection'
import { LandingCtaSection } from './components/LandingCtaSection'
import { LandingFooter } from './components/LandingFooter'

export interface LandingViewProps {
  /**
   * Controlled by the Cinematic Loader sequence.
   * Tells the Hero and page entrance animations to play in sync with loader exit.
   */
  isRevealed?: boolean
}

export function LandingView({ isRevealed = true }: LandingViewProps) {
  useEffect(() => {
    document.title = 'Valora — Customer Lifetime Value Intelligence'
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background flex flex-col overflow-x-hidden">
      <LandingNav isRevealed={isRevealed} />
      <main className="flex-1">
        <LandingHero isRevealed={isRevealed} />
        <LandingProblemSection />
        <LandingProductShowcase />
        <LandingClvValueSection />
        <LandingCapabilitiesSection />
        <LandingDataJourneySection />
        <LandingMethodologySection />
        <LandingCtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}

export default LandingView
