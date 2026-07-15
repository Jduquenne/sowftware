import { monthName, nextMonth, previousMonth } from '../utils/months'

interface MonthNavProps {
  month: number
  onChange: (month: number) => void
}

export function MonthNav({ month, onChange }: MonthNavProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={() => onChange(previousMonth(month))}
        className="px-2 py-1 text-neutral-500"
        aria-label="Mois précédent"
      >
        ←
      </button>
      <h1 className="text-lg font-semibold text-green-800">{monthName(month)}</h1>
      <button
        type="button"
        onClick={() => onChange(nextMonth(month))}
        className="px-2 py-1 text-neutral-500"
        aria-label="Mois suivant"
      >
        →
      </button>
    </div>
  )
}
