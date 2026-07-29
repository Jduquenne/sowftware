import type { DBSchema } from 'idb'

export interface Range {
  min: number
  max: number
}

export type PotCompatibility = 'oui' | 'possible' | 'non' | 'inconnu'

/**
 * Reference species/variety data seeded from the source catalog.
 * Read-only for the user; refreshed by the non-destructive seed mechanism.
 */
export interface CatalogEntry {
  id: string
  categorie: string
  nomCommun: string
  variete: string
  nomScientifique: string
  familleBotanique: string
  multiplication: string
  moisSemis: number[]
  moisBouture: number[]
  moisPlantation: number[]
  moisRecolte: number[]
  saisonRecolte: string
  espacementCm: Range | null
  espacementRaw: string
  surfaceM2ParPied: Range | null
  surfaceRaw: string
  pot: PotCompatibility
  potNote: string
  dureeOccupationSolMois: Range | null
  dureeRaw: string
  perennial: boolean
  /** Rough estimated yield per plant, kg. Hand-curated, not from the source CSV. Null where not applicable (e.g. ornamentals) or not estimated. */
  yieldPerPlantKg: number | null
  /** Local path under public/catalog-images/, hand-curated and added progressively. Null falls back to the category icon in the UI. */
  imageUrl: string | null
  notes: string
}

export type PlotType = 'jardin' | 'terrasse' | 'potager' | 'pot'

export type Exposition = 'plein_soleil' | 'mi_ombre' | 'ombre'

export type Orientation = 'nord' | 'nord_est' | 'est' | 'sud_est' | 'sud' | 'sud_ouest' | 'ouest' | 'nord_ouest'

export interface Plot {
  id: string
  name: string
  type: PlotType
  lengthCm: number | null
  widthCm: number | null
  potCount: number | null
  exposition: Exposition | null
  orientation: Orientation | null
  /** Nesting: this plot occupies a footprint within the parent's own grid, at (xInParent, yInParent). */
  parentPlotId: string | null
  xInParent: number | null
  yInParent: number | null
  /** Cells excluded from the bounding lengthCm/widthCm rectangle, for non-rectangular plot shapes. */
  excludedCells: { x: number; y: number }[]
  createdAt: string
  updatedAt: string
}

/** A catalog entry positioned at coordinates within a plot. */
export interface Placement {
  id: string
  plotId: string
  catalogId: string
  plantingId: string | null
  x: number
  y: number
  createdAt: string
}

export type PlantingStatus = 'planned' | 'sown' | 'growing' | 'harvested' | 'removed'

/** A concrete plant the user has actually planted, distinct from the catalog. */
export interface Planting {
  id: string
  catalogId: string
  plotId: string | null
  placementId: string | null
  sownAt: string | null
  plantedAt: string | null
  expectedHarvestStart: string | null
  expectedHarvestEnd: string | null
  status: PlantingStatus
  notes: string
  createdAt: string
  updatedAt: string
}

export interface WateringLog {
  id: string
  plantingId: string | null
  plotId: string | null
  wateredAt: string
  amountMl: number | null
  note: string
}

export interface MetaRecord {
  key: string
  value: unknown
}

export interface GardenDB extends DBSchema {
  catalog: {
    key: string
    value: CatalogEntry
    indexes: { 'by-categorie': string; 'by-nomCommun': string }
  }
  plots: {
    key: string
    value: Plot
  }
  placements: {
    key: string
    value: Placement
    indexes: { 'by-plot': string }
  }
  plantings: {
    key: string
    value: Planting
    indexes: { 'by-plot': string; 'by-catalog': string; 'by-status': string }
  }
  wateringLogs: {
    key: string
    value: WateringLog
    indexes: { 'by-planting': string; 'by-plot': string }
  }
  meta: {
    key: string
    value: MetaRecord
  }
}
