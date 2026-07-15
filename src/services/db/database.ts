import { openDB, type IDBPDatabase } from 'idb'
import type { GardenDB } from './schema'

const DB_NAME = 'garden-planner'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<GardenDB>> | null = null

export function getDB(): Promise<IDBPDatabase<GardenDB>> {
  if (!dbPromise) {
    dbPromise = openDB<GardenDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('catalog')) {
          const catalog = db.createObjectStore('catalog', { keyPath: 'id' })
          catalog.createIndex('by-categorie', 'categorie')
          catalog.createIndex('by-nomCommun', 'nomCommun')
        }
        if (!db.objectStoreNames.contains('plots')) {
          db.createObjectStore('plots', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('placements')) {
          const placements = db.createObjectStore('placements', { keyPath: 'id' })
          placements.createIndex('by-plot', 'plotId')
        }
        if (!db.objectStoreNames.contains('plantings')) {
          const plantings = db.createObjectStore('plantings', { keyPath: 'id' })
          plantings.createIndex('by-plot', 'plotId')
          plantings.createIndex('by-catalog', 'catalogId')
          plantings.createIndex('by-status', 'status')
        }
        if (!db.objectStoreNames.contains('wateringLogs')) {
          const watering = db.createObjectStore('wateringLogs', { keyPath: 'id' })
          watering.createIndex('by-planting', 'plantingId')
          watering.createIndex('by-plot', 'plotId')
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' })
        }
      },
    })
  }
  return dbPromise
}

export async function getMeta<T>(key: string): Promise<T | undefined> {
  const db = await getDB()
  const record = await db.get('meta', key)
  return record?.value as T | undefined
}

export async function setMeta(key: string, value: unknown): Promise<void> {
  const db = await getDB()
  await db.put('meta', { key, value })
}
