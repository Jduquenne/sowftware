import type { ReactNode } from 'react'

interface ListRowProps {
  title: ReactNode
  subtitle?: ReactNode
  trailing?: ReactNode
  onClick?: () => void
}

export function ListRow({ title, subtitle, trailing, onClick }: ListRowProps) {
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
      <li>
        <button type="button" onClick={onClick} className="flex w-full items-center justify-between py-3 text-left">
          {content}
        </button>
      </li>
    )
  }

  return <li className="flex items-center justify-between py-3">{content}</li>
}
