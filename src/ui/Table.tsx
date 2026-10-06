import type { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react'

export function TableCard({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`overflow-hidden rounded-3xl border border-line bg-white shadow-card ${className}`}>
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  )
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-line bg-cream/60 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
      <tr>{children}</tr>
    </thead>
  )
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-line">{children}</tbody>
}

export function Th({ className = '', ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th {...props} className={`px-4 py-3 ${className}`} />
}

export function Td({ className = '', ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} className={`px-4 py-2.5 ${className}`} />
}

export function rowClass(selected: boolean, clickable = true): string {
  return `${clickable ? 'cursor-pointer hover:bg-cream/50' : ''} ${selected ? 'bg-forest-50' : ''}`
}
