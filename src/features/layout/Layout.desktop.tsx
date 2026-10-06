import { useReducer, useState } from 'react'
import { useStore } from '../../store'
import type { CatalogEntry, Placement, Plot } from '../../services/db'
import { entryFootprint, plotFootprint, canPlaceAt, cellKey, type Cell, type Footprint } from './logic/grid'
import { buildPlotOccupancy, adjacentConflicts, plotConflictPairs } from './logic/occupancy'
import { layoutUiReducer, initialLayoutUiState, isPanelOpen } from './logic/desktopUiState'
import { isLayoutable } from '../plots/logic/plotTypes'
import { getChildren } from '../plots/logic/hierarchy'
import { useSearchParamState } from '../../utils/useSearchParamState'
import { LayoutPageHeader, LayoutStatus } from './LayoutHeader'
import { PlotInfoBar, PlotCompass, PlanLegend } from './LayoutCanvas'
import { PageHeader } from '../../ui/PageHeader'
import { EmptyState } from '../../ui/EmptyState'
import { LayoutGrid } from './LayoutGrid'
import {
  FloatingPanel,
  PanelTabs,
  ShapeHelpPanel,
  PickPanel,
  PlacementDetailPanel,
  ConflictsPanel,
  ChildDetailPanel,
} from './LayoutPanels'

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
      <div className="flex h-full flex-col">
        <PageHeader title="Disposition" />
        <div className="p-10">
          <EmptyState>
            Créez d'abord une parcelle avec des dimensions (jardin, terrasse ou potager) — l'assistant ne s'applique
            pas aux parcelles en pot.
          </EmptyState>
        </div>
      </div>
    )
  }

  const plot = layoutablePlots.find((p) => p.id === selectedPlotId)
  const plotPlacements = placements.filter((p) => p.plotId === selectedPlotId)
  const occupancy = plot ? buildPlotOccupancy(plot, plotPlacements, getChildren(plot.id, plots), catalogById) : null
  const conflictsFor = (placement: Placement) => (occupancy ? adjacentConflicts(placement, occupancy, catalogById) : [])
  const conflictPairs = occupancy ? plotConflictPairs(plotPlacements, occupancy, catalogById) : []
  const conflictingPlacementIds = new Set(conflictPairs.flatMap(({ a, b }) => [a.id, b.id]))

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
    if (!panel.cell || (await placeEntryAt(entry, panel.cell))) dispatch({ type: 'arm', entry })
  }

  const handlePlaceChild = async (child: Plot) => {
    if (panel.kind !== 'pick' || !panel.cell || !fits(child.name, panel.cell, plotFootprint(child))) return
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

  const openPlacement = (placement: Placement) =>
    dispatch({ type: 'openPanel', panel: { kind: 'placement', placementId: placement.id } })
  const showTabs = tool.kind !== 'shape' && (panel.kind === 'placement' || panel.kind === 'child' || panel.kind === 'conflicts')
  const availableCells = occupancy
    ? occupancy.grid.cols * occupancy.grid.rows - occupancy.excluded.size - occupancy.childAt.size
    : 0

  return (
    <div className="relative flex h-full flex-col">
      <LayoutPageHeader
        plots={layoutablePlots}
        allPlots={plots}
        plot={plot}
        tool={tool}
        onSelectPlot={selectPlot}
        onToggleTool={(t) => dispatch({ type: 'toggleTool', tool: t })}
        onToggleSeries={() => dispatch({ type: tool.kind === 'armed' ? 'disarm' : 'startSeries' })}
      />

      {plot && occupancy && (
        <div className="min-h-0 flex-1 p-8">
          <div className="flex h-full flex-col gap-5 rounded-3xl border border-forest-100 bg-meadow-dots p-6">
            <div className="flex shrink-0 items-start justify-between gap-4">
              <div className="space-y-3">
                <PlotInfoBar
                  plot={plot}
                  plantedCells={occupancy.placementAt.size}
                  availableCells={availableCells}
                  conflictCount={conflictPairs.length}
                  onOpenConflicts={() => dispatch({ type: 'openPanel', panel: { kind: 'conflicts' } })}
                />
                <LayoutStatus tool={tool} unpositionedCount={occupancy.unpositionedChildren.length} />
              </div>
              {plot.orientation && <PlotCompass orientation={plot.orientation} />}
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
              <LayoutGrid
                occupancy={occupancy}
                catalogById={catalogById}
                conflictingPlacementIds={conflictingPlacementIds}
                selectedPlacementId={panel.kind === 'placement' ? panel.placementId : null}
                tool={tool}
                onEmptyCellClick={handleEmptyCellClick}
                onPlacementClick={openPlacement}
                onChildClick={(c) => dispatch({ type: 'openPanel', panel: { kind: 'child', childId: c.id } })}
                onRemovePlacement={(id) => void removePlacement(id)}
                onSetExcluded={handleSetExcluded}
              />
            </div>
            <div className="shrink-0">
              <PlanLegend placements={plotPlacements} catalogById={catalogById} />
            </div>
          </div>
        </div>
      )}

      {isPanelOpen(ui) && (
        <FloatingPanel onClose={closePanel}>
          {showTabs && (
            <PanelTabs
              active={panel.kind === 'conflicts' ? 'conflicts' : 'detail'}
              conflictCount={conflictPairs.length}
              detailEnabled={panel.kind !== 'conflicts'}
              onSelect={(tab) => {
                if (tab === 'conflicts') dispatch({ type: 'openPanel', panel: { kind: 'conflicts' } })
              }}
            />
          )}
          {tool.kind === 'shape' && <ShapeHelpPanel />}
          {tool.kind !== 'shape' && panel.kind === 'pick' && occupancy && (
            <PickPanel
              catalog={catalog}
              series={panel.cell === null}
              unpositionedChildren={occupancy.unpositionedChildren}
              error={placeError}
              onPickEntry={handlePickEntry}
              onPlaceChild={handlePlaceChild}
              onCancel={closePanel}
            />
          )}
          {tool.kind !== 'shape' && panel.kind === 'conflicts' && (
            <ConflictsPanel pairs={conflictPairs} catalogById={catalogById} onShow={openPlacement} />
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
