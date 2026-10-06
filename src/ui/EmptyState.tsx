import type { ReactNode } from 'react'

type EmptyStateSize = 'xs' | 'sm'

interface EmptyStateProps {
  size?: EmptyStateSize
  className?: string
  children: ReactNode
}

const SIZE_CLASSES: Record<EmptyStateSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
}

export function EmptyState({ size = 'sm', className = '', children }: EmptyStateProps) {
  return <p className={`text-neutral-500 ${SIZE_CLASSES[size]} ${className}`}>{children}</p>
}
