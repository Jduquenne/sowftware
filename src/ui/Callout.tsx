import type { ReactNode } from 'react'

type CalloutTone = 'success' | 'warning'
type CalloutSize = 'sm' | 'md'

interface CalloutProps {
  tone?: CalloutTone
  size?: CalloutSize
  className?: string
  children: ReactNode
}

const TONE_CLASSES: Record<CalloutTone, string> = {
  success: 'bg-green-50 text-green-800',
  warning: 'bg-amber-50 text-amber-800',
}

const SIZE_CLASSES: Record<CalloutSize, string> = {
  sm: 'p-2 text-xs',
  md: 'p-3 text-sm',
}

export function Callout({ tone = 'success', size = 'md', className = '', children }: CalloutProps) {
  return <div className={`rounded ${TONE_CLASSES[tone]} ${SIZE_CLASSES[size]} ${className}`}>{children}</div>
}
