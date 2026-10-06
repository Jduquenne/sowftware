import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { IconTile } from './IconTile'

interface StatCardProps {
  icon: LucideIcon
  iconClass?: string
  value: ReactNode
  label: ReactNode
  size?: 'md' | 'sm'
  children?: ReactNode
}

export function StatCard({ icon, iconClass, value, label, size = 'md', children }: StatCardProps) {
  const compact = size === 'sm'
  return (
    <div className={`rounded-3xl border border-line bg-white shadow-card ${compact ? 'p-4' : 'p-6'}`}>
      <div className={`flex items-center ${compact ? 'gap-3' : 'gap-5'}`}>
        <IconTile icon={icon} size={compact ? 'md' : 'lg'} className={iconClass} />
        <div className="min-w-0">
          <div className={`font-display leading-none font-semibold text-forest-900 ${compact ? 'text-3xl' : 'text-5xl'}`}>
            {value}
          </div>
          <div className={`mt-1 text-neutral-600 ${compact ? 'text-sm' : 'text-[15px]'}`}>{label}</div>
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
