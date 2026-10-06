import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useStore } from '../../store'
import { PlotForm } from './PlotForm'
import { plotTypeLabel, plotDimensionLabel, expositionLabel, orientationLabel } from './logic/plotTypes'
import { plotTypeIcon } from './logic/plotStyle'
import { flattenHierarchy, getDescendantIds } from './logic/hierarchy'
import { PageHeader } from '../../ui/PageHeader'
import { Button } from '../../ui/Button'
import { Badge } from '../../ui/Badge'
import { IconTile } from '../../ui/IconTile'
import { EmptyState } from '../../ui/EmptyState'
import { DetailAside, DetailAsideHeading } from '../../ui/DetailAside'
import { TableBody, TableCard, TableHead, Td, Th, rowClass } from '../../ui/Table'

export function PlotsDesktop() {
  const plots = useStore((s) => s.plots)
  const addPlot = useStore((s) => s.addPlot)
  const editPlot = useStore((s) => s.editPlot)
  const removePlot = useStore((s) => s.removePlot)
  const [selected, setSelected] = useState<'create' | string | null>(null)

  const editingPlot = plots.find((p) => p.id === selected)
  const descendantCount = editingPlot ? getDescendantIds(editingPlot.id, plots).size : 0
  const rows = flattenHierarchy(plots)
  const subPlotCount = plots.filter((p) => p.parentPlotId !== null).length

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Parcelles"
        subtitle={`${plots.length} parcelle${plots.length > 1 ? 's' : ''}${subPlotCount > 0 ? ` · dont ${subPlotCount} sous-parcelles` : ''}`}
        actions={
          <Button onClick={() => setSelected('create')}>
            <Plus size={16} />
            Nouvelle parcelle
          </Button>
        }
      />

      <div className="flex min-h-0 flex-1">
        <div className="min-h-0 flex-1 overflow-y-auto px-10 py-8">
          {plots.length === 0 ? (
            <EmptyState>Aucune parcelle pour le moment.</EmptyState>
          ) : (
            <TableCard>
              <TableHead>
                <Th>Nom</Th>
                <Th>Type</Th>
                <Th>Dimensions</Th>
                <Th>Exposition</Th>
              </TableHead>
              <TableBody>
                {rows.map(({ plot, depth }) => (
                  <tr key={plot.id} onClick={() => setSelected(plot.id)} className={rowClass(selected === plot.id)}>
                    <Td>
                      <div className="flex items-center gap-3" style={{ paddingLeft: depth * 24 }}>
                        {depth > 0 && <span className="text-neutral-300">↳</span>}
                        <IconTile icon={plotTypeIcon(plot.type)} size="sm" />
                        <span className="font-semibold text-forest-950">{plot.name}</span>
                      </div>
                    </Td>
                    <Td className="text-neutral-600">{plotTypeLabel(plot.type)}</Td>
                    <Td className="text-neutral-600">{plotDimensionLabel(plot)}</Td>
                    <Td>
                      {plot.exposition ? (
                        <Badge pill className="bg-sun-100 text-sun-800">
                          {expositionLabel(plot.exposition)}
                          {plot.orientation && ` · ${orientationLabel(plot.orientation)}`}
                        </Badge>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </Td>
                  </tr>
                ))}
              </TableBody>
            </TableCard>
          )}
        </div>

        <DetailAside>
          {selected === 'create' && (
            <>
              <DetailAsideHeading>Nouvelle parcelle</DetailAsideHeading>
              <PlotForm
                onSubmit={async (input) => {
                  await addPlot(input)
                  setSelected(null)
                }}
                onCancel={() => setSelected(null)}
              />
            </>
          )}
          {editingPlot && (
            <>
              <DetailAsideHeading>Modifier la parcelle</DetailAsideHeading>
              <PlotForm
                initial={editingPlot}
                onSubmit={async (input) => {
                  await editPlot(editingPlot.id, input)
                  setSelected(null)
                }}
                onCancel={() => setSelected(null)}
                onDelete={async () => {
                  await removePlot(editingPlot.id)
                  setSelected(null)
                }}
              />
              {descendantCount > 0 && (
                <p className="mt-3 text-xs text-neutral-500">
                  Supprimer cette parcelle supprimera aussi ses {descendantCount} sous-parcelle(s) et leurs placements.
                </p>
              )}
            </>
          )}
          {!selected && <EmptyState>Sélectionnez une parcelle ou créez-en une nouvelle.</EmptyState>}
        </DetailAside>
      </div>
    </div>
  )
}
