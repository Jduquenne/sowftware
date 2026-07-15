import type { ReactNode } from 'react'

export function DetailAside({ children }: { children: ReactNode }) {
  return <aside className="w-80 shrink-0 overflow-y-auto border-l border-neutral-200 p-4">{children}</aside>
}

export function DetailAsideHeading({ children }: { children: ReactNode }) {
  return <h2 className="mb-3 text-sm font-semibold text-green-800">{children}</h2>
}
