const ITEMS = [
  { label: 'Semis', className: 'bg-forest-200' },
  { label: 'Plantation', className: 'bg-forest-600' },
  { label: 'Récolte', className: 'bg-sun-500' },
]

export function CatalogLegend() {
  return (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-card">
      <div className="mb-3 text-xs font-bold tracking-[0.15em] text-neutral-500 uppercase">Frises annuelles</div>
      <ul className="space-y-2 text-sm text-neutral-700">
        {ITEMS.map((item) => (
          <li key={item.label} className="flex items-center gap-3">
            <span className={`h-2 w-8 rounded-full ${item.className}`} />
            {item.label}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-3 border-t border-line pt-3 text-sm text-neutral-700">
        <span className="h-2.5 w-8 rounded-full bg-sun-100 outline-[1.5px] outline-sun-500" />
        Mois en cours
      </div>
    </div>
  )
}
