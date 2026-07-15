import { useIsDesktop } from '../../utils/useIsDesktop'
import { HarvestMobile } from './Harvest.mobile'
import { HarvestDesktop } from './Harvest.desktop'

export function HarvestCalendar() {
  return useIsDesktop() ? <HarvestDesktop /> : <HarvestMobile />
}
