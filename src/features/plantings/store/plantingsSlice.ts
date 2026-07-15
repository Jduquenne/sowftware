import type { StateCreator } from 'zustand'
import type { RootStore } from '../../../store/types'
import type { Planting, WateringLog } from '../../../services/db'
import {
  listPlantings,
  createPlanting,
  updatePlanting,
  deletePlanting,
  type PlantingInput,
} from '../../../services/plantings.service'
import { listWateringLogs, logWatering, deleteWateringLog, type WateringLogInput } from '../../../services/watering.service'

export interface PlantingsSlice {
  plantings: Planting[]
  wateringLogs: WateringLog[]
  loadPlantings: () => Promise<void>
  addPlanting: (input: PlantingInput) => Promise<void>
  editPlanting: (id: string, input: PlantingInput) => Promise<void>
  removePlanting: (id: string) => Promise<void>
  loadWateringLogs: () => Promise<void>
  addWateringLog: (input: WateringLogInput) => Promise<void>
  removeWateringLog: (id: string) => Promise<void>
}

export const createPlantingsSlice: StateCreator<RootStore, [], [], PlantingsSlice> = (set, get) => ({
  plantings: [],
  wateringLogs: [],
  loadPlantings: async () => {
    const plantings = await listPlantings()
    set({ plantings })
  },
  addPlanting: async (input) => {
    await createPlanting(input)
    await get().loadPlantings()
  },
  editPlanting: async (id, input) => {
    await updatePlanting(id, input)
    await get().loadPlantings()
  },
  removePlanting: async (id) => {
    await deletePlanting(id)
    await get().loadPlantings()
  },
  loadWateringLogs: async () => {
    const wateringLogs = await listWateringLogs()
    set({ wateringLogs })
  },
  addWateringLog: async (input) => {
    await logWatering(input)
    await get().loadWateringLogs()
  },
  removeWateringLog: async (id) => {
    await deleteWateringLog(id)
    await get().loadWateringLogs()
  },
})
