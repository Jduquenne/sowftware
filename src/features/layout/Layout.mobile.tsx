import { useState } from 'react'
import { useStore } from '../../store'
import type { CatalogEntry } from '../../services/db'
import { isLayoutable, getGridDimensions, footprintCells, occupiedCells, findFreeAnchor } from './logic/grid'
import { getCompanionRelation } from './logic/companions'
import { Button } from '../../ui/Button'
import { Select } from '../../ui/Input'
import { CatalogSearchSelect } from '../../ui/CatalogSearchSelect'
import { Callout } from '../../ui/Callout'
import { EmptyState } from '../../ui/EmptyState'

export function LayoutMobile() {
  const plots = useStore((s) => s.plots)
  const catalog = useStore((s) => s.catalog)
  const placements = useStore((s) => s.placements)
  const addPlacement = useStore((s) => s.addPlacement)
  const removePlacement = useStore((s) => s.removePlacement)

  const layoutablePlots = plots.filter(isLayoutable)
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(layoutablePlots[0]?.id ?? null)
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
  const entryFor = (catalogId: string): CatalogEntry | undefined => catalog.find((c) => c.id === catalogId)

  function conflictsFor(placementId: string): { name: string; reason: string }[] {
    const placement = plotPlacements.find((p) => p.id === placementId)
    const entry = placement ? entryFor(placement.catalogId) : undefined
    if (!placement || !entry) return []
    const results: { name: string; reason: string }[] = []
    for (const other of plotPlacements) {
      if (other.id === placement.id) continue
      const otherEntry = entryFor(other.catalogId)
      if (!otherEntry) continue
      const check = getCompanionRelation(entry, otherEntry)
      if (check?.relation === 'avoid') {
        results.push({ name: otherEntry.nomCommun, reason: check.reason })
      }
    }
    return results
  }

  const handleAdd = async (entry: CatalogEntry) => {
    if (!plot) return
    const grid = getGridDimensions(plot)
    const footprint = footprintCells(entry)
    const occupied = plotPlacements.flatMap((p) => {
      const e = entryFor(p.catalogId)
      return e ? occupiedCells(p, footprintCells(e)) : []
    })
    const anchor = findFreeAnchor(footprint, grid, occupied)
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
        onChange={(e) => setSelectedPlotId(e.target.value)}
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
          const entry = entryFor(placement.catalogId)
          const conflicts = conflictsFor(placement.id)
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
              {conflicts.map((c) => (
                <Callout key={c.name} tone="warning" size="sm" className="mt-1">
                  ⚠️ Conflit avec {c.name} : {c.reason}
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
