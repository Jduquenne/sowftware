import { useState } from 'react'
import { Ellipsis } from 'lucide-react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { ROUTES, routeByKey, isRouteActive, type ViewKey } from '../routes'

const PRIMARY_KEYS: ViewKey[] = ['home', 'sowing', 'harvest', 'plantings']
const MORE_KEYS: ViewKey[] = ['catalog', 'plots', 'layout', 'yield']

function tabClass(active: boolean) {
  return `flex flex-col items-center gap-1 pt-2 pb-3 text-[11px] ${
    active ? 'font-semibold text-forest-700' : 'font-medium text-neutral-600'
  }`
}

function tabIconClass(active: boolean) {
  return `flex h-8 w-14 items-center justify-center rounded-full transition-colors ${active ? 'bg-forest-100' : ''}`
}

export function MobileShell() {
  const location = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)

  const moreRoutes = MORE_KEYS.map(routeByKey)
  const isInMore = moreRoutes.some((route) => isRouteActive(location.pathname, route))

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-dots">
      <main className="min-h-0 flex-1 overflow-y-auto pb-20">
        <Routes>
          {ROUTES.map((route) => (
            <Route key={route.key} path={route.path} element={<route.component />} />
          ))}
        </Routes>
      </main>

      {moreOpen && (
        <div className="fixed inset-0 z-40 flex items-end bg-forest-950/35" onClick={() => setMoreOpen(false)}>
          <div className="w-full rounded-t-3xl bg-white px-4 pt-3 pb-8 shadow-float" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-neutral-200" />
            <div className="mb-2 px-2 font-display text-xl font-semibold text-forest-900">Plus</div>
            <div className="space-y-1">
              {moreRoutes.map((route) => {
                const active = isRouteActive(location.pathname, route)
                return (
                  <Link
                    key={route.key}
                    to={route.path}
                    onClick={() => setMoreOpen(false)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-[15px] font-medium ${
                      active ? 'bg-forest-50 text-forest-800' : 'text-forest-950'
                    }`}
                  >
                    <span
                      className={`flex size-10 items-center justify-center rounded-xl ${
                        active ? 'bg-forest-100 text-forest-700' : 'bg-cream text-forest-700'
                      }`}
                    >
                      <route.icon size={19} />
                    </span>
                    {route.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 grid grid-cols-5 border-t border-line bg-cream/95 backdrop-blur">
        {PRIMARY_KEYS.map(routeByKey).map((route) => {
          const active = isRouteActive(location.pathname, route)
          return (
            <Link key={route.key} to={route.path} className={tabClass(active)}>
              <span className={tabIconClass(active)}>
                <route.icon size={20} />
              </span>
              {route.label}
            </Link>
          )
        })}
        <button type="button" onClick={() => setMoreOpen(true)} className={tabClass(isInMore)}>
          <span className={tabIconClass(isInMore)}>
            <Ellipsis size={20} />
          </span>
          Plus
        </button>
      </nav>
    </div>
  )
}
