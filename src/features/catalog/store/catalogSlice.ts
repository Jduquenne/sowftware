import type { StateCreator } from 'zustand'
import type { RootStore } from '../../../store/types'
import type { CatalogEntry } from '../../../services/db'
import { listCatalog } from '../../../services/catalog.service'

export interface CatalogSlice {
  catalog: CatalogEntry[]
  catalogById: ReadonlyMap<string, CatalogEntry>
  loadCatalog: () => Promise<void>
}

export const createCatalogSlice: StateCreator<RootStore, [], [], CatalogSlice> = (set) => ({
  catalog: [],
  catalogById: new Map(),
  loadCatalog: async () => {
    const catalog = await listCatalog()
    set({ catalog, catalogById: new Map(catalog.map((c) => [c.id, c])) })
  },
})
