import { useIsDesktop } from '../../utils/useIsDesktop'
import { LayoutMobile } from './Layout.mobile'
import { LayoutDesktop } from './Layout.desktop'

export function Layout() {
  return useIsDesktop() ? <LayoutDesktop /> : <LayoutMobile />
}
