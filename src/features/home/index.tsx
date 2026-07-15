import { useIsDesktop } from '../../utils/useIsDesktop'
import { HomeMobile } from './Home.mobile'
import { HomeDesktop } from './Home.desktop'

export function Home() {
  return useIsDesktop() ? <HomeDesktop /> : <HomeMobile />
}
