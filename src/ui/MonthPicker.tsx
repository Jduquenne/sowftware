import { MONTH_NAMES } from '../utils/months'

interface MonthPickerProps {
  month: number
  onSelect: (month: number) => void
  counts?: Record<number, number>
}

export function MonthPicker({ month, onSelect, counts }: MonthPickerProps) {
  return (
    <div className="mb-4 flex shrink-0 flex-wrap gap-1">
      {MONTH_NAMES.map((name, i) => {
        const m = i + 1
        const count = counts?.[m] ?? 0
        return (
          <button
            key={name}
            type="button"
            onClick={() => onSelect(m)}
            className={`rounded px-3 py-1 text-sm ${
              month === m ? 'bg-green-800 text-white' : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            {name}
            {counts && count > 0 && <span className="ml-1 text-[10px] opacity-70">{count}</span>}
          </button>
        )
      })}
    </div>
  )
}
