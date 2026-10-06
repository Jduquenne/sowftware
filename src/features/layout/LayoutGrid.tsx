import type { CSSProperties } from 'react'
import { AlertTriangle, Plus, X } from 'lucide-react'
import type { CatalogEntry, Placement } from '../../services/db'
import { cellKey, footprintCells, plotFootprint, type Cell } from './logic/grid'
import type { PlotOccupancy, PositionedPlot } from './logic/occupancy'
import type { Tool } from './logic/desktopUiState'
import { plantColor } from './logic/plantColor'
import { useDragValue } from './useDragValue'

const CELL_PX = 44
const SOIL_CELL = 'bg-soil border border-black/10'

interface LayoutGridProps {
  occupancy: PlotOccupancy
  catalogById: ReadonlyMap<string, CatalogEntry>
  conflictingPlacementIds: ReadonlySet<string>
  selectedPlacementId: string | null
  tool: Tool
  onEmptyCellClick: (cell: Cell) => void
  onPlacementClick: (placement: Placement) => void
  onChildClick: (child: PositionedPlot) => void
  onRemovePlacement: (id: string) => void
  onSetExcluded: (cell: Cell, excluded: boolean) => void
}

function area(cell: Cell, w = 1, h = 1): CSSProperties {
  return { gridColumn: `${cell.x + 1} / span ${w}`, gridRow: `${cell.y + 1} / span ${h}` }
}

export function LayoutGrid({
  occupancy,
  catalogById,
  conflictingPlacementIds,
  selectedPlacementId,
  tool,
  onEmptyCellClick,
  onPlacementClick,
  onChildClick,
  onRemovePlacement,
  onSetExcluded,
}: LayoutGridProps) {
  const [shapeDragValue, startShapeDrag] = useDragValue<boolean>()
  const [eraseDrag, startEraseDrag] = useDragValue<true>()
  const { grid } = occupancy
  const shapeMode = tool.kind === 'shape'
  const deleteMode = tool.kind === 'delete'

  const shapeHandlers = (cell: Cell, paintValue: boolean) => ({
    onMouseDown: () => {
      if (!shapeMode) return
      startShapeDrag(paintValue)
      onSetExcluded(cell, paintValue)
    },
    onMouseEnter: () => {
      if (shapeMode && shapeDragValue !== null) onSetExcluded(cell, shapeDragValue)
    },
  })

  const renderCell = (cell: Cell) => {
    const key = cellKey(cell)

    if (occupancy.excluded.has(key)) {
      return (
        <button
          key={key}
          type="button"
          disabled={!shapeMode}
          {...shapeHandlers(cell, false)}
          style={area(cell)}
          className={`border border-dashed border-forest-300/70 bg-white/30 select-none ${shapeMode ? 'hover:bg-white/70' : ''}`}
        />
      )
    }

    const child = occupancy.childAt.get(key)
    if (child) {
      if (child.xInParent !== cell.x || child.yInParent !== cell.y) return null
      const footprint = plotFootprint(child)
      return (
        <button
          key={key}
          type="button"
          onClick={() => onChildClick(child)}
          style={area(cell, footprint.w, footprint.h)}
          className="relative m-0.5 rounded-xl border-2 border-dashed border-violet-400 bg-violet-200/40 text-left hover:bg-violet-200/60"
        >
          <span className="absolute top-1.5 left-1.5 max-w-[calc(100%-12px)] truncate rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-violet-700">
            {child.name}
          </span>
          <span className="absolute bottom-1.5 left-1.5 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
            Sous-parcelle · {footprint.w}×{footprint.h}
          </span>
        </button>
      )
    }

    const placement = occupancy.placementAt.get(key)
    if (placement) {
      if (placement.x !== cell.x || placement.y !== cell.y) return null
      const entry = catalogById.get(placement.catalogId)
      const size = entry ? footprintCells(entry) : 1
      const hasConflict = conflictingPlacementIds.has(placement.id)
      const selected = placement.id === selectedPlacementId
      return (
        <button
          key={key}
          type="button"
          title={entry ? `${entry.nomCommun} · ${entry.variete}` : undefined}
          onClick={() => {
            if (!deleteMode) onPlacementClick(placement)
          }}
          onMouseDown={() => {
            if (!deleteMode) return
            startEraseDrag(true)
            onRemovePlacement(placement.id)
          }}
          onMouseEnter={() => {
            if (deleteMode && eraseDrag) onRemovePlacement(placement.id)
          }}
          style={area(cell, size, size)}
          className={`relative select-none ${SOIL_CELL} ${hasConflict || selected ? 'z-10' : ''} ${
            selected ? 'outline-2 -outline-offset-2 outline-white' : ''
          }`}
        >
          <span
            className={`absolute inset-[8%] flex items-center justify-center rounded-full bg-forest-600 shadow-[inset_0_-3px_0_rgb(0_0_0/0.18)] ring-2 ${
              hasConflict ? 'ring-sun-300' : 'ring-forest-300/50'
            }`}
          >
            <span
              className="size-[32%] rounded-full"
              style={{ backgroundColor: entry ? plantColor(entry.nomCommun) : undefined }}
            />
          </span>
          {size >= 2 && entry && (
            <span className="absolute top-1 left-1 max-w-[calc(100%-8px)] truncate rounded-full bg-white/90 px-1.5 text-[10px] font-semibold text-forest-900">
              {entry.nomCommun}
            </span>
          )}
          {hasConflict && !deleteMode && (
            <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-sun-300 text-forest-950 ring-2 ring-white">
              <AlertTriangle size={11} />
            </span>
          )}
          {deleteMode && (
            <span className="absolute inset-0 flex items-center justify-center bg-red-700/55 text-white hover:bg-red-700/75">
              <X size={18} />
            </span>
          )}
        </button>
      )
    }

    return (
      <button
        key={key}
        type="button"
        onClick={() => {
          if (tool.kind === 'place' || tool.kind === 'armed') onEmptyCellClick(cell)
        }}
        {...shapeHandlers(cell, true)}
        disabled={deleteMode}
        style={area(cell)}
        className={`flex items-center justify-center select-none ${SOIL_CELL} ${
          shapeMode
            ? 'text-transparent hover:bg-red-900/40 hover:text-white'
            : deleteMode
              ? 'text-transparent'
              : tool.kind === 'armed'
                ? 'text-white/35 hover:brightness-125 hover:text-white'
                : 'text-transparent hover:brightness-125 hover:text-white/90'
        }`}
      >
        {shapeMode ? <X size={16} /> : <Plus size={16} />}
      </button>
    )
  }

  return (
    <div className="w-fit rounded-2xl bg-white/45 p-3 shadow-card">
      <div
        className="grid overflow-visible rounded-lg"
        style={{
          gridTemplateColumns: `repeat(${grid.cols}, ${CELL_PX}px)`,
          gridTemplateRows: `repeat(${grid.rows}, ${CELL_PX}px)`,
        }}
      >
        {Array.from({ length: grid.cols }).flatMap((_, x) =>
          Array.from({ length: grid.rows }).map((_, y) => renderCell({ x, y })),
        )}
      </div>
    </div>
  )
}
