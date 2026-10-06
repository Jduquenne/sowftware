import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useStore } from '../../store'
import { PlotForm } from './PlotForm'
import { plotTypeLabel, plotDimensionLabel, expositionLabel } from './logic/plotTypes'
import { plotTypeIcon } from './logic/plotStyle'
import { flattenHierarchy, getDescendantIds } from './logic/hierarchy'
import { PageHeader } from '../../ui/PageHeader'
import { Button } from '../../ui/Button'
import { EmptyState } from '../../ui/EmptyState'
import { ListRow, ListRowGroup } from '../../ui/ListRow'
import { Badge } from '../../ui/Badge'
import { IconTile } from '../../ui/IconTile'

export function PlotsMobile() {
  const plots = useStore((s) => s.plots)
  const addPlot = useStore((s) => s.addPlot)
  const editPlot = useStore((s) => s.editPlot)
  const removePlot = useStore((s) => s.removePlot)
  const [mode, setMode] = useState<'list' | 'create' | string>('list')

  if (mode === 'create') {
    return (
      <div>
        <PageHeader variant="mobile" title="Nouvelle parcelle" />
        <div className="px-5 pb-4">
          <PlotForm
            onSubmit={async (input) => {
              await addPlot(input)
              setMode('list')
            }}
            onCancel={() => setMode('list')}
          />
        </div>
      </div>
    )
  }

  const editingPlot = plots.find((p) => p.id === mode)
  if (editingPlot) {
    const descendantCount = getDescendantIds(editingPlot.id, plots).size
    return (
      <div>
        <PageHeader variant="mobile" title="Modifier la parcelle" subtitle={editingPlot.name} />
        <div className="px-5 pb-4">
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
            <p className="mt-3 text-xs text-neutral-500">
              Supprimer cette parcelle supprimera aussi ses {descendantCount} sous-parcelle(s) et leurs placements.
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        variant="mobile"
        title="Parcelles"
        actions={
          <Button size="sm" onClick={() => setMode('create')}>
            <Plus size={14} />
            Nouvelle
          </Button>
        }
      />

      <div className="px-5 pb-4">
        <ListRowGroup>
          {flattenHierarchy(plots).map(({ plot, depth }) => (
            <ListRow
              key={plot.id}
              style={{ marginLeft: depth * 16 }}
              leading={<IconTile icon={plotTypeIcon(plot.type)} size="sm" />}
              title={plot.name}
              subtitle={`${plotTypeLabel(plot.type)} · ${plotDimensionLabel(plot)}`}
              trailing={
                plot.exposition && (
                  <Badge pill className="bg-sun-100 text-sun-800">
                    {expositionLabel(plot.exposition)}
                  </Badge>
                )
              }
              onClick={() => setMode(plot.id)}
            />
          ))}
        </ListRowGroup>

        {plots.length === 0 && <EmptyState className="mt-4">Aucune parcelle pour le moment.</EmptyState>}
      </div>
    </div>
  )
}
