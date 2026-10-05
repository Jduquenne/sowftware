import { useReducer, useState } from 'react'
import { useStore } from '../../store'
import type { CatalogEntry, Placement, Plot } from '../../services/db'
import { entryFootprint, plotFootprint, canPlaceAt, cellKey, type Cell, type Footprint } from './logic/grid'
import { buildPlotOccupancy, adjacentConflicts } from './logic/occupancy'
import { layoutUiReducer, initialLayoutUiState, isPanelOpen } from './logic/desktopUiState'
import { isLayoutable } from '../plots/logic/plotTypes'
import { getChildren } from '../plots/logic/hierarchy'
import { useSearchParamState } from '../../utils/useSearchParamState'
import { LayoutToolbar, LayoutStatus } from './LayoutHeader'
import { LayoutGrid } from './LayoutGrid'
import { FloatingPanel, ShapeHelpPanel, PickPanel, PlacementDetailPanel, ChildDetailPanel } from './LayoutPanels'

export function LayoutDesktop() {
  const plots = useStore((s) => s.plots)
  const catalog = useStore((s) => s.catalog)
  const catalogById = useStore((s) => s.catalogById)
  const placements = useStore((s) => s.placements)
  const addPlacement = useStore((s) => s.addPlacement)
  const removePlacement = useStore((s) => s.removePlacement)
  const setCellExcluded = useStore((s) => s.setCellExcluded)
  const positionInParent = useStore((s) => s.positionInParent)
  const lastSelectedPlotId = useStore((s) => s.lastSelectedPlotId)
  const setLastSelectedPlotId = useStore((s) => s.setLastSelectedPlotId)

  const layoutablePlots = plots.filter(isLayoutable)
  const rememberedPlotId = layoutablePlots.find((p) => p.id === lastSelectedPlotId)?.id
  const [selectedPlotId, setSelectedPlotId] = useSearchParamState(
    'plot',
    rememberedPlotId ?? layoutablePlots[0]?.id ?? '',
  )
  const [ui, dispatch] = useReducer(layoutUiReducer, initialLayoutUiState)
  const [placeError, setPlaceError] = useState<string | null>(null)

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

  const plot = layoutablePlots.find((p) => p.id === selectedPlotId)
  const parentPlot = plot?.parentPlotId ? plots.find((p) => p.id === plot.parentPlotId) : undefined
  const plotPlacements = placements.filter((p) => p.plotId === selectedPlotId)
  const occupancy = plot ? buildPlotOccupancy(plot, plotPlacements, getChildren(plot.id, plots), catalogById) : null
  const conflictsFor = (placement: Placement) => (occupancy ? adjacentConflicts(placement, occupancy, catalogById) : [])
  const conflictingPlacementIds = new Set(plotPlacements.filter((p) => conflictsFor(p).length > 0).map((p) => p.id))

  const { tool, panel } = ui
  const closePanel = () => dispatch({ type: 'closePanel' })

  const selectPlot = (id: string) => {
    setSelectedPlotId(id)
    setLastSelectedPlotId(id)
    dispatch({ type: 'reset' })
  }

  const fits = (label: string, anchor: Cell, footprint: Footprint): boolean => {
    if (occupancy && canPlaceAt(anchor, footprint, occupancy.grid, occupancy.occupied)) {
      setPlaceError(null)
      return true
    }
    setPlaceError(`${label} nécessite un espace de ${footprint.w}×${footprint.h} cases, indisponible ici.`)
    return false
  }

  const placeEntryAt = async (entry: CatalogEntry, anchor: Cell): Promise<boolean> => {
    if (!plot || !fits(entry.nomCommun, anchor, entryFootprint(entry))) return false
    await addPlacement({ plotId: plot.id, catalogId: entry.id, plantingId: null, x: anchor.x, y: anchor.y })
    return true
  }

  const handleEmptyCellClick = (cell: Cell) => {
    if (tool.kind === 'armed') {
      void placeEntryAt(tool.entry, cell)
      return
    }
    setPlaceError(null)
    dispatch({ type: 'openPanel', panel: { kind: 'pick', cell } })
  }

  const handlePickEntry = async (entry: CatalogEntry) => {
    if (panel.kind !== 'pick') return
    if (await placeEntryAt(entry, panel.cell)) dispatch({ type: 'arm', entry })
  }

  const handlePlaceChild = async (child: Plot) => {
    if (panel.kind !== 'pick' || !fits(child.name, panel.cell, plotFootprint(child))) return
    await positionInParent(child.id, panel.cell)
    closePanel()
  }

  const handleSetExcluded = (cell: Cell, excluded: boolean) => {
    if (!plot || occupancy?.excluded.has(cellKey(cell)) === excluded) return
    void setCellExcluded(plot.id, cell, excluded)
  }

  const detailPlacement =
    panel.kind === 'placement' ? plotPlacements.find((p) => p.id === panel.placementId) : undefined
  const detailChild =
    panel.kind === 'child' ? occupancy?.positionedChildren.find((c) => c.id === panel.childId) : undefined

  return (
    <div className="relative flex h-full flex-col p-6">
      <LayoutToolbar
        plots={layoutablePlots}
        selectedPlotId={selectedPlotId}
        tool={tool}
        onSelectPlot={selectPlot}
        onToggleTool={(t) => dispatch({ type: 'toggleTool', tool: t })}
      />

      {plot && occupancy && (
        <>
          <LayoutStatus
            plot={plot}
            parentPlot={parentPlot}
            grid={occupancy.grid}
            tool={tool}
            unpositionedCount={occupancy.unpositionedChildren.length}
            onSelectPlot={selectPlot}
            onDisarm={() => dispatch({ type: 'disarm' })}
          />
          <div className="min-h-0 flex-1 overflow-auto">
            <LayoutGrid
              occupancy={occupancy}
              catalogById={catalogById}
              conflictingPlacementIds={conflictingPlacementIds}
              tool={tool}
              onEmptyCellClick={handleEmptyCellClick}
              onPlacementClick={(p) => dispatch({ type: 'openPanel', panel: { kind: 'placement', placementId: p.id } })}
              onChildClick={(c) => dispatch({ type: 'openPanel', panel: { kind: 'child', childId: c.id } })}
              onRemovePlacement={(id) => void removePlacement(id)}
              onSetExcluded={handleSetExcluded}
            />
          </div>
        </>
      )}

      {isPanelOpen(ui) && (
        <FloatingPanel onClose={closePanel}>
          {tool.kind === 'shape' && <ShapeHelpPanel />}
          {tool.kind !== 'shape' && panel.kind === 'pick' && occupancy && (
            <PickPanel
              catalog={catalog}
              unpositionedChildren={occupancy.unpositionedChildren}
              error={placeError}
              onPickEntry={handlePickEntry}
              onPlaceChild={handlePlaceChild}
              onCancel={closePanel}
            />
          )}
          {tool.kind !== 'shape' && detailPlacement && (
            <PlacementDetailPanel
              placement={detailPlacement}
              catalogById={catalogById}
              conflicts={conflictsFor(detailPlacement)}
              onRemove={async () => {
                await removePlacement(detailPlacement.id)
                closePanel()
              }}
              onClose={closePanel}
            />
          )}
          {tool.kind !== 'shape' && detailChild && (
            <ChildDetailPanel
              child={detailChild}
              onEnter={() => selectPlot(detailChild.id)}
              onUnposition={async () => {
                await positionInParent(detailChild.id, null)
                closePanel()
              }}
              onClose={closePanel}
            />
          )}
        </FloatingPanel>
      )}
    </div>
  )
}
