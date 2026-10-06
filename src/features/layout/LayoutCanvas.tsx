import type { ReactNode } from 'react'
import { AlertTriangle, Cloud, CloudSun, Sprout, Sun } from 'lucide-react'
import type { CatalogEntry, Exposition, Orientation, Placement, Plot } from '../../services/db'
import { CELL_SIZE_CM, footprintCells } from './logic/grid'
import { plantColor } from './logic/plantColor'
import { ORIENTATIONS, expositionLabel, orientationLabel, plotTypeLabel } from '../plots/logic/plotTypes'

const EXPOSITION_ICONS: Record<Exposition, typeof Sun> = {
  plein_soleil: Sun,
  mi_ombre: CloudSun,
  ombre: Cloud,
}

function InfoChip({ className = 'bg-white text-forest-950', children }: { className?: string; children: ReactNode }) {
  return (
    <span className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold shadow-card ${className}`}>
      {children}
    </span>
  )
}

interface PlotInfoBarProps {
  plot: Plot
  plantedCells: number
  availableCells: number
  conflictCount: number
  onOpenConflicts: () => void
}

export function PlotInfoBar({ plot, plantedCells, availableCells, conflictCount, onOpenConflicts }: PlotInfoBarProps) {
  const ExpositionIcon = plot.exposition ? EXPOSITION_ICONS[plot.exposition] : null
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <InfoChip>1 case = {CELL_SIZE_CM} cm</InfoChip>
      <InfoChip>
        {plotTypeLabel(plot.type)} · {plot.lengthCm} × {plot.widthCm} cm
      </InfoChip>
      {plot.exposition && ExpositionIcon && (
        <InfoChip className="bg-sun-100 text-sun-800">
          <ExpositionIcon size={16} />
          {expositionLabel(plot.exposition)}
        </InfoChip>
      )}
      <InfoChip>
        {plantedCells} cases plantées sur {availableCells}
      </InfoChip>
      <button type="button" onClick={onOpenConflicts}>
        {conflictCount > 0 ? (
          <InfoChip className="bg-sun-300 text-forest-950">
            <AlertTriangle size={16} />
            {conflictCount} conflit{conflictCount > 1 ? 's' : ''}
          </InfoChip>
        ) : (
          <InfoChip className="bg-forest-50 text-forest-700">
            <Sprout size={16} />
            Plan harmonieux
          </InfoChip>
        )}
      </button>
    </div>
  )
}

export function PlotCompass({ orientation }: { orientation: Orientation }) {
  const angle = ORIENTATIONS.findIndex((o) => o.value === orientation) * 45
  return (
    <div
      className="relative size-24 shrink-0 rounded-full border border-forest-200 bg-white/80 shadow-card"
      title={`Orientation : ${orientationLabel(orientation)}`}
    >
      <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-forest-900">N</span>
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-neutral-500">S</span>
      <span className="absolute top-1/2 left-1.5 -translate-y-1/2 text-[10px] font-bold text-neutral-500">O</span>
      <span className="absolute top-1/2 right-1.5 -translate-y-1/2 text-[10px] font-bold text-neutral-500">E</span>
      <svg viewBox="0 0 100 100" className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }} aria-hidden="true">
        <path d="M50 16 L57 50 L50 46 L43 50 Z" fill="var(--color-forest-600)" />
        <path d="M50 84 L57 50 L50 54 L43 50 Z" fill="var(--color-forest-200)" />
        <circle cx="50" cy="50" r="3" fill="var(--color-forest-900)" />
      </svg>
    </div>
  )
}

interface PlanLegendProps {
  placements: Placement[]
  catalogById: ReadonlyMap<string, CatalogEntry>
}

export function PlanLegend({ placements, catalogById }: PlanLegendProps) {
  const cellsByEntry = new Map<string, { entry: CatalogEntry; cells: number }>()
  for (const placement of placements) {
    const entry = catalogById.get(placement.catalogId)
    if (!entry) continue
    const size = footprintCells(entry)
    const current = cellsByEntry.get(entry.id) ?? { entry, cells: 0 }
    current.cells += size * size
    cellsByEntry.set(entry.id, current)
  }
  if (cellsByEntry.size === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="mr-2 text-xs font-bold tracking-[0.15em] text-forest-800 uppercase">Sur le plan</span>
      {[...cellsByEntry.values()].map(({ entry, cells }) => (
        <span key={entry.id} className="flex items-center gap-2 rounded-full bg-white py-1 pr-4 pl-1 text-sm shadow-card">
          <span
            className="size-6 rounded-full border-4 border-forest-600"
            style={{ backgroundColor: plantColor(entry.nomCommun) }}
          />
          <span className="font-semibold text-forest-950">{entry.nomCommun}</span>
          <span className="text-neutral-500">{cells} cases</span>
        </span>
      ))}
    </div>
  )
}
