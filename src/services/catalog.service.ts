import { getDB } from './db'
import type { CatalogEntry } from './db'

export async function listCatalog(): Promise<CatalogEntry[]> {
  const db = await getDB()
  return db.getAll('catalog')
}

export async function getCatalogEntry(id: string): Promise<CatalogEntry | undefined> {
  const db = await getDB()
  return db.get('catalog', id)
}

export async function listCatalogByCategory(categorie: string): Promise<CatalogEntry[]> {
  const db = await getDB()
  return db.getAllFromIndex('catalog', 'by-categorie', categorie)
}
