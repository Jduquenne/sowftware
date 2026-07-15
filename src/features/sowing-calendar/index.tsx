import { useIsDesktop } from '../../utils/useIsDesktop'
import { SowingMobile } from './Sowing.mobile'
import { SowingDesktop } from './Sowing.desktop'

export function SowingCalendar() {
  return useIsDesktop() ? <SowingDesktop /> : <SowingMobile />
}
