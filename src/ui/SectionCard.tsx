import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { IconTile } from './IconTile'

interface SectionHeadingProps {
  title: ReactNode
  icon?: LucideIcon
  iconClass?: string
  badge?: ReactNode
  action?: ReactNode
  className?: string
}

export function SectionHeading({ title, icon, iconClass, badge, action, className = '' }: SectionHeadingProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {icon && <IconTile icon={icon} size="md" className={iconClass} />}
      <h2 className="font-display text-2xl font-semibold text-forest-900">{title}</h2>
      {badge}
      {action && <div className="ml-auto shrink-0 text-sm">{action}</div>}
    </div>
  )
}

interface SectionCardProps extends SectionHeadingProps {
  children: ReactNode
}

export function SectionCard({ children, className = '', ...heading }: SectionCardProps) {
  return (
    <section className={`rounded-3xl border border-line bg-white p-6 shadow-card ${className}`}>
      <SectionHeading {...heading} className="mb-5" />
      {children}
    </section>
  )
}
