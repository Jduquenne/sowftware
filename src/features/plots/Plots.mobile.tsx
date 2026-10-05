import { useState } from 'react'
import { useStore } from '../../store'
import { PlotForm } from './PlotForm'
import { plotTypeLabel, plotDimensionLabel, expositionLabel } from './logic/plotTypes'
import { flattenHierarchy, getDescendantIds } from './logic/hierarchy'
import { Button } from '../../ui/Button'
import { EmptyState } from '../../ui/EmptyState'
import { ListRow } from '../../ui/ListRow'
import { Badge } from '../../ui/Badge'

export function PlotsMobile() {
  const plots = useStore((s) => s.plots)
  const addPlot = useStore((s) => s.addPlot)
  const editPlot = useStore((s) => s.editPlot)
  const removePlot = useStore((s) => s.removePlot)
  const [mode, setMode] = useState<'list' | 'create' | string>('list')

  if (mode === 'create') {
    return (
      <div className="p-4">
        <h1 className="mb-3 text-lg font-semibold text-green-800">Nouvelle parcelle</h1>
        <PlotForm
          onSubmit={async (input) => {
            await addPlot(input)
            setMode('list')
          }}
          onCancel={() => setMode('list')}
        />
      </div>
    )
  }

  const editingPlot = plots.find((p) => p.id === mode)
  if (editingPlot) {
    const descendantCount = getDescendantIds(editingPlot.id, plots).size
    return (
      <div className="p-4">
        <h1 className="mb-3 text-lg font-semibold text-green-800">Modifier la parcelle</h1>
        <PlotForm
          initial={editingPlot}
          onSubmit={async (input) => {
            await editPlot(editingPlot.id, input)
            setMode('list')
          }}
          onCancel={() => setMode('list')}
          onDelete={async () => {
            await removePlot(editingPlot.id)
            setMode('list')
          }}
        />
        {descendantCount > 0 && (
          <p className="mt-2 text-xs text-neutral-400">
            Supprimer cette parcelle supprimera aussi ses {descendantCount} sous-parcelle(s) et leurs placements.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-green-800">Mes parcelles</h1>
        <Button onClick={() => setMode('create')}>+ Nouvelle</Button>
      </div>

      <ul className="mt-3 divide-y divide-neutral-200">
        {flattenHierarchy(plots).map(({ plot, depth }) => (
          <ListRow
            key={plot.id}
            style={{ paddingLeft: depth * 16 }}
            title={depth > 0 ? `↳ ${plot.name}` : plot.name}
            subtitle={`${plotTypeLabel(plot.type)} — ${plotDimensionLabel(plot)}`}
            trailing={
              plot.exposition && (
                <Badge className="bg-amber-50 text-amber-700">{expositionLabel(plot.exposition)}</Badge>
              )
            }
            onClick={() => setMode(plot.id)}
          />
        ))}
      </ul>

      {plots.length === 0 && <EmptyState className="mt-6">Aucune parcelle pour le moment.</EmptyState>}
    </div>
  )
}
