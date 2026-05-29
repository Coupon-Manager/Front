import { useEffect, useRef, useState } from 'react'

const THRESHOLD = 80

export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [refreshing, setRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const onRefreshRef = useRef(onRefresh)
  onRefreshRef.current = onRefresh

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) startY.current = e.touches[0].clientY
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!startY.current) return
      const delta = e.touches[0].clientY - startY.current
      if (delta > 0 && window.scrollY === 0) setPullDistance(delta)
    }

    const onTouchEnd = async (e: TouchEvent) => {
      const delta = e.changedTouches[0].clientY - startY.current
      startY.current = 0
      setPullDistance(0)
      if (delta >= THRESHOLD) {
        setRefreshing(true)
        await onRefreshRef.current()
        setRefreshing(false)
      }
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchmove', onTouchMove, { passive: true })
    document.addEventListener('touchend', onTouchEnd)
    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  return { refreshing, pulling: pullDistance >= THRESHOLD / 2 }
}
