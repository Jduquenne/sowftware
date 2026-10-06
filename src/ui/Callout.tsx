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
  success: 'border-forest-200 bg-forest-50 text-forest-800',
  warning: 'border-sun-300 bg-sun-100 text-sun-800',
}

const SIZE_CLASSES: Record<CalloutSize, string> = {
  sm: 'rounded-xl p-2.5 text-xs',
  md: 'rounded-2xl p-4 text-sm',
}

export function Callout({ tone = 'success', size = 'md', className = '', children }: CalloutProps) {
  return <div className={`border ${TONE_CLASSES[tone]} ${SIZE_CLASSES[size]} ${className}`}>{children}</div>
}
