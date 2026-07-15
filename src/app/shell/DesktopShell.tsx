import { Routes, Route, NavLink } from 'react-router-dom'
import { Sprout } from 'lucide-react'
import { ROUTES } from '../routes'

export function DesktopShell() {
  return (
    <div className="grid h-screen grid-cols-[168px_1fr] overflow-hidden bg-neutral-50">
      <aside className="overflow-y-auto border-r border-neutral-200 bg-white p-3">
        <div className="flex items-center gap-1.5 px-1 text-sm font-semibold text-green-800">
          <Sprout size={18} />
          Jardin Planner
        </div>
        <nav className="mt-4 space-y-0.5">
          {ROUTES.map((route) => (
            <NavLink
              key={route.key}
              to={route.path}
              end={route.path === '/'}
              className={({ isActive }) =>
                `flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm ${
                  isActive ? 'bg-green-50 text-green-800' : 'text-neutral-500 hover:bg-neutral-50'
                }`
              }
            >
              <route.icon size={16} />
              {route.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="min-h-0 overflow-y-auto">
        <Routes>
          {ROUTES.map((route) => (
            <Route key={route.key} path={route.path} element={<route.component />} />
          ))}
        </Routes>
      </main>
    </div>
  )
}
