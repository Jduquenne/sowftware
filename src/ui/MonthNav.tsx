import { ChevronLeft, ChevronRight } from 'lucide-react'
import { monthName, nextMonth, previousMonth } from '../utils/months'

interface MonthNavProps {
  month: number
  onChange: (month: number) => void
}

const ARROW_CLASS = 'flex size-10 items-center justify-center rounded-full border border-line bg-white text-forest-700'

export function MonthNav({ month, onChange }: MonthNavProps) {
  return (
    <div className="flex items-center justify-between">
      <button type="button" onClick={() => onChange(previousMonth(month))} className={ARROW_CLASS} aria-label="Mois précédent">
        <ChevronLeft size={18} />
      </button>
      <h1 className="font-display text-2xl font-semibold text-forest-900">{monthName(month)}</h1>
      <button type="button" onClick={() => onChange(nextMonth(month))} className={ARROW_CLASS} aria-label="Mois suivant">
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
