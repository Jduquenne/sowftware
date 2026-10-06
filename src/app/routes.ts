import type { ComponentType } from 'react'
import { House, BookOpen, Sprout, ShoppingBasket, LayoutDashboard, Leaf, Grid3x3, Calculator } from 'lucide-react'
import { Home } from '../features/home'
import { Catalog } from '../features/catalog'
import { SowingCalendar } from '../features/sowing-calendar'
import { HarvestCalendar } from '../features/harvest-calendar'
import { Plots } from '../features/plots'
import { Plantings } from '../features/plantings'
import { Layout } from '../features/layout'
import { YieldForecast } from '../features/yield-forecast'

export type ViewKey = 'home' | 'catalog' | 'sowing' | 'harvest' | 'plots' | 'plantings' | 'layout' | 'yield'

export interface RouteDef {
  key: ViewKey
  path: string
  label: string
  icon: ComponentType<{ size?: number }>
  component: ComponentType
}

// Shared by both shells; feature-internal detail routes are declared in the feature, not here.
export const ROUTES: RouteDef[] = [
  { key: 'home', path: '/', label: 'Accueil', icon: House, component: Home },
  { key: 'catalog', path: '/catalog', label: 'Catalogue', icon: BookOpen, component: Catalog },
  { key: 'sowing', path: '/sowing', label: 'Semis', icon: Sprout, component: SowingCalendar },
  { key: 'harvest', path: '/harvest', label: 'Récolte', icon: ShoppingBasket, component: HarvestCalendar },
  { key: 'plots', path: '/plots', label: 'Parcelles', icon: LayoutDashboard, component: Plots },
  { key: 'plantings', path: '/plantings', label: 'Plantations', icon: Leaf, component: Plantings },
  { key: 'layout', path: '/layout', label: 'Disposition', icon: Grid3x3, component: Layout },
  { key: 'yield', path: '/yield', label: 'Rendement', icon: Calculator, component: YieldForecast },
]

export function routeByKey(key: ViewKey): RouteDef {
  const route = ROUTES.find((r) => r.key === key)
  if (!route) throw new Error(`Unknown view key: ${key}`)
  return route
}

export function isRouteActive(pathname: string, route: RouteDef): boolean {
  return route.path === '/' ? pathname === '/' : pathname.startsWith(route.path)
}
