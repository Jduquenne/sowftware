import type { Orientation } from '../../services/db'
import { ORIENTATIONS, orientationLabel } from './logic/plotTypes'

interface CompassPickerProps {
  value: Orientation | ''
  onChange: (value: Orientation | '') => void
}

const SIZE = 160
const RADIUS = 62
const CENTER = SIZE / 2

const SHORT_LABELS: Record<Orientation, string> = {
  nord: 'N',
  nord_est: 'NE',
  est: 'E',
  sud_est: 'SE',
  sud: 'S',
  sud_ouest: 'SO',
  ouest: 'O',
  nord_ouest: 'NO',
}

export function CompassPicker({ value, onChange }: CompassPickerProps) {
  return (
    <div>
      <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
        <div className="absolute inset-0 rounded-full border-2 border-forest-100 bg-cream" />
        <div className="absolute inset-5 rounded-full border border-dashed border-forest-200" />
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest-300" />
        {ORIENTATIONS.map((o, i) => {
          const angle = i * 45
          const rad = (angle * Math.PI) / 180
          const x = CENTER + RADIUS * Math.sin(rad)
          const y = CENTER - RADIUS * Math.cos(rad)
          const active = value === o.value
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(active ? '' : o.value)}
              title={o.label}
              style={{ left: x, top: y }}
              className={`absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xs font-semibold ${
                active
                  ? 'bg-forest-700 text-white shadow-sm'
                  : 'border border-line bg-white text-neutral-600 hover:border-forest-500 hover:text-forest-700'
              }`}
            >
              {SHORT_LABELS[o.value]}
            </button>
          )
        })}
      </div>
      <p className="mt-2 text-center text-xs text-neutral-500">
        {value ? orientationLabel(value) : 'Aucune orientation sélectionnée'}
      </p>
    </div>
  )
}
