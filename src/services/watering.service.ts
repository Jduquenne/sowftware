import { getDB } from './db'
import type { WateringLog } from './db'

export type WateringLogInput = Omit<WateringLog, 'id'>

export async function listWateringLogs(): Promise<WateringLog[]> {
  const db = await getDB()
  return db.getAll('wateringLogs')
}

export async function logWatering(input: WateringLogInput): Promise<WateringLog> {
  const db = await getDB()
  const log: WateringLog = { ...input, id: crypto.randomUUID() }
  await db.put('wateringLogs', log)
  return log
}

export async function deleteWateringLog(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('wateringLogs', id)
}
