import { useIsDesktop } from '../../utils/useIsDesktop'
import { CatalogMobile } from './Catalog.mobile'
import { CatalogDesktop } from './Catalog.desktop'

/** Single responsive switch for the feature. No `md:` conditionals below this. */
export function Catalog() {
  return useIsDesktop() ? <CatalogDesktop /> : <CatalogMobile />
}
