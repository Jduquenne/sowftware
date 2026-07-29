import { getDB } from './db'
import type { Plot } from './db'

export type PlotInput = Omit<Plot, 'id' | 'createdAt' | 'updatedAt'>

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

export async function deletePlot(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('plots', id)
}
