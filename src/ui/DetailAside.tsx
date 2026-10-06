import type { ReactNode } from 'react'

export function DetailAside({ children }: { children: ReactNode }) {
  return <aside className="w-80 shrink-0 overflow-y-auto border-l border-line bg-white p-5">{children}</aside>
}

export function DetailAsideHeading({ children }: { children: ReactNode }) {
  return <h2 className="mb-4 font-display text-xl font-semibold text-forest-900">{children}</h2>
}
