import type { StateCreator } from 'zustand'
import type { RootStore } from '../../../store/types'
import type { CatalogEntry } from '../../../services/db'
import { listCatalog } from '../../../services/catalog.service'

export interface CatalogSlice {
  catalog: CatalogEntry[]
  loadCatalog: () => Promise<void>
}

export const createCatalogSlice: StateCreator<RootStore, [], [], CatalogSlice> = (set) => ({
  catalog: [],
  loadCatalog: async () => {
    const catalog = await listCatalog()
    set({ catalog })
  },
})
