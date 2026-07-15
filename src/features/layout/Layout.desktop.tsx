import { useState } from 'react'
import { useStore } from '../../store'
import type { CatalogEntry, Placement } from '../../services/db'
import {
  CELL_SIZE_CM,
  isLayoutable,
  getGridDimensions,
  footprintCells,
  occupiedCells,
  adjacentCells,
  canPlaceAt,
  type Cell,
} from './logic/grid'
import { getCompanionRelation } from './logic/companions'
import { Button } from '../../ui/Button'
import { Select } from '../../ui/Input'
import { CatalogSearchSelect } from '../../ui/CatalogSearchSelect'
import { Callout } from '../../ui/Callout'
import { EmptyState } from '../../ui/EmptyState'
import { DetailAside, DetailAsideHeading } from '../../ui/DetailAside'

type Interaction = { type: 'idle' } | { type: 'pick'; x: number; y: number } | { type: 'detail'; placementId: string }

const CELL_PX = 44

export function LayoutDesktop() {
  const plots = useStore((s) => s.plots)
  const catalog = useStore((s) => s.catalog)
  const placements = useStore((s) => s.placements)
  const addPlacement = useStore((s) => s.addPlacement)
  const removePlacement = useStore((s) => s.removePlacement)

  const layoutablePlots = plots.filter(isLayoutable)
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(layoutablePlots[0]?.id ?? null)
  const [interaction, setInteraction] = useState<Interaction>({ type: 'idle' })
  const [placeError, setPlaceError] = useState<string | null>(null)

  const plot = layoutablePlots.find((p) => p.id === selectedPlotId)

  if (layoutablePlots.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold text-green-800">Assistant de disposition</h1>
        <p className="mt-3 text-sm text-neutral-500">
          Créez d'abord une parcelle avec des dimensions (jardin, terrasse ou potager) — l'assistant ne
          s'applique pas aux parcelles en pot.
        </p>
      </div>
    )
  }

  const plotPlacements = placements.filter((p) => p.plotId === selectedPlotId)
  const grid = plot ? getGridDimensions(plot) : { cols: 0, rows: 0 }

  const entryFor = (catalogId: string): CatalogEntry | undefined => catalog.find((c) => c.id === catalogId)

  const allOccupied: Cell[] = plotPlacements.flatMap((p) => {
    const entry = entryFor(p.catalogId)
    return entry ? occupiedCells(p, footprintCells(entry)) : []
  })

  const cellMap = new Map<string, Placement>()
  for (const p of plotPlacements) {
    const entry = entryFor(p.catalogId)
    if (!entry) continue
    for (const cell of occupiedCells(p, footprintCells(entry))) {
      cellMap.set(`${cell.x}:${cell.y}`, p)
    }
  }

  function conflictsFor(placement: Placement): { neighbor: Placement; reason: string }[] {
    const entry = entryFor(placement.catalogId)
    if (!entry) return []
    const footprint = footprintCells(entry)
    const neighborIds = new Set<string>()
    const conflicts: { neighbor: Placement; reason: string }[] = []
    for (const cell of adjacentCells(placement, footprint)) {
      const neighbor = cellMap.get(`${cell.x}:${cell.y}`)
      if (!neighbor || neighbor.id === placement.id || neighborIds.has(neighbor.id)) continue
      const neighborEntry = entryFor(neighbor.catalogId)
      if (!neighborEntry) continue
      const check = getCompanionRelation(entry, neighborEntry)
      if (check?.relation === 'avoid') {
        neighborIds.add(neighbor.id)
        conflicts.push({ neighbor, reason: check.reason })
      }
    }
    return conflicts
  }

  const conflictingPlacementIds = new Set(
    plotPlacements.filter((p) => conflictsFor(p).length > 0).map((p) => p.id),
  )

  const handlePick = async (entry: CatalogEntry) => {
    if (interaction.type !== 'pick' || !plot) return
    const footprint = footprintCells(entry)
    const anchor = { x: interaction.x, y: interaction.y }
    if (!canPlaceAt(anchor, footprint, grid, allOccupied)) {
      setPlaceError(
        `${entry.nomCommun} nécessite un espace de ${footprint}×${footprint} cases, indisponible ici.`,
      )
      return
    }
    await addPlacement({ plotId: plot.id, catalogId: entry.id, plantingId: null, x: anchor.x, y: anchor.y })
    setInteraction({ type: 'idle' })
    setPlaceError(null)
  }

  const detailPlacement =
    interaction.type === 'detail' ? plotPlacements.find((p) => p.id === interaction.placementId) : undefined

  return (
    <div className="flex h-full">
      <div className="flex min-h-0 flex-1 flex-col p-6">
        <div className="mb-4 flex shrink-0 items-baseline justify-between">
          <h1 className="text-xl font-semibold text-green-800">Assistant de disposition</h1>
          <div className="w-48">
            <Select
              value={selectedPlotId ?? ''}
              onChange={(e) => {
                setSelectedPlotId(e.target.value)
                setInteraction({ type: 'idle' })
              }}
            >
              {layoutablePlots.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {plot && (
          <>
            <p className="mb-3 shrink-0 text-xs text-neutral-400">
              Grille {grid.cols}×{grid.rows} cases ({CELL_SIZE_CM} cm/case) — {plot.lengthCm}×{plot.widthCm} cm
            </p>
            <div className="min-h-0 flex-1 overflow-auto">
              <div
                className="grid gap-0.5"
                style={{
                  gridTemplateColumns: `repeat(${grid.cols}, ${CELL_PX}px)`,
                  gridTemplateRows: `repeat(${grid.rows}, ${CELL_PX}px)`,
                }}
              >
                {Array.from({ length: grid.cols }).flatMap((_, x) =>
                  Array.from({ length: grid.rows }).map((_, y) => {
                    const placement = cellMap.get(`${x}:${y}`)
                    if (placement && (placement.x !== x || placement.y !== y)) return null

                    if (placement) {
                      const entry = entryFor(placement.catalogId)
                      const footprint = entry ? footprintCells(entry) : 1
                      const hasConflict = conflictingPlacementIds.has(placement.id)
                      return (
                        <button
                          key={`${x}:${y}`}
                          type="button"
                          onClick={() => setInteraction({ type: 'detail', placementId: placement.id })}
                          style={{
                            gridColumn: `${x + 1} / span ${footprint}`,
                            gridRow: `${y + 1} / span ${footprint}`,
                          }}
                          className={`flex flex-col items-center justify-center overflow-hidden rounded p-0.5 text-center text-[10px] leading-tight text-white ${
                            hasConflict ? 'bg-amber-600' : 'bg-green-700'
                          }`}
                        >
                          {hasConflict && <span>⚠️</span>}
                          <span className="truncate">{entry?.nomCommun}</span>
                        </button>
                      )
                    }

                    return (
                      <button
                        key={`${x}:${y}`}
                        type="button"
                        onClick={() => {
                          setInteraction({ type: 'pick', x, y })
                          setPlaceError(null)
                        }}
                        style={{ gridColumn: `${x + 1} / span 1`, gridRow: `${y + 1} / span 1` }}
                        className="rounded border border-dashed border-neutral-300 text-neutral-300 hover:border-green-600 hover:text-green-600"
                      >
                        +
                      </button>
                    )
                  }),
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <DetailAside>
        {interaction.type === 'idle' && (
          <EmptyState>Cliquez une case vide pour y placer une plante, ou une case occupée pour voir son détail.</EmptyState>
        )}

        {interaction.type === 'pick' && (
          <>
            <DetailAsideHeading>Choisir une plante</DetailAsideHeading>
            <CatalogSearchSelect
              catalog={catalog}
              onSelect={handlePick}
              error={placeError}
              renderResultExtra={(c) => (
                <span className="ml-1 text-xs text-neutral-400">
                  ({footprintCells(c)}×{footprintCells(c)})
                </span>
              )}
            />
            <Button variant="secondary" onClick={() => setInteraction({ type: 'idle' })} className="mt-3">
              Annuler
            </Button>
          </>
        )}

        {interaction.type === 'detail' && detailPlacement && (
          <>
            {(() => {
              const entry = entryFor(detailPlacement.catalogId)
              const conflicts = conflictsFor(detailPlacement)
              return (
                <>
                  <h2 className="mb-1 text-sm font-semibold text-green-800">{entry?.nomCommun}</h2>
                  <p className="text-xs text-neutral-500">{entry?.variete}</p>
                  <p className="mt-2 text-xs text-neutral-500">
                    Espacement recommandé : {entry?.espacementRaw || '—'} cm
                  </p>
                  {conflicts.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {conflicts.map(({ neighbor, reason }) => {
                        const neighborEntry = entryFor(neighbor.catalogId)
                        return (
                          <Callout key={neighbor.id} tone="warning" size="sm">
                            ⚠️ Conflit avec {neighborEntry?.nomCommun} : {reason}
                          </Callout>
                        )
                      })}
                    </div>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="danger"
                      onClick={async () => {
                        await removePlacement(detailPlacement.id)
                        setInteraction({ type: 'idle' })
                      }}
                    >
                      Retirer
                    </Button>
                    <Button variant="secondary" onClick={() => setInteraction({ type: 'idle' })}>
                      Fermer
                    </Button>
                  </div>
                </>
              )
            })()}
          </>
        )}
      </DetailAside>
    </div>
  )
}
