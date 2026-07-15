import type { CatalogEntry, Placement, Plot } from '../../../services/db'

/** Reference unit the grid is divided into; spacing is rounded to this granularity. */
export const CELL_SIZE_CM = 25

export interface GridDimensions {
  cols: number
  rows: number
}

/** Layout assistant only applies to dimensioned plots (not pot-type). */
export function isLayoutable(plot: Plot): boolean {
  return plot.type !== 'pot' && plot.lengthCm !== null && plot.widthCm !== null
}

export function getGridDimensions(plot: Plot): GridDimensions {
  const cols = Math.max(1, Math.floor((plot.lengthCm ?? 0) / CELL_SIZE_CM))
  const rows = Math.max(1, Math.floor((plot.widthCm ?? 0) / CELL_SIZE_CM))
  return { cols, rows }
}

/** How many cells (in both directions) one plant of this entry occupies. */
export function footprintCells(entry: CatalogEntry): number {
  const spacing = entry.espacementCm?.min ?? CELL_SIZE_CM
  return Math.max(1, Math.round(spacing / CELL_SIZE_CM))
}

export interface Cell {
  x: number
  y: number
}

export function occupiedCells(placement: Pick<Placement, 'x' | 'y'>, footprint: number): Cell[] {
  const cells: Cell[] = []
  for (let i = 0; i < footprint; i++) {
    for (let j = 0; j < footprint; j++) {
      cells.push({ x: placement.x + i, y: placement.y + j })
    }
  }
  return cells
}

function cellKey(cell: Cell): string {
  return `${cell.x}:${cell.y}`
}

export function canPlaceAt(
  anchor: Cell,
  footprint: number,
  grid: GridDimensions,
  existingCells: Cell[],
): boolean {
  if (anchor.x < 0 || anchor.y < 0) return false
  if (anchor.x + footprint > grid.cols || anchor.y + footprint > grid.rows) return false

  const occupied = new Set(existingCells.map(cellKey))
  for (const cell of occupiedCells(anchor, footprint)) {
    if (occupied.has(cellKey(cell))) return false
  }
  return true
}

/** Cells within a 1-cell margin of the given footprint, excluding the footprint itself. */
export function adjacentCells(anchor: Cell, footprint: number): Cell[] {
  const footprintCellsSet = new Set(occupiedCells(anchor, footprint).map(cellKey))
  const cells: Cell[] = []
  for (let x = anchor.x - 1; x <= anchor.x + footprint; x++) {
    for (let y = anchor.y - 1; y <= anchor.y + footprint; y++) {
      const key = `${x}:${y}`
      if (!footprintCellsSet.has(key)) cells.push({ x, y })
    }
  }
  return cells
}

/** First free anchor position (row-major scan) that fits the given footprint. */
export function findFreeAnchor(
  footprint: number,
  grid: GridDimensions,
  existingCells: Cell[],
): Cell | null {
  for (let y = 0; y <= grid.rows - footprint; y++) {
    for (let x = 0; x <= grid.cols - footprint; x++) {
      if (canPlaceAt({ x, y }, footprint, grid, existingCells)) return { x, y }
    }
  }
  return null
}
