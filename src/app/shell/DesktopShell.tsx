import { Routes, Route, NavLink } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { ROUTES } from '../routes'
import { SidebarFoliage } from './SidebarFoliage'

export function DesktopShell() {
  return (
    <div className="grid h-screen grid-cols-[240px_1fr] overflow-hidden">
      <aside className="relative flex flex-col overflow-hidden bg-linear-to-b from-forest-800 to-forest-950 text-forest-50">
        <div className="flex items-center gap-3 px-5 pt-6">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-lime-300 to-forest-400 text-forest-900 shadow-sm">
            <Leaf size={22} />
          </div>
          <div className="font-display text-xl leading-[1.05] font-semibold">
            Jardin
            <br />
            Planner
          </div>
        </div>

        <nav className="relative z-10 mt-8 min-h-0 flex-1 space-y-1 overflow-y-auto px-3">
          {ROUTES.map((route) => (
            <NavLink
              key={route.key}
              to={route.path}
              end={route.path === '/'}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors ${
                  isActive
                    ? 'bg-white/12 text-white shadow-[inset_3px_0_0_var(--color-forest-300)]'
                    : 'text-forest-100/85 hover:bg-white/6 hover:text-white'
                }`
              }
            >
              <route.icon size={19} />
              {route.label}
            </NavLink>
          ))}
        </nav>

        <SidebarFoliage className="pointer-events-none absolute bottom-0 left-0 w-full text-forest-600/70" />
        <p className="relative z-10 px-5 pt-4 pb-5 text-xs leading-snug text-forest-100/75">
          Hors ligne · vos données restent sur cet appareil
        </p>
      </aside>
      <main className="min-h-0 overflow-y-auto bg-dots">
        <Routes>
          {ROUTES.map((route) => (
            <Route key={route.key} path={route.path} element={<route.component />} />
          ))}
        </Routes>
      </main>
    </div>
  )
}
