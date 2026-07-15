import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { ROUTES, routeByKey, isRouteActive, type ViewKey } from '../routes'

const PRIMARY_KEYS: ViewKey[] = ['home', 'sowing', 'harvest', 'plantings']
const MORE_KEYS: ViewKey[] = ['catalog', 'plots', 'layout', 'yield']

/** Wizard-style, one-task-at-a-time layout: 4 primary tabs + a "Plus" sheet for the rest. */
export function MobileShell() {
  const location = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)

  const moreRoutes = MORE_KEYS.map(routeByKey)
  const isInMore = moreRoutes.some((route) => isRouteActive(location.pathname, route))

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-50">
      <main className="min-h-0 flex-1 overflow-y-auto pb-16">
        <Routes>
          {ROUTES.map((route) => (
            <Route key={route.key} path={route.path} element={<route.component />} />
          ))}
        </Routes>
      </main>

      {moreOpen && (
        <div className="fixed inset-0 z-40 flex items-end bg-black/30" onClick={() => setMoreOpen(false)}>
          <div className="w-full rounded-t-xl bg-white p-4 pb-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 text-xs font-semibold uppercase text-neutral-400">Plus</div>
            {moreRoutes.map((route) => (
              <Link
                key={route.key}
                to={route.path}
                onClick={() => setMoreOpen(false)}
                className={`flex w-full items-center gap-2.5 rounded px-3 py-2.5 text-left text-sm ${
                  isRouteActive(location.pathname, route) ? 'bg-green-50 text-green-800' : 'text-neutral-700'
                }`}
              >
                <route.icon size={18} />
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 grid grid-cols-5 border-t border-neutral-200 bg-white">
        {PRIMARY_KEYS.map(routeByKey).map((route) => (
          <Link
            key={route.key}
            to={route.path}
            className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
              isRouteActive(location.pathname, route) ? 'text-green-800' : 'text-neutral-500'
            }`}
          >
            <route.icon size={18} />
            {route.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
            isInMore ? 'text-green-800' : 'text-neutral-500'
          }`}
        >
          <Menu size={18} />
          Plus
        </button>
      </nav>
    </div>
  )
}
