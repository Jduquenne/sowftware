import { useState } from 'react'
import { Plus } from 'lucide-react'
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
import { PageHeader } from '../../ui/PageHeader'
import { Badge } from '../../ui/Badge'
import { ListRow, ListRowGroup } from '../../ui/ListRow'
import { EntryThumb } from '../../ui/EntryThumb'
import { expositionLabel, plotTypeLabel } from '../plots/logic/plotTypes'

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
      <div>
        <PageHeader variant="mobile" title="Disposition" />
        <EmptyState className="px-5">
          Créez d'abord une parcelle avec des dimensions — pas disponible pour les parcelles en pot.
        </EmptyState>
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
      <div>
        <PageHeader variant="mobile" title="Ajouter une plante" subtitle={plot?.name} />
        <div className="px-5">
          <CatalogSearchSelect catalog={catalog} onSelect={handleAdd} error={addError} />
          <Button variant="secondary" onClick={() => setMode('list')} className="mt-4">
            Annuler
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        variant="mobile"
        title="Disposition"
        actions={`${plotPlacements.length} plante${plotPlacements.length > 1 ? 's' : ''}`}
      />

      <div className="space-y-4 px-5 pb-4">
        <Select
          value={selectedPlotId ?? ''}
          onChange={(e) => {
            setSelectedPlotId(e.target.value)
            setLastSelectedPlotId(e.target.value)
          }}
        >
          {layoutablePlots.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>

        {plot && (
          <div className="flex flex-wrap gap-1.5">
            <Badge pill className="bg-white py-1 text-forest-950 shadow-card">
              {plotTypeLabel(plot.type)} · {plot.lengthCm} × {plot.widthCm} cm
            </Badge>
            {plot.exposition && (
              <Badge pill className="bg-sun-100 py-1 text-sun-800">
                {expositionLabel(plot.exposition)}
              </Badge>
            )}
          </div>
        )}

        <Button onClick={() => setMode('add')} className="w-full">
          <Plus size={16} />
          Ajouter une plante
        </Button>

        {plotPlacements.length === 0 ? (
          <EmptyState>Aucune plante placée dans cette parcelle.</EmptyState>
        ) : (
          <ListRowGroup>
            {plotPlacements.map((placement) => {
              const entry = catalogById.get(placement.catalogId)
              const conflicts = plotWideConflicts(placement, plotPlacements, catalogById)
              return (
                <ListRow
                  key={placement.id}
                  leading={<EntryThumb entry={entry} />}
                  title={entry?.nomCommun}
                  subtitle={`${entry?.variete ?? ''} · espacement ${entry?.espacementRaw || '—'} cm`}
                  trailing={
                    <Button variant="link-danger" onClick={() => removePlacement(placement.id)}>
                      Retirer
                    </Button>
                  }
                  footer={
                    conflicts.length > 0 &&
                    conflicts.map(({ neighbor, reason }) => (
                      <Callout key={neighbor.id} tone="warning" size="sm">
                        <strong>Conflit avec {catalogById.get(neighbor.catalogId)?.nomCommun}</strong> : {reason}
                      </Callout>
                    ))
                  }
                />
              )
            })}
          </ListRowGroup>
        )}
      </div>
    </div>
  )
}
