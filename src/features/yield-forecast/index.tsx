import { useIsDesktop } from '../../utils/useIsDesktop'
import { YieldMobile } from './Yield.mobile'
import { YieldDesktop } from './Yield.desktop'

export function YieldForecast() {
  return useIsDesktop() ? <YieldDesktop /> : <YieldMobile />
}
