import type { ReactNode, CSSProperties } from 'react'

interface ListRowProps {
  title: ReactNode
  subtitle?: ReactNode
  leading?: ReactNode
  trailing?: ReactNode
  onClick?: () => void
  style?: CSSProperties
}

const ROW_CLASS = 'flex w-full items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-left shadow-card'

export function ListRowGroup({ className = '', children }: { className?: string; children: ReactNode }) {
  return <ul className={`flex flex-col gap-2 ${className}`}>{children}</ul>
}

export function ListRow({ title, subtitle, leading, trailing, onClick, style }: ListRowProps) {
  const content = (
    <>
      {leading}
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-forest-950">{title}</div>
        {subtitle && <div className="text-sm text-neutral-500">{subtitle}</div>}
      </div>
      {trailing}
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
