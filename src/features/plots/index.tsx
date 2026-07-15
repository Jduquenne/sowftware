import { useIsDesktop } from '../../utils/useIsDesktop'
import { PlotsMobile } from './Plots.mobile'
import { PlotsDesktop } from './Plots.desktop'

export function Plots() {
  return useIsDesktop() ? <PlotsDesktop /> : <PlotsMobile />
}
