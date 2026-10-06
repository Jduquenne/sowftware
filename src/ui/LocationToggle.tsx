import { Shovel } from 'lucide-react'
import { FlowerPot } from './icons/FlowerPot'

interface LocationToggleProps {
  potActive: boolean
  groundActive: boolean
  onTogglePot: () => void
  onToggleGround: () => void
}

function chipClass(active: boolean) {
  return `flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold ${
    active ? 'border-forest-500 bg-forest-50 text-forest-900' : 'border-line bg-white text-neutral-600'
  }`
}

export function LocationToggle({ potActive, groundActive, onTogglePot, onToggleGround }: LocationToggleProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={onTogglePot} aria-pressed={potActive} className={chipClass(potActive)}>
        <FlowerPot size={15} />
        En pot
      </button>
      <button type="button" onClick={onToggleGround} aria-pressed={groundActive} className={chipClass(groundActive)}>
        <Shovel size={15} />
        En terre
      </button>
    </div>
  )
}
