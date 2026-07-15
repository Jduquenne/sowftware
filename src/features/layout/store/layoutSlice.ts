import type { StateCreator } from 'zustand'
import type { RootStore } from '../../../store/types'
import type { Placement } from '../../../services/db'
import { listPlacements, createPlacement, deletePlacement, type PlacementInput } from '../../../services/placements.service'

export interface LayoutSlice {
  placements: Placement[]
  loadPlacements: () => Promise<void>
  addPlacement: (input: PlacementInput) => Promise<void>
  removePlacement: (id: string) => Promise<void>
}

export const createLayoutSlice: StateCreator<RootStore, [], [], LayoutSlice> = (set, get) => ({
  placements: [],
  loadPlacements: async () => {
    const placements = await listPlacements()
    set({ placements })
  },
  addPlacement: async (input) => {
    await createPlacement(input)
    await get().loadPlacements()
  },
  removePlacement: async (id) => {
    await deletePlacement(id)
    await get().loadPlacements()
  },
})
