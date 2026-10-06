import { Fence, Flower, Shovel, Trees, type LucideIcon } from 'lucide-react'
import type { PlotType } from '../../../services/db'

const PLOT_TYPE_ICONS: Record<PlotType, LucideIcon> = {
  jardin: Trees,
  terrasse: Fence,
  potager: Shovel,
  pot: Flower,
}

export function plotTypeIcon(type: PlotType): LucideIcon {
  return PLOT_TYPE_ICONS[type]
}
