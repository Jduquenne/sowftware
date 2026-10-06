import type { ReactNode, CSSProperties } from 'react'

interface ListRowProps {
  title: ReactNode
  subtitle?: ReactNode
  leading?: ReactNode
  trailing?: ReactNode
  footer?: ReactNode
  onClick?: () => void
  style?: CSSProperties
}

const ROW_CLASS = 'block w-full rounded-2xl border border-line bg-white px-4 py-3 text-left shadow-card'

export function ListRowGroup({ className = '', children }: { className?: string; children: ReactNode }) {
  return <ul className={`flex flex-col gap-2 ${className}`}>{children}</ul>
}

export function ListRow({ title, subtitle, leading, trailing, footer, onClick, style }: ListRowProps) {
  const content = (
    <>
      <div className="flex items-center gap-3">
        {leading}
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-forest-950">{title}</div>
          {subtitle && <div className="text-sm text-neutral-500">{subtitle}</div>}
        </div>
        {trailing}
      </div>
      {footer && <div className="mt-2.5 space-y-1.5">{footer}</div>}
    </>
  )

  if (onClick) {
    return (
      <li style={style}>
        <button type="button" onClick={onClick} className={`${ROW_CLASS} hover:border-forest-200`}>
          {content}
        </button>
      </li>
    )
  }

  return (
    <li style={style} className={ROW_CLASS}>
      {content}
    </li>
  )
}
