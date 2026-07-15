import { getDB } from './db'
import type { Placement } from './db'

export type PlacementInput = Omit<Placement, 'id' | 'createdAt'>

export async function listPlacements(): Promise<Placement[]> {
  const db = await getDB()
  return db.getAll('placements')
}

export async function createPlacement(input: PlacementInput): Promise<Placement> {
  const db = await getDB()
  const placement: Placement = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
  await db.put('placements', placement)
  return placement
}

export async function deletePlacement(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('placements', id)
}
