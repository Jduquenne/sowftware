import { useIsDesktop } from '../../utils/useIsDesktop'
import { PlantingsMobile } from './Plantings.mobile'
import { PlantingsDesktop } from './Plantings.desktop'

export function Plantings() {
  return useIsDesktop() ? <PlantingsDesktop /> : <PlantingsMobile />
}
