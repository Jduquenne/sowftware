import type { LucideIcon } from 'lucide-react'

export interface FilterOption<T> {
  value: T
  label: string
  icon?: LucideIcon
  activeClass?: string
  iconClass?: string
}

interface FilterProps<T> {
  options: FilterOption<T>[]
  selected: T
  onSelect: (value: T) => void
}

const DEFAULT_ACTIVE = 'bg-neutral-700 text-white'

export function FilterChips<T>({ options, selected, onSelect }: FilterProps<T>) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {options.map((opt, i) => {
        const active = selected === opt.value
        const Icon = opt.icon
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-sm ${
              active ? (opt.activeClass ?? DEFAULT_ACTIVE) : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            {Icon && <Icon size={14} className={active ? '' : opt.iconClass} />}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export function FilterList<T>({ options, selected, onSelect }: FilterProps<T>) {
  return (
    <nav className="space-y-0.5">
      {options.map((opt, i) => {
        const active = selected === opt.value
        const Icon = opt.icon
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-xs ${
              active ? (opt.activeClass ?? DEFAULT_ACTIVE) : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {Icon && <Icon size={13} className={active ? '' : opt.iconClass} />}
            {opt.label}
          </button>
        )
      })}
    </nav>
  )
}
