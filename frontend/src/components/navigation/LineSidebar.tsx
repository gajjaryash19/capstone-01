import React, { useRef, useEffect, useCallback, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { prefersReducedMotion, isTouchOrMobileDevice } from '@/lib/motion/lenis'
import { prefetchRoute } from '@/lib/router/prefetch'
import './LineSidebar.css'

const pathToKey: Record<
  string,
  'overview' | 'customers' | 'segments' | 'predictions' | 'insights' | 'settings'
> = {
  '/app': 'overview',
  '/app/customers': 'customers',
  '/app/segments': 'segments',
  '/app/predictions': 'predictions',
  '/app/insights': 'insights',
  '/app/settings': 'settings',
}

export interface LineSidebarItem {
  label: string
  to: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface LineSidebarProps {
  items: LineSidebarItem[]
  showIndex?: boolean
  showMarker?: boolean
  proximityRadius?: number
  maxShift?: number
  falloff?: 'linear' | 'smooth' | 'sharp'
  markerLength?: number
  markerGap?: number
  tickScale?: number
  scaleTick?: boolean
  itemGap?: number
  fontSize?: number
  smoothing?: number
  onItemClick?: (index: number, item: LineSidebarItem) => void
  className?: string
  isCompact?: boolean
  isMobile?: boolean
  startIndex?: number
}

const FALLOFF_CURVES = {
  linear: (p: number) => p,
  smooth: (p: number) => p * p * (3 - 2 * p),
  sharp: (p: number) => p * p * p,
}

export function LineSidebar({
  items,
  showIndex = true,
  showMarker = true,
  proximityRadius = 80,
  maxShift = 8,
  falloff = 'smooth',
  markerLength = 24,
  markerGap = 8,
  tickScale = 0.45,
  scaleTick = true,
  itemGap = 4,
  fontSize = 0.8125, // rem
  smoothing = 100, // ms
  onItemClick,
  className = '',
  isCompact = false,
  isMobile = false,
  startIndex = 1,
}: LineSidebarProps) {
  const location = useLocation()
  const listRef = useRef<HTMLUListElement | null>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const targetsRef = useRef<number[]>([])
  const currentRef = useRef<number[]>([])
  const rafRef = useRef<number | null>(null)
  const lastRef = useRef<number>(0)
  const smoothingRef = useRef<number>(smoothing)

  // Accurately determine active item based on current route
  const activeIndex = useMemo(() => {
    return items.findIndex((item) => {
      if (item.to === '/app') {
        return (
          location.pathname === '/app' ||
          location.pathname === '/app/' ||
          location.pathname === '/overview'
        )
      }
      return (
        location.pathname === item.to ||
        location.pathname.startsWith(`${item.to}/`) ||
        (item.to.startsWith('/app') && location.pathname.startsWith(item.to.replace('/app', '')))
      )
    })
  }, [items, location.pathname])

  const activeRef = useRef<number>(activeIndex)

  const isReduced = useMemo(() => prefersReducedMotion(), [])
  const isTouch = useMemo(() => isTouchOrMobileDevice() || isMobile, [isMobile])

  // Ref to hold the recursive animation function without hoisting or render-access issues
  const loopFnRef = useRef<((now: number) => void) | null>(null)

  useEffect(() => {
    loopFnRef.current = (now: number) => {
      if (isReduced || isTouch) return

      const dt = Math.min((now - lastRef.current) / 1000, 0.05)
      lastRef.current = now
      const tau = Math.max(smoothingRef.current, 1) / 1000
      const k = 1 - Math.exp(-dt / tau)

      let moving = false
      const elements = itemRefs.current
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i]
        if (!el) continue
        const target = Math.max(targetsRef.current[i] || 0, activeRef.current === i ? 1 : 0)
        const cur = currentRef.current[i] || 0
        const next = cur + (target - cur) * k
        const settled = Math.abs(target - next) < 0.0015
        const value = settled ? target : next
        currentRef.current[i] = value
        el.style.setProperty('--effect', value.toFixed(4))
        if (!settled) moving = true
      }

      if (moving && loopFnRef.current) {
        rafRef.current = requestAnimationFrame(loopFnRef.current)
      } else {
        rafRef.current = null
      }
    }
  }, [isReduced, isTouch])

  const startLoop = useCallback(() => {
    if (isReduced || isTouch) return

    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
    }

    lastRef.current = performance.now()
    if (loopFnRef.current) {
      rafRef.current = requestAnimationFrame(loopFnRef.current)
    }
  }, [isReduced, isTouch])

  // Keep state refs synchronized
  useEffect(() => {
    activeRef.current = activeIndex
    smoothingRef.current = smoothing
  }, [activeIndex, smoothing])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLUListElement>) => {
      if (isReduced || isTouch) return

      const list = listRef.current
      if (!list) return
      const rect = list.getBoundingClientRect()
      const pointerY = e.clientY - rect.top
      const ease = FALLOFF_CURVES[falloff] ?? FALLOFF_CURVES.smooth
      const elements = itemRefs.current

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i]
        if (!el) continue
        const center = el.offsetTop + el.offsetHeight / 2
        const distance = Math.abs(pointerY - center)
        targetsRef.current[i] = ease(Math.max(0, 1 - distance / proximityRadius))
      }
      startLoop()
    },
    [falloff, proximityRadius, startLoop, isReduced, isTouch],
  )

  const handlePointerLeave = useCallback(() => {
    if (isReduced || isTouch) return

    targetsRef.current = targetsRef.current.map(() => 0)
    startLoop()
  }, [startLoop, isReduced, isTouch])

  // Initialize or update active indicator on route change
  useEffect(() => {
    if (isReduced || isTouch) {
      // Instant set for reduced motion or touch devices
      itemRefs.current.forEach((el, i) => {
        if (!el) return
        const val = activeIndex === i ? 1 : 0
        currentRef.current[i] = val
        el.style.setProperty('--effect', String(val))
      })
      return
    }

    startLoop()
  }, [activeIndex, startLoop, isReduced, isTouch])

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [])

  return (
    <nav
      className={cn(
        'valora-line-sidebar',
        showMarker && !isCompact && 'valora-line-sidebar--markers',
        scaleTick && !isCompact && 'valora-line-sidebar--scale-tick',
        className,
      )}
      style={
        {
          '--line-marker-length': `${markerLength}px`,
          '--line-marker-gap': `${markerGap}px`,
          '--line-tick-scale': tickScale,
          '--line-max-shift': isCompact || isTouch ? '0px' : `${maxShift}px`,
          '--line-item-gap': `${itemGap}px`,
          '--line-font-size': `${fontSize}rem`,
          '--line-smoothing': `${smoothing}ms`,
        } as React.CSSProperties
      }
      aria-label="Sidebar main navigation"
    >
      <ul
        ref={listRef}
        className="valora-line-sidebar__list"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {items.map((item, index) => {
          const isActive = activeIndex === index
          const Icon = item.icon
          const displayIndex = String(startIndex + index).padStart(2, '0')

          return (
            <li
              key={item.to}
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              className="valora-line-sidebar__item"
              data-active={isActive ? 'true' : 'false'}
            >
              {showMarker && !isCompact && (
                <span className="valora-line-sidebar__marker" aria-hidden="true" />
              )}
              <NavLink
                to={item.to}
                onClick={() => onItemClick?.(index, item)}
                onPointerEnter={() => {
                  const key = pathToKey[item.to]
                  if (key) prefetchRoute(key)
                }}
                aria-current={isActive ? 'page' : undefined}
                className="valora-line-sidebar__link"
                title={isCompact ? item.label : undefined}
              >
                {Icon && (
                  <span className="valora-line-sidebar__icon">
                    <Icon className="h-4 w-4" />
                  </span>
                )}
                {!isCompact && showIndex && (
                  <span className="valora-line-sidebar__index" aria-hidden="true">
                    {displayIndex}
                  </span>
                )}
                {!isCompact && <span className="valora-line-sidebar__text">{item.label}</span>}
                {!isCompact && isActive && (
                  <span className="valora-line-sidebar__active-dot" aria-hidden="true" />
                )}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default LineSidebar
