import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: ReactNode
  subtitle?: ReactNode
  eyebrow?: ReactNode
  actions?: ReactNode
  variant?: 'desktop' | 'mobile'
}

export function PageHeader({ title, subtitle, eyebrow, actions, variant = 'desktop' }: PageHeaderProps) {
  if (variant === 'mobile') {
    return (
      <header className="shrink-0 px-5 pt-6 pb-3">
        {eyebrow && <div className="mb-1 text-sm text-neutral-500">{eyebrow}</div>}
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="font-display text-[32px] leading-tight font-semibold text-forest-900">{title}</h1>
          {actions && <div className="shrink-0 text-sm text-neutral-500">{actions}</div>}
        </div>
        {subtitle && <p className="mt-0.5 text-sm text-neutral-500">{subtitle}</p>}
      </header>
    )
  }

  return (
    <header className="flex shrink-0 items-center justify-between gap-6 border-b border-line bg-cream/85 px-10 py-5 backdrop-blur">
      <div className="min-w-0">
        {eyebrow && <div className="mb-0.5 text-sm text-neutral-500">{eyebrow}</div>}
        <h1 className="font-display text-4xl leading-tight font-semibold text-forest-900">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[15px] text-neutral-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  )
}
