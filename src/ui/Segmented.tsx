import type { FilterOption } from './Filter'

interface SegmentedProps<T> {
  options: FilterOption<T>[]
  selected: T
  onSelect: (value: T) => void
}

export function Segmented<T>({ options, selected, onSelect }: SegmentedProps<T>) {
  return (
    <div className="inline-flex rounded-2xl border border-line bg-cream p-1">
      {options.map((opt, i) => {
        const active = selected === opt.value
        const Icon = opt.icon
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(opt.value)}
            aria-pressed={active}
            className={`flex items-center gap-2 rounded-xl px-4 py-1.5 text-sm font-semibold transition-colors ${
              active ? 'bg-white text-forest-900 shadow-card' : 'text-neutral-600 hover:text-forest-900'
            }`}
          >
            {Icon && <Icon size={16} />}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
