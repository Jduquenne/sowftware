import type { CSSProperties } from 'react'
import type { CatalogEntry, Placement } from '../../services/db'
import { cellKey, footprintCells, plotFootprint, type Cell } from './logic/grid'
import type { PlotOccupancy, PositionedPlot } from './logic/occupancy'
import type { Tool } from './logic/desktopUiState'
import { useDragValue } from './useDragValue'

const CELL_PX = 44

interface LayoutGridProps {
  occupancy: PlotOccupancy
  catalogById: ReadonlyMap<string, CatalogEntry>
  conflictingPlacementIds: ReadonlySet<string>
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
          className={`select-none rounded bg-neutral-300 ${shapeMode ? 'hover:bg-neutral-400' : ''}`}
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
          className="flex flex-col items-center justify-center overflow-hidden rounded border-2 border-blue-400 bg-blue-100 p-0.5 text-center text-[10px] font-medium leading-tight text-blue-800"
        >
          <span className="truncate">{child.name}</span>
        </button>
      )
    }

    const placement = occupancy.placementAt.get(key)
    if (placement) {
      if (placement.x !== cell.x || placement.y !== cell.y) return null
      const entry = catalogById.get(placement.catalogId)
      const size = entry ? footprintCells(entry) : 1
      const hasConflict = conflictingPlacementIds.has(placement.id)
      return (
        <button
          key={key}
          type="button"
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
          className={`flex flex-col items-center justify-center overflow-hidden rounded p-0.5 text-center text-[10px] leading-tight text-white select-none ${
            deleteMode ? 'bg-red-700 hover:bg-red-800' : hasConflict ? 'bg-amber-600' : 'bg-green-700'
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
          if (tool.kind === 'place' || tool.kind === 'armed') onEmptyCellClick(cell)
        }}
        {...shapeHandlers(cell, true)}
        disabled={deleteMode}
        style={area(cell)}
        className={`select-none ${
          shapeMode
            ? 'rounded border border-neutral-400 bg-white text-neutral-400 hover:border-red-400 hover:bg-red-50 hover:text-red-500'
            : deleteMode
              ? 'rounded border border-neutral-200 bg-neutral-50 text-neutral-200'
              : tool.kind === 'armed'
                ? 'rounded border border-green-400 bg-green-50 text-green-600 hover:border-green-600 hover:bg-green-100'
                : 'rounded border border-neutral-400 bg-white text-neutral-400 hover:border-green-600 hover:bg-green-50 hover:text-green-600'
        }`}
      >
        {shapeMode ? '✕' : '+'}
      </button>
    )
  }

  return (
    <div
      className="grid gap-0.5"
      style={{
        gridTemplateColumns: `repeat(${grid.cols}, ${CELL_PX}px)`,
        gridTemplateRows: `repeat(${grid.rows}, ${CELL_PX}px)`,
      }}
    >
      {Array.from({ length: grid.cols }).flatMap((_, x) =>
        Array.from({ length: grid.rows }).map((_, y) => renderCell({ x, y })),
      )}
    </div>
  )
}
