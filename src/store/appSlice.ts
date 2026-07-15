import type { StateCreator } from 'zustand'
import type { RootStore } from './types'
import { ensureSeed } from '../services/db'

export interface AppSlice {
  ready: boolean
  bootstrap: () => Promise<void>
}

export const createAppSlice: StateCreator<RootStore, [], [], AppSlice> = (set, get) => ({
  ready: false,
  bootstrap: async () => {
    if (get().ready) return
    await ensureSeed()
    await Promise.all([
      get().loadCatalog(),
      get().loadPlots(),
      get().loadPlantings(),
      get().loadWateringLogs(),
      get().loadPlacements(),
    ])
    set({ ready: true })
  },
})
