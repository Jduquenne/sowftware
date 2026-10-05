import type { CatalogEntry, Placement, Plot } from '../../../services/db'
import {
  getGridDimensions,
  entryFootprint,
  plotFootprint,
  occupiedCells,
  adjacentCells,
  cellKey,
  type Cell,
  type GridDimensions,
} from './grid'
import { getCompanionRelation } from './companions'

export type PositionedPlot = Plot & { xInParent: number; yInParent: number }

export interface PlacementConflict {
  neighbor: Placement
  reason: string
}

export interface PlotOccupancy {
  grid: GridDimensions
  occupied: Set<string>
  excluded: Set<string>
  placementAt: Map<string, Placement>
  childAt: Map<string, PositionedPlot>
  positionedChildren: PositionedPlot[]
  unpositionedChildren: Plot[]
}

export function isPositioned(plot: Plot): plot is PositionedPlot {
  return plot.xInParent !== null && plot.yInParent !== null
}

export function childAnchor(child: PositionedPlot): Cell {
  return { x: child.xInParent, y: child.yInParent }
}

export function buildPlotOccupancy(
  plot: Plot,
  plotPlacements: Placement[],
  children: Plot[],
  catalogById: ReadonlyMap<string, CatalogEntry>,
): PlotOccupancy {
  const excluded = new Set(plot.excludedCells.map(cellKey))
  const occupied = new Set(excluded)
  const placementAt = new Map<string, Placement>()
  const childAt = new Map<string, PositionedPlot>()
  const positionedChildren = children.filter(isPositioned)

  for (const child of positionedChildren) {
    for (const cell of occupiedCells(childAnchor(child), plotFootprint(child))) {
      occupied.add(cellKey(cell))
      childAt.set(cellKey(cell), child)
    }
  }

  for (const placement of plotPlacements) {
    const entry = catalogById.get(placement.catalogId)
    if (!entry) continue
    for (const cell of occupiedCells(placement, entryFootprint(entry))) {
      occupied.add(cellKey(cell))
      placementAt.set(cellKey(cell), placement)
    }
  }

  return {
    grid: getGridDimensions(plot),
    occupied,
    excluded,
    placementAt,
    childAt,
    positionedChildren,
    unpositionedChildren: children.filter((c) => !isPositioned(c)),
  }
}

function avoidReason(a: Placement, b: Placement, catalogById: ReadonlyMap<string, CatalogEntry>): string | null {
  const entryA = catalogById.get(a.catalogId)
  const entryB = catalogById.get(b.catalogId)
  if (!entryA || !entryB) return null
  const check = getCompanionRelation(entryA, entryB)
  return check?.relation === 'avoid' ? check.reason : null
}

export function adjacentConflicts(
  placement: Placement,
  occupancy: PlotOccupancy,
  catalogById: ReadonlyMap<string, CatalogEntry>,
): PlacementConflict[] {
  const entry = catalogById.get(placement.catalogId)
  if (!entry) return []
  const seen = new Set<string>([placement.id])
  const conflicts: PlacementConflict[] = []
  for (const cell of adjacentCells(placement, entryFootprint(entry))) {
    const neighbor = occupancy.placementAt.get(cellKey(cell))
    if (!neighbor || seen.has(neighbor.id)) continue
    seen.add(neighbor.id)
    const reason = avoidReason(placement, neighbor, catalogById)
    if (reason) conflicts.push({ neighbor, reason })
  }
  return conflicts
}

export function plotWideConflicts(
  placement: Placement,
  plotPlacements: Placement[],
  catalogById: ReadonlyMap<string, CatalogEntry>,
): PlacementConflict[] {
  return plotPlacements.flatMap((neighbor) => {
    if (neighbor.id === placement.id) return []
    const reason = avoidReason(placement, neighbor, catalogById)
    return reason ? [{ neighbor, reason }] : []
  })
}
