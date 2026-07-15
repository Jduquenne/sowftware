import { useSyncExternalStore } from 'react'

export const DESKTOP_QUERY = '(min-width: 768px)'

function subscribe(callback: () => void): () => void {
  const mql = window.matchMedia(DESKTOP_QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getSnapshot(): boolean {
  return window.matchMedia(DESKTOP_QUERY).matches
}

/** Single source of truth for the mobile/desktop presentation switch. */
export function useIsDesktop(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
