import { MONTH_NAMES } from '../utils/months'

interface MonthPickerProps {
  month: number
  onSelect: (month: number) => void
  counts?: Record<number, number>
}

export function MonthPicker({ month, onSelect, counts }: MonthPickerProps) {
  return (
    <div className="mb-4 flex shrink-0 flex-wrap gap-1.5">
      {MONTH_NAMES.map((name, i) => {
        const m = i + 1
        const count = counts?.[m] ?? 0
        return (
          <button
            key={name}
            type="button"
            onClick={() => onSelect(m)}
            className={`rounded-full px-3.5 py-1 text-sm font-semibold ${
              month === m ? 'bg-forest-700 text-white shadow-sm' : 'border border-line bg-white text-neutral-600 hover:bg-cream'
            }`}
          >
            {name}
            {counts && count > 0 && <span className="ml-1.5 text-[11px] opacity-60">{count}</span>}
          </button>
        )
      })}
    </div>
  )
}
