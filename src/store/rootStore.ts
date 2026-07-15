import { create } from 'zustand'
import type { RootStore } from './types'
import { createAppSlice } from './appSlice'
import { createCatalogSlice } from '../features/catalog/store/catalogSlice'
import { createPlotsSlice } from '../features/plots/store/plotsSlice'
import { createPlantingsSlice } from '../features/plantings/store/plantingsSlice'
import { createLayoutSlice } from '../features/layout/store/layoutSlice'

export const useStore = create<RootStore>()((...args) => ({
  ...createAppSlice(...args),
  ...createCatalogSlice(...args),
  ...createPlotsSlice(...args),
  ...createPlantingsSlice(...args),
  ...createLayoutSlice(...args),
}))
