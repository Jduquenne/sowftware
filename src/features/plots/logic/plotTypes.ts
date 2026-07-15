import type { Plot, PlotType } from '../../../services/db'

export const PLOT_TYPES: { value: PlotType; label: string }[] = [
  { value: 'jardin', label: 'Jardin' },
  { value: 'terrasse', label: 'Terrasse' },
  { value: 'potager', label: 'Potager' },
  { value: 'pot', label: 'Pot' },
]

export function plotTypeLabel(type: PlotType): string {
  return PLOT_TYPES.find((t) => t.value === type)?.label ?? type
}

export function plotDimensionLabel(plot: Pick<Plot, 'type' | 'lengthCm' | 'widthCm' | 'potCount'>): string {
  if (plot.type === 'pot') return `${plot.potCount} pot(s)`
  return `${plot.lengthCm} × ${plot.widthCm} cm`
}
