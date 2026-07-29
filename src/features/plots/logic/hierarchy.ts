import type { Plot } from '../../../services/db'

export function getChildren(plotId: string, plots: Plot[]): Plot[] {
  return plots.filter((p) => p.parentPlotId === plotId)
}

/** All descendants (children, grandchildren, ...) of a plot — used to prevent cycles when picking a parent. */
export function getDescendantIds(plotId: string, plots: Plot[]): Set<string> {
  const ids = new Set<string>()
  const queue = [plotId]
  while (queue.length > 0) {
    const current = queue.shift()!
    for (const child of getChildren(current, plots)) {
      if (!ids.has(child.id)) {
        ids.add(child.id)
        queue.push(child.id)
      }
    }
  }
  return ids
}

/** Depth-first, roots first with each followed immediately by its own descendants — ready to render as an indented list. */
export function flattenHierarchy(plots: Plot[]): { plot: Plot; depth: number }[] {
  const result: { plot: Plot; depth: number }[] = []
  function visit(parentId: string | null, depth: number) {
    for (const plot of plots.filter((p) => p.parentPlotId === parentId)) {
      result.push({ plot, depth })
      visit(plot.id, depth + 1)
    }
  }
  visit(null, 0)
  return result
}
