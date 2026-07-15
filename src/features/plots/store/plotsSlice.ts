import type { StateCreator } from 'zustand'
import type { RootStore } from '../../../store/types'
import type { Plot } from '../../../services/db'
import { listPlots, createPlot, updatePlot, deletePlot, type PlotInput } from '../../../services/plots.service'

export interface PlotsSlice {
  plots: Plot[]
  loadPlots: () => Promise<void>
  addPlot: (input: PlotInput) => Promise<void>
  editPlot: (id: string, input: PlotInput) => Promise<void>
  removePlot: (id: string) => Promise<void>
}

export const createPlotsSlice: StateCreator<RootStore, [], [], PlotsSlice> = (set, get) => ({
  plots: [],
  loadPlots: async () => {
    const plots = await listPlots()
    set({ plots })
  },
  addPlot: async (input) => {
    await createPlot(input)
    await get().loadPlots()
  },
  editPlot: async (id, input) => {
    await updatePlot(id, input)
    await get().loadPlots()
  },
  removePlot: async (id) => {
    await deletePlot(id)
    await get().loadPlots()
  },
})
