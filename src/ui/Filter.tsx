import type { LucideIcon } from 'lucide-react'
import { IconTile } from './IconTile'

export interface FilterOption<T> {
  value: T
  label: string
  icon?: LucideIcon
  activeClass?: string
  /** Background + text classes of the icon tile, e.g. a category tint. */
  iconClass?: string
  count?: number
}

interface FilterProps<T> {
  options: FilterOption<T>[]
  selected: T
  onSelect: (value: T) => void
}

const DEFAULT_ACTIVE = 'border-forest-500 bg-forest-50 text-forest-900'
const DEFAULT_ICON = 'bg-cream text-forest-700'

export function FilterChips<T>({ options, selected, onSelect }: FilterProps<T>) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {options.map((opt, i) => {
        const active = selected === opt.value
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`flex shrink-0 items-center gap-2 rounded-full border py-1 text-sm font-semibold ${opt.icon ? 'pr-4 pl-1' : 'px-4'} ${
              active ? (opt.activeClass ?? DEFAULT_ACTIVE) : 'border-line bg-white text-neutral-700'
            }`}
          >
            {opt.icon && <IconTile icon={opt.icon} size="xs" round className={opt.iconClass ?? DEFAULT_ICON} />}
            {opt.label}
            {opt.count !== undefined && <span className="text-xs font-medium opacity-60">{opt.count}</span>}
          </button>
        )
      })}
    </div>
  )
}

export function FilterList<T>({ options, selected, onSelect }: FilterProps<T>) {
  return (
    <nav className="space-y-1">
      {options.map((opt, i) => {
        const active = selected === opt.value
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`flex w-full items-center gap-2.5 rounded-xl border px-2 py-1.5 text-left text-sm font-semibold ${
              active ? (opt.activeClass ?? DEFAULT_ACTIVE) : 'border-transparent text-neutral-700 hover:bg-cream'
            }`}
          >
            {opt.icon && <IconTile icon={opt.icon} size="xs" className={opt.iconClass ?? DEFAULT_ICON} />}
            <span className="min-w-0 flex-1 truncate">{opt.label}</span>
            {opt.count !== undefined && <span className="text-xs font-semibold opacity-60">{opt.count}</span>}
          </button>
        )
      })}
    </nav>
  )
}
