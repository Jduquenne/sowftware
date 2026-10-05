import { useState } from 'react'
import { useStore } from '../../store'
import type { CatalogEntry } from '../../services/db'
import { entryFootprint, findFreeAnchor } from './logic/grid'
import { buildPlotOccupancy, plotWideConflicts } from './logic/occupancy'
import { isLayoutable } from '../plots/logic/plotTypes'
import { getChildren } from '../plots/logic/hierarchy'
import { Button } from '../../ui/Button'
import { Select } from '../../ui/Input'
import { CatalogSearchSelect } from '../../ui/CatalogSearchSelect'
import { Callout } from '../../ui/Callout'
import { EmptyState } from '../../ui/EmptyState'

export function LayoutMobile() {
  const plots = useStore((s) => s.plots)
  const catalog = useStore((s) => s.catalog)
  const catalogById = useStore((s) => s.catalogById)
  const placements = useStore((s) => s.placements)
  const addPlacement = useStore((s) => s.addPlacement)
  const removePlacement = useStore((s) => s.removePlacement)

  const lastSelectedPlotId = useStore((s) => s.lastSelectedPlotId)
  const setLastSelectedPlotId = useStore((s) => s.setLastSelectedPlotId)

  const layoutablePlots = plots.filter(isLayoutable)
  const rememberedPlotId = layoutablePlots.find((p) => p.id === lastSelectedPlotId)?.id
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(
    rememberedPlotId ?? layoutablePlots[0]?.id ?? null,
  )
  const [mode, setMode] = useState<'list' | 'add'>('list')
  const [addError, setAddError] = useState<string | null>(null)

  if (layoutablePlots.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-lg font-semibold text-green-800">Disposition</h1>
        <p className="mt-3 text-sm text-neutral-500">
          Créez d'abord une parcelle avec des dimensions — pas disponible pour les parcelles en pot.
        </p>
      </div>
    )
  }

  const plot = layoutablePlots.find((p) => p.id === selectedPlotId)
  const plotPlacements = placements.filter((p) => p.plotId === selectedPlotId)

  const handleAdd = async (entry: CatalogEntry) => {
    if (!plot) return
    const { grid, occupied } = buildPlotOccupancy(plot, plotPlacements, getChildren(plot.id, plots), catalogById)
    const anchor = findFreeAnchor(entryFootprint(entry), grid, occupied)
    if (!anchor) {
      setAddError(`Aucun emplacement disponible pour ${entry.nomCommun} dans cette parcelle.`)
      return
    }
    await addPlacement({ plotId: plot.id, catalogId: entry.id, plantingId: null, x: anchor.x, y: anchor.y })
    setMode('list')
    setAddError(null)
  }

  if (mode === 'add') {
    return (
      <div className="p-4">
        <h1 className="mb-3 text-lg font-semibold text-green-800">Ajouter une plante</h1>
        <CatalogSearchSelect catalog={catalog} onSelect={handleAdd} error={addError} />
        <Button variant="secondary" onClick={() => setMode('list')} className="mt-3">
          Annuler
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold text-green-800">Disposition</h1>

      <Select
        value={selectedPlotId ?? ''}
        onChange={(e) => {
          setSelectedPlotId(e.target.value)
          setLastSelectedPlotId(e.target.value)
        }}
        className="mt-2"
      >
        {layoutablePlots.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </Select>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-neutral-400">{plotPlacements.length} plante(s) placée(s)</p>
        <Button onClick={() => setMode('add')}>+ Ajouter</Button>
      </div>

      <ul className="mt-3 divide-y divide-neutral-200">
        {plotPlacements.map((placement) => {
          const entry = catalogById.get(placement.catalogId)
          const conflicts = plotWideConflicts(placement, plotPlacements, catalogById)
          return (
            <li key={placement.id} className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-neutral-800">{entry?.nomCommun}</div>
                  <div className="text-sm text-neutral-500">
                    {entry?.variete} — espacement {entry?.espacementRaw || '—'} cm
                  </div>
                </div>
                <Button variant="link-danger" onClick={() => removePlacement(placement.id)}>
                  Retirer
                </Button>
              </div>
              {conflicts.map(({ neighbor, reason }) => (
                <Callout key={neighbor.id} tone="warning" size="sm" className="mt-1">
                  ⚠️ Conflit avec {catalogById.get(neighbor.catalogId)?.nomCommun} : {reason}
                </Callout>
              ))}
            </li>
          )
        })}
      </ul>

      {plotPlacements.length === 0 && <EmptyState className="mt-6">Aucune plante placée dans cette parcelle.</EmptyState>}
    </div>
  )
}
