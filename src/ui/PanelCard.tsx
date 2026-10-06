import type { ReactNode } from 'react'

interface PanelCardProps {
  title?: ReactNode
  className?: string
  children: ReactNode
}

export function PanelCard({ title, className = '', children }: PanelCardProps) {
  return (
    <div className={`rounded-3xl border border-line bg-white p-4 shadow-card ${className}`}>
      {title && <div className="mb-3 px-1 text-xs font-bold tracking-[0.15em] text-neutral-500 uppercase">{title}</div>}
      {children}
    </div>
  )
}
