import { useEffect, useState } from 'react'
import { useStore } from '../../store'
import type { CatalogEntry, Placement, Plot } from '../../services/db'
import {
  CELL_SIZE_CM,
  getGridDimensions,
  footprintCells,
  plotFootprint,
  occupiedCells,
  adjacentCells,
  canPlaceAt,
  type Cell,
} from './logic/grid'
import { getCompanionRelation } from './logic/companions'
import { isLayoutable } from '../plots/logic/plotTypes'
import { getChildren, flattenHierarchy } from '../plots/logic/hierarchy'
import { useSearchParamState } from '../../utils/useSearchParamState'
import { Button } from '../../ui/Button'
import { Select } from '../../ui/Input'
import { CatalogSearchSelect } from '../../ui/CatalogSearchSelect'
import { Callout } from '../../ui/Callout'

type Interaction =
  | { type: 'idle' }
  | { type: 'pick'; x: number; y: number }
  | { type: 'detail'; placementId: string }
  | { type: 'childDetail'; childId: string }

const CELL_PX = 44

export function LayoutDesktop() {
  const plots = useStore((s) => s.plots)
  const catalog = useStore((s) => s.catalog)
  const placements = useStore((s) => s.placements)
  const addPlacement = useStore((s) => s.addPlacement)
  const removePlacement = useStore((s) => s.removePlacement)
  const editPlot = useStore((s) => s.editPlot)
  const lastSelectedPlotId = useStore((s) => s.lastSelectedPlotId)
  const setLastSelectedPlotId = useStore((s) => s.setLastSelectedPlotId)

  const layoutablePlots = plots.filter(isLayoutable)
  const rememberedPlotId = layoutablePlots.find((p) => p.id === lastSelectedPlotId)?.id
  const [selectedPlotId, setSelectedPlotId] = useSearchParamState(
    'plot',
    rememberedPlotId ?? layoutablePlots[0]?.id ?? '',
  )
  const [interaction, setInteraction] = useState<Interaction>({ type: 'idle' })
  const [placeError, setPlaceError] = useState<string | null>(null)
  const [shapeMode, setShapeMode] = useState(false)
  const [armedEntry, setArmedEntry] = useState<CatalogEntry | null>(null)
  const [deleteMode, setDeleteMode] = useState(false)
  const [isDragErasing, setIsDragErasing] = useState(false)
  const [shapeDragValue, setShapeDragValue] = useState<boolean | null>(null)

  useEffect(() => {
    const stop = () => {
      setIsDragErasing(false)
      setShapeDragValue(null)
    }
    window.addEventListener('mouseup', stop)
    return () => window.removeEventListener('mouseup', stop)
  }, [])

  const selectPlot = (id: string) => {
    setSelectedPlotId(id)
    setLastSelectedPlotId(id)
    setArmedEntry(null)
    setDeleteMode(false)
  }

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
  const excludedCells = plot?.excludedCells ?? []
  const excludedSet = new Set(excludedCells.map((c) => `${c.x}:${c.y}`))
  const parentPlot = plot?.parentPlotId ? plots.find((p) => p.id === plot.parentPlotId) : undefined

  const allChildren = plot ? getChildren(plot.id, plots) : []
  const childPlots = allChildren.filter((c) => c.xInParent !== null && c.yInParent !== null)
  const unpositionedChildren = allChildren.filter((c) => c.xInParent === null || c.yInParent === null)

  const entryFor = (catalogId: string): CatalogEntry | undefined => catalog.find((c) => c.id === catalogId)

  const childCellMap = new Map<string, Plot>()
  for (const child of childPlots) {
    if (child.xInParent === null || child.yInParent === null) continue
    for (const cell of occupiedCells({ x: child.xInParent, y: child.yInParent }, plotFootprint(child))) {
      childCellMap.set(`${cell.x}:${cell.y}`, child)
    }
  }

  const allOccupied: Cell[] = [
    ...plotPlacements.flatMap((p) => {
      const entry = entryFor(p.catalogId)
      return entry ? occupiedCells(p, { w: footprintCells(entry), h: footprintCells(entry) }) : []
    }),
    ...excludedCells,
    ...childPlots.flatMap((child) =>
      child.xInParent !== null && child.yInParent !== null
        ? occupiedCells({ x: child.xInParent, y: child.yInParent }, plotFootprint(child))
        : [],
    ),
  ]

  const cellMap = new Map<string, Placement>()
  for (const p of plotPlacements) {
    const entry = entryFor(p.catalogId)
    if (!entry) continue
    for (const cell of occupiedCells(p, { w: footprintCells(entry), h: footprintCells(entry) })) {
      cellMap.set(`${cell.x}:${cell.y}`, p)
    }
  }

  function conflictsFor(placement: Placement): { neighbor: Placement; reason: string }[] {
    const entry = entryFor(placement.catalogId)
    if (!entry) return []
    const footprint = { w: footprintCells(entry), h: footprintCells(entry) }
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

  const placeEntryAt = async (entry: CatalogEntry, anchor: Cell): Promise<boolean> => {
    if (!plot) return false
    const size = footprintCells(entry)
    if (!canPlaceAt(anchor, { w: size, h: size }, grid, allOccupied)) {
      setPlaceError(`${entry.nomCommun} nécessite un espace de ${size}×${size} cases, indisponible ici.`)
      return false
    }
    await addPlacement({ plotId: plot.id, catalogId: entry.id, plantingId: null, x: anchor.x, y: anchor.y })
    setPlaceError(null)
    return true
  }

  const handlePick = async (entry: CatalogEntry) => {
    if (interaction.type !== 'pick') return
    const placed = await placeEntryAt(entry, { x: interaction.x, y: interaction.y })
    if (!placed) return
    setInteraction({ type: 'idle' })
    setArmedEntry(entry)
  }

  const handleArmedClick = (x: number, y: number) => {
    if (!armedEntry) return
    placeEntryAt(armedEntry, { x, y })
  }

  const handlePlaceChild = async (child: Plot) => {
    if (interaction.type !== 'pick') return
    const footprint = plotFootprint(child)
    const anchor = { x: interaction.x, y: interaction.y }
    if (!canPlaceAt(anchor, footprint, grid, allOccupied)) {
      setPlaceError(`${child.name} nécessite un espace de ${footprint.w}×${footprint.h} cases, indisponible ici.`)
      return
    }
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = child
    await editPlot(child.id, { ...rest, xInParent: anchor.x, yInParent: anchor.y })
    setInteraction({ type: 'idle' })
    setPlaceError(null)
  }

  const setCellExcluded = async (x: number, y: number, excluded: boolean) => {
    if (!plot) return
    const key = `${x}:${y}`
    if (excludedSet.has(key) === excluded) return
    const next = excluded ? [...excludedCells, { x, y }] : excludedCells.filter((c) => `${c.x}:${c.y}` !== key)
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = plot
    await editPlot(plot.id, { ...rest, excludedCells: next })
  }

  const handleUnpositionChild = async (child: Plot) => {
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = child
    await editPlot(child.id, { ...rest, xInParent: null, yInParent: null })
    setInteraction({ type: 'idle' })
  }

  const detailPlacement =
    interaction.type === 'detail' ? plotPlacements.find((p) => p.id === interaction.placementId) : undefined
  const detailChild =
    interaction.type === 'childDetail' ? childPlots.find((c) => c.id === interaction.childId) : undefined

  const closePanel = () => {
    setInteraction({ type: 'idle' })
    setShapeMode(false)
  }
  const panelOpen = shapeMode || interaction.type !== 'idle'

  return (
    <div className="relative flex h-full flex-col p-6">
      <div className="mb-4 flex shrink-0 items-baseline justify-between">
        <h1 className="text-xl font-semibold text-green-800">Assistant de disposition</h1>
        <div className="flex items-center gap-2">
          <div className="w-48">
            <Select
              value={selectedPlotId}
              onChange={(e) => {
                selectPlot(e.target.value)
                setInteraction({ type: 'idle' })
                setShapeMode(false)
              }}
            >
              {flattenHierarchy(layoutablePlots).map(({ plot: p, depth }) => (
                <option key={p.id} value={p.id}>
                  {depth > 0 ? `${'—'.repeat(depth)} ${p.name}` : p.name}
                </option>
              ))}
            </Select>
          </div>
          <Button
            variant={shapeMode ? 'primary' : 'secondary'}
            onClick={() => {
              setShapeMode((v) => !v)
              setInteraction({ type: 'idle' })
              setArmedEntry(null)
              setDeleteMode(false)
            }}
          >
            {shapeMode ? 'Terminer' : 'Modifier la forme'}
          </Button>
          <Button
            variant={deleteMode ? 'danger' : 'secondary'}
            onClick={() => {
              setDeleteMode((v) => !v)
              setInteraction({ type: 'idle' })
              setArmedEntry(null)
              setShapeMode(false)
            }}
          >
            {deleteMode ? 'Terminer' : 'Supprimer'}
          </Button>
        </div>
      </div>

      {plot && (
        <>
          {parentPlot && (
            <button
              type="button"
              onClick={() => {
                selectPlot(parentPlot.id)
                setInteraction({ type: 'idle' })
                setShapeMode(false)
              }}
              className="mb-2 flex shrink-0 items-center gap-1 text-xs text-green-800 hover:underline"
            >
              ← {parentPlot.name}
            </button>
          )}
          <div className="mb-3 shrink-0">
            <p className="text-xs text-neutral-400">
              Grille {grid.cols}×{grid.rows} cases ({CELL_SIZE_CM} cm/case) — {plot.lengthCm}×{plot.widthCm} cm
              {shapeMode && ' — cliquez une case pour l\'exclure ou la réinclure dans la parcelle'}
              {deleteMode && ' — cliquez ou glissez sur les plantes pour les retirer'}
            </p>
            {!shapeMode && unpositionedChildren.length > 0 && (
              <p className="mt-1 text-xs text-blue-700">
                {unpositionedChildren.length} sous-parcelle(s) à positionner — cliquez une case vide pour choisir
                où la placer.
              </p>
            )}
            {!shapeMode && armedEntry && (
              <div className="mt-1 flex items-center justify-between rounded border border-green-200 bg-green-50 px-2 py-1">
                <p className="text-xs text-green-800">
                  Placement en série : <strong>{armedEntry.nomCommun}</strong> — cliquez une case vide pour en
                  ajouter une autre.
                </p>
                <button
                  type="button"
                  onClick={() => setArmedEntry(null)}
                  className="ml-2 shrink-0 text-xs font-medium text-green-700 hover:underline"
                >
                  Arrêter
                </button>
              </div>
            )}
          </div>
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
                  const key = `${x}:${y}`

                  if (excludedSet.has(key)) {
                    return (
                      <button
                        key={key}
                        type="button"
                        disabled={!shapeMode}
                        onMouseDown={() => {
                          if (!shapeMode) return
                          setShapeDragValue(false)
                          setCellExcluded(x, y, false)
                        }}
                        onMouseEnter={() => {
                          if (shapeMode && shapeDragValue !== null) setCellExcluded(x, y, shapeDragValue)
                        }}
                        style={{ gridColumn: `${x + 1} / span 1`, gridRow: `${y + 1} / span 1` }}
                        className={`select-none rounded bg-neutral-300 ${shapeMode ? 'hover:bg-neutral-400' : ''}`}
                      />
                    )
                  }

                  const child = childCellMap.get(key)
                  if (child && (child.xInParent !== x || child.yInParent !== y)) return null
                  if (child) {
                    const footprint = plotFootprint(child)
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setInteraction({ type: 'childDetail', childId: child.id })}
                        style={{
                          gridColumn: `${x + 1} / span ${footprint.w}`,
                          gridRow: `${y + 1} / span ${footprint.h}`,
                        }}
                        className="flex flex-col items-center justify-center overflow-hidden rounded border-2 border-blue-400 bg-blue-100 p-0.5 text-center text-[10px] font-medium leading-tight text-blue-800"
                      >
                        <span className="truncate">{child.name}</span>
                      </button>
                    )
                  }

                  const placement = cellMap.get(key)
                  if (placement && (placement.x !== x || placement.y !== y)) return null

                  if (placement) {
                    const entry = entryFor(placement.catalogId)
                    const footprint = entry ? footprintCells(entry) : 1
                    const hasConflict = conflictingPlacementIds.has(placement.id)
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          if (deleteMode) return
                          setInteraction({ type: 'detail', placementId: placement.id })
                        }}
                        onMouseDown={() => {
                          if (!deleteMode) return
                          setIsDragErasing(true)
                          removePlacement(placement.id)
                        }}
                        onMouseEnter={() => {
                          if (deleteMode && isDragErasing) removePlacement(placement.id)
                        }}
                        style={{
                          gridColumn: `${x + 1} / span ${footprint}`,
                          gridRow: `${y + 1} / span ${footprint}`,
                        }}
                        className={`flex flex-col items-center justify-center overflow-hidden rounded p-0.5 text-center text-[10px] leading-tight text-white select-none ${
                          deleteMode
                            ? 'bg-red-700 hover:bg-red-800'
                            : hasConflict
                              ? 'bg-amber-600'
                              : 'bg-green-700'
                        }`}
                      >
                        {deleteMode ? <span>✕</span> : hasConflict && <span>⚠️</span>}
                        <span className="truncate">{entry?.nomCommun}</span>
                      </button>
                    )
                  }

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        if (shapeMode) return
                        if (deleteMode) return
                        if (armedEntry) {
                          handleArmedClick(x, y)
                          return
                        }
                        setInteraction({ type: 'pick', x, y })
                        setPlaceError(null)
                      }}
                      onMouseDown={() => {
                        if (!shapeMode) return
                        setShapeDragValue(true)
                        setCellExcluded(x, y, true)
                      }}
                      onMouseEnter={() => {
                        if (shapeMode && shapeDragValue !== null) setCellExcluded(x, y, shapeDragValue)
                      }}
                      disabled={deleteMode}
                      style={{ gridColumn: `${x + 1} / span 1`, gridRow: `${y + 1} / span 1` }}
                      className={`select-none ${
                        shapeMode
                          ? 'rounded border border-neutral-400 bg-white text-neutral-400 hover:border-red-400 hover:bg-red-50 hover:text-red-500'
                          : deleteMode
                            ? 'rounded border border-neutral-200 bg-neutral-50 text-neutral-200'
                            : armedEntry
                              ? 'rounded border border-green-400 bg-green-50 text-green-600 hover:border-green-600 hover:bg-green-100'
                              : 'rounded border border-neutral-400 bg-white text-neutral-400 hover:border-green-600 hover:bg-green-50 hover:text-green-600'
                      }`}
                    >
                      {shapeMode ? '✕' : '+'}
                    </button>
                  )
                }),
              )}
            </div>
          </div>
        </>
      )}

      {panelOpen && (
        <div className="absolute bottom-6 right-6 z-20 max-h-[60vh] w-96 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-4 shadow-lg">
          <button
            type="button"
            onClick={closePanel}
            className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
            aria-label="Fermer"
          >
            ✕
          </button>

          {shapeMode && (
            <>
              <h2 className="mb-2 pr-6 text-sm font-semibold text-green-800">Modifier la forme</h2>
              <p className="text-xs text-neutral-500">
                Cliquez une case pour l'exclure de la parcelle (forme non rectangulaire), ou une case déjà exclue
                pour la réintégrer.
              </p>
            </>
          )}

          {!shapeMode && interaction.type === 'pick' && (
            <>
              <h2 className="mb-2 pr-6 text-sm font-semibold text-green-800">Choisir une plante</h2>
              {unpositionedChildren.length > 0 && (
                <div className="mb-3">
                  <div className="mb-1 text-xs font-semibold uppercase text-neutral-400">
                    Sous-parcelles à positionner
                  </div>
                  <div className="flex flex-col gap-1">
                    {unpositionedChildren.map((child) => {
                      const footprint = plotFootprint(child)
                      return (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => handlePlaceChild(child)}
                          className="flex items-center justify-between rounded border border-blue-200 bg-blue-50 px-2 py-1 text-left text-sm text-blue-800 hover:border-blue-400"
                        >
                          <span>{child.name}</span>
                          <span className="text-xs text-blue-600">
                            {footprint.w}×{footprint.h}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
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
              <Button variant="secondary" onClick={closePanel} className="mt-3">
                Annuler
              </Button>
            </>
          )}

          {!shapeMode && interaction.type === 'detail' && detailPlacement && (
            <>
              {(() => {
                const entry = entryFor(detailPlacement.catalogId)
                const conflicts = conflictsFor(detailPlacement)
                return (
                  <>
                    <h2 className="mb-1 pr-6 text-sm font-semibold text-green-800">{entry?.nomCommun}</h2>
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
                      <Button variant="secondary" onClick={closePanel}>
                        Fermer
                      </Button>
                    </div>
                  </>
                )
              })()}
            </>
          )}

          {!shapeMode && interaction.type === 'childDetail' && detailChild && (
            <>
              <h2 className="mb-1 pr-6 text-sm font-semibold text-green-800">{detailChild.name}</h2>
              <p className="text-xs text-neutral-500">
                Sous-parcelle — {plotFootprint(detailChild).w}×{plotFootprint(detailChild).h} cases
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Button
                  onClick={() => {
                    selectPlot(detailChild.id)
                    setInteraction({ type: 'idle' })
                  }}
                >
                  Entrer dans cette parcelle →
                </Button>
                <Button variant="danger" onClick={() => handleUnpositionChild(detailChild)}>
                  Retirer de la grille
                </Button>
                <Button variant="secondary" onClick={closePanel}>
                  Fermer
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
