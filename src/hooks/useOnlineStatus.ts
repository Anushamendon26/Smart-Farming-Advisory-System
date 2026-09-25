import { useEffect, useState } from 'react'

export type ConnectionState = 'online' | 'limited' | 'offline'

/**
 * Online/offline status from browser connectivity events.
 * "Limited" is derived from the Network Information API where available
 * (slow effectiveType) — browsers without it simply report online/offline.
 */
export function useOnlineStatus(): ConnectionState {
  const [state, setState] = useState<ConnectionState>(() =>
    typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'online',
  )

  useEffect(() => {
    const evaluate = () => {
      if (!navigator.onLine) {
        setState('offline')
        return
      }
      // Non-standard, optional API — guarded access only.
      const net = (navigator as unknown as {
        connection?: { effectiveType?: string }
      }).connection
      const slow = net?.effectiveType === 'slow-2g' || net?.effectiveType === '2g'
      setState(slow ? 'limited' : 'online')
    }
    evaluate()
    window.addEventListener('online', evaluate)
    window.addEventListener('offline', evaluate)
    return () => {
      window.removeEventListener('online', evaluate)
      window.removeEventListener('offline', evaluate)
    }
  }, [])

  return state
}
