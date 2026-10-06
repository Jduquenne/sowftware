import type { FilterOption } from './Filter'

interface ToggleGroupProps<T> {
  options: FilterOption<T>[]
  active: T[]
  onToggle: (value: T) => void
  iconOnly?: boolean
}

function toggleClass(isActive: boolean, activeClass?: string) {
  return isActive ? (activeClass ?? 'bg-forest-700 text-white') : 'border border-line bg-white text-neutral-400'
}

export function ToggleChips<T>({ options, active, onToggle, iconOnly }: ToggleGroupProps<T>) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt, i) => {
        const isActive = active.includes(opt.value)
        const Icon = opt.icon
        return (
          <button
            key={i}
            type="button"
            onClick={() => onToggle(opt.value)}
            title={opt.label}
            aria-label={opt.label}
            className={`flex items-center gap-1 rounded-full ${iconOnly ? 'p-1.5' : 'px-3 py-1'} text-xs font-semibold ${toggleClass(isActive, opt.activeClass)}`}
          >
            {Icon && <Icon size={iconOnly ? 15 : 13} />}
            {!iconOnly && opt.label}
          </button>
        )
      })}
    </div>
  )
}

export function ToggleList<T>({ options, active, onToggle, iconOnly }: ToggleGroupProps<T>) {
  return (
    <div className={iconOnly ? 'flex gap-1' : 'flex flex-col gap-1'}>
      {options.map((opt, i) => {
        const isActive = active.includes(opt.value)
        const Icon = opt.icon
        return (
          <button
            key={i}
            type="button"
            onClick={() => onToggle(opt.value)}
            title={opt.label}
            aria-label={opt.label}
            className={`flex items-center gap-1.5 rounded-lg text-left text-xs font-semibold ${
              iconOnly ? 'justify-center p-1.5' : 'w-full px-2 py-1'
            } ${toggleClass(isActive, opt.activeClass)}`}
          >
            {Icon && <Icon size={iconOnly ? 15 : 13} />}
            {!iconOnly && opt.label}
          </button>
        )
      })}
    </div>
  )
}
