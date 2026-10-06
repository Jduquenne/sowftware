import { getCurrentMonth } from '../utils/months'

export interface YearStripRow {
  label: string
  months: number[]
  colorClass: string
  title?: string
}

interface YearStripProps {
  rows: YearStripRow[]
  currentMonth?: number
  className?: string
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

export function YearStrip({ rows, currentMonth = getCurrentMonth(), className = '' }: YearStripProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-2" title={row.title}>
          <span className="w-2.5 text-[10px] leading-none font-bold text-neutral-500">{row.label}</span>
          <div className="grid flex-1 grid-cols-12 gap-[3px]">
            {MONTHS.map((m) => {
              const active = row.months.includes(m)
              const current = m === currentMonth
              return (
                <span
                  key={m}
                  className={`h-1.5 rounded-full ${active ? row.colorClass : current ? 'bg-sun-100' : 'bg-neutral-200/70'} ${
                    current ? 'outline-[1.5px] outline-offset-1 outline-sun-500' : ''
                  }`}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
