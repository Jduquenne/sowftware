import { MONTH_NAMES_SHORT } from '../utils/months'

interface MiniYearStripSeries {
  months: number[]
  colorClass: string
}

interface MiniYearStripProps {
  series: MiniYearStripSeries[]
}

export function MiniYearStrip({ series }: MiniYearStripProps) {
  return (
    <div className="mt-2 flex gap-[3px]">
      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
        <div key={m} className="flex flex-1 flex-col items-center gap-0.5">
          <div className="flex gap-0.5">
            {series.map((s, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${s.months.includes(m) ? s.colorClass : 'bg-neutral-200'}`}
              />
            ))}
          </div>
          <span className="text-[8px] leading-none text-neutral-400">{MONTH_NAMES_SHORT[m - 1][0]}</span>
        </div>
      ))}
    </div>
  )
}
