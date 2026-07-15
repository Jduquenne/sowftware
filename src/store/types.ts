import type { AppSlice } from './appSlice'
import type { CatalogSlice } from '../features/catalog/store/catalogSlice'
import type { PlotsSlice } from '../features/plots/store/plotsSlice'
import type { PlantingsSlice } from '../features/plantings/store/plantingsSlice'
import type { LayoutSlice } from '../features/layout/store/layoutSlice'

/**
 * The single root store is composed of one slice per feature, plus a small
 * cross-cutting bootstrap slice. IndexedDB is the source of truth; the store
 * is an in-memory cache that slices hydrate from services. No `persist`
 * middleware. Navigation lives in the URL (react-router), not here.
 */
export type RootStore = AppSlice & CatalogSlice & PlotsSlice & PlantingsSlice & LayoutSlice
