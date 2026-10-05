import { getDB } from './db'
import type { Plot } from './db'
import { getDescendantIds } from '../features/plots/logic/hierarchy'

export type PlotInput = Omit<Plot, 'id' | 'createdAt' | 'updatedAt'>

type Cell = { x: number; y: number }

/** Backfills fields added after some plots were already stored — IndexedDB has no schema migration. */
function normalizePlot(plot: Plot): Plot {
  return {
    ...plot,
    parentPlotId: plot.parentPlotId ?? null,
    xInParent: plot.xInParent ?? null,
    yInParent: plot.yInParent ?? null,
    excludedCells: plot.excludedCells ?? [],
  }
}

export async function listPlots(): Promise<Plot[]> {
  const db = await getDB()
  const plots = await db.getAll('plots')
  return plots.map(normalizePlot)
}

export async function getPlot(id: string): Promise<Plot | undefined> {
  const db = await getDB()
  const plot = await db.get('plots', id)
  return plot ? normalizePlot(plot) : undefined
}

export async function createPlot(input: PlotInput): Promise<Plot> {
  const db = await getDB()
  const now = new Date().toISOString()
  const plot: Plot = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now }
  await db.put('plots', plot)
  return plot
}

export async function updatePlot(id: string, input: PlotInput): Promise<Plot> {
  const db = await getDB()
  const existing = await db.get('plots', id)
  if (!existing) throw new Error(`Plot not found: ${id}`)
  const plot: Plot = { ...existing, ...input, id, updatedAt: new Date().toISOString() }
  await db.put('plots', plot)
  return plot
}

export async function setPlotCellExcluded(id: string, cell: Cell, excluded: boolean): Promise<void> {
  await patchPlot(id, (plot) => {
    const others = plot.excludedCells.filter((c) => c.x !== cell.x || c.y !== cell.y)
    return { excludedCells: excluded ? [...others, { x: cell.x, y: cell.y }] : others }
  })
}

export async function setPlotPosition(id: string, position: Cell | null): Promise<void> {
  await patchPlot(id, () => ({ xInParent: position?.x ?? null, yInParent: position?.y ?? null }))
}

// Reads and writes inside one transaction so rapid successive calls (drag) never overwrite each other.
async function patchPlot(id: string, patch: (plot: Plot) => Partial<PlotInput>): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('plots', 'readwrite')
  const existing = await tx.store.get(id)
  if (!existing) throw new Error(`Plot not found: ${id}`)
  const plot = normalizePlot(existing)
  await tx.store.put({ ...plot, ...patch(plot), updatedAt: new Date().toISOString() })
  await tx.done
}

export async function deletePlot(id: string): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['plots', 'placements', 'plantings', 'wateringLogs'], 'readwrite')
  const plots = (await tx.objectStore('plots').getAll()).map(normalizePlot)
  const plotIds = [id, ...getDescendantIds(id, plots)]
  const now = new Date().toISOString()

  for (const plotId of plotIds) {
    for (const key of await tx.objectStore('placements').index('by-plot').getAllKeys(plotId)) {
      await tx.objectStore('placements').delete(key)
    }
    for (const planting of await tx.objectStore('plantings').index('by-plot').getAll(plotId)) {
      await tx.objectStore('plantings').put({ ...planting, plotId: null, placementId: null, updatedAt: now })
    }
    for (const log of await tx.objectStore('wateringLogs').index('by-plot').getAll(plotId)) {
      await tx.objectStore('wateringLogs').put({ ...log, plotId: null })
    }
    await tx.objectStore('plots').delete(plotId)
  }
  await tx.done
}
