import { Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useTheme } from '@/hooks/useTheme'
import { SimpleTooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  align?: 'start' | 'center' | 'end'
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <SimpleTooltip content={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className={cn(
          'relative flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-foreground transition-all duration-150 hover:bg-surface-elevated hover:border-border-strong active:scale-90 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-ring overflow-hidden',
          className,
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ rotate: -45, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 45, scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center"
            >
              <Sun className="h-4 w-4 text-foreground-muted hover:text-foreground" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 45, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -45, scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center"
            >
              <Moon className="h-4 w-4 text-foreground-muted hover:text-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </SimpleTooltip>
  )
}

export default ThemeToggle
