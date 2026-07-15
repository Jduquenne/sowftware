import { getDB } from './db'
import type { Planting } from './db'

export type PlantingInput = Omit<Planting, 'id' | 'createdAt' | 'updatedAt'>

export async function listPlantings(): Promise<Planting[]> {
  const db = await getDB()
  return db.getAll('plantings')
}

export async function getPlanting(id: string): Promise<Planting | undefined> {
  const db = await getDB()
  return db.get('plantings', id)
}

export async function createPlanting(input: PlantingInput): Promise<Planting> {
  const db = await getDB()
  const now = new Date().toISOString()
  const planting: Planting = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now }
  await db.put('plantings', planting)
  return planting
}

export async function updatePlanting(id: string, input: PlantingInput): Promise<Planting> {
  const db = await getDB()
  const existing = await db.get('plantings', id)
  if (!existing) throw new Error(`Planting not found: ${id}`)
  const planting: Planting = { ...existing, ...input, id, updatedAt: new Date().toISOString() }
  await db.put('plantings', planting)
  return planting
}

export async function deletePlanting(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('plantings', id)
}
