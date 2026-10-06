import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface BadgeProps {
  icon?: LucideIcon
  pill?: boolean
  className?: string
  title?: string
  children?: ReactNode
}

export function Badge({ icon: Icon, pill = false, className = '', title, children }: BadgeProps) {
  return (
    <span
      title={title}
      className={`inline-flex w-fit items-center gap-1 ${pill ? 'rounded-full px-2.5' : 'rounded-md px-2'} py-0.5 text-xs font-semibold ${className}`}
    >
      {Icon && <Icon size={12} />}
      {children}
    </span>
  )
}
