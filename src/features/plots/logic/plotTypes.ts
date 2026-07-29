import type { Plot, PlotType, Exposition, Orientation } from '../../../services/db'

export const PLOT_TYPES: { value: PlotType; label: string }[] = [
  { value: 'jardin', label: 'Jardin' },
  { value: 'terrasse', label: 'Terrasse' },
  { value: 'potager', label: 'Potager' },
  { value: 'pot', label: 'Pot' },
]

export const EXPOSITIONS: { value: Exposition; label: string }[] = [
  { value: 'plein_soleil', label: 'Plein soleil' },
  { value: 'mi_ombre', label: 'Mi-ombre' },
  { value: 'ombre', label: 'Ombre' },
]

export const ORIENTATIONS: { value: Orientation; label: string }[] = [
  { value: 'nord', label: 'Nord' },
  { value: 'nord_est', label: 'Nord-Est' },
  { value: 'est', label: 'Est' },
  { value: 'sud_est', label: 'Sud-Est' },
  { value: 'sud', label: 'Sud' },
  { value: 'sud_ouest', label: 'Sud-Ouest' },
  { value: 'ouest', label: 'Ouest' },
  { value: 'nord_ouest', label: 'Nord-Ouest' },
]

export function plotTypeLabel(type: PlotType): string {
  return PLOT_TYPES.find((t) => t.value === type)?.label ?? type
}

export function expositionLabel(exposition: Exposition): string {
  return EXPOSITIONS.find((e) => e.value === exposition)?.label ?? exposition
}

export function orientationLabel(orientation: Orientation): string {
  return ORIENTATIONS.find((o) => o.value === orientation)?.label ?? orientation
}

export function plotDimensionLabel(plot: Pick<Plot, 'type' | 'lengthCm' | 'widthCm' | 'potCount'>): string {
  if (plot.type === 'pot') return `${plot.potCount} pot(s)`
  return `${plot.lengthCm} × ${plot.widthCm} cm`
}

/** Only dimensioned plots (not pot-type) can be laid out, or be a parent for nested sub-plots. */
export function isLayoutable(plot: Pick<Plot, 'type' | 'lengthCm' | 'widthCm'>): boolean {
  return plot.type !== 'pot' && plot.lengthCm !== null && plot.widthCm !== null
}
