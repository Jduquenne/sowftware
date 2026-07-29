import type { ReactNode, CSSProperties } from 'react'

interface ListRowProps {
  title: ReactNode
  subtitle?: ReactNode
  trailing?: ReactNode
  onClick?: () => void
  style?: CSSProperties
}

export function ListRow({ title, subtitle, trailing, onClick, style }: ListRowProps) {
  const content = (
    <>
      <div>
        <div className="font-medium text-neutral-800">{title}</div>
        {subtitle && <div className="text-sm text-neutral-500">{subtitle}</div>}
      </div>
      {trailing}
    </>
  )

  if (onClick) {
    return (
      <li style={style}>
        <button type="button" onClick={onClick} className="flex w-full items-center justify-between py-3 text-left">
          {content}
        </button>
      </li>
    )
  }

  return (
    <li style={style} className="flex items-center justify-between py-3">
      {content}
    </li>
  )
}
