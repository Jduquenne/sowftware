import { useState } from 'react'
import { useStore } from '../../store'
import { PlotForm } from './PlotForm'
import { plotTypeLabel, plotDimensionLabel, expositionLabel, orientationLabel } from './logic/plotTypes'
import { flattenHierarchy, getChildren } from './logic/hierarchy'
import { Button } from '../../ui/Button'
import { EmptyState } from '../../ui/EmptyState'
import { DetailAside, DetailAsideHeading } from '../../ui/DetailAside'

export function PlotsDesktop() {
  const plots = useStore((s) => s.plots)
  const addPlot = useStore((s) => s.addPlot)
  const editPlot = useStore((s) => s.editPlot)
  const removePlot = useStore((s) => s.removePlot)
  const [selected, setSelected] = useState<'create' | string | null>(null)

  const editingPlot = plots.find((p) => p.id === selected)
  const childCount = editingPlot ? getChildren(editingPlot.id, plots).length : 0
  const rows = flattenHierarchy(plots)

  return (
    <div className="flex h-full">
      <div className="flex min-h-0 flex-1 flex-col p-6">
        <div className="mb-4 flex shrink-0 items-baseline justify-between">
          <h1 className="text-xl font-semibold text-green-800">Mes parcelles</h1>
          <Button onClick={() => setSelected('create')}>+ Nouvelle parcelle</Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-400">
                <th className="pb-2 font-medium">Nom</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Dimensions</th>
                <th className="pb-2 font-medium">Exposition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map(({ plot, depth }) => (
                <tr
                  key={plot.id}
                  onClick={() => setSelected(plot.id)}
                  className={`cursor-pointer ${selected === plot.id ? 'bg-green-50' : ''}`}
                >
                  <td className="py-2 text-neutral-800" style={{ paddingLeft: depth * 20 }}>
                    {depth > 0 && <span className="mr-1 text-neutral-300">↳</span>}
                    {plot.name}
                  </td>
                  <td className="py-2 text-neutral-500">{plotTypeLabel(plot.type)}</td>
                  <td className="py-2 text-neutral-500">{plotDimensionLabel(plot)}</td>
                  <td className="py-2 text-neutral-500">
                    {plot.exposition ? expositionLabel(plot.exposition) : '—'}
                    {plot.orientation && ` · ${orientationLabel(plot.orientation)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {plots.length === 0 && <EmptyState className="mt-6">Aucune parcelle pour le moment.</EmptyState>}
        </div>
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
              onDelete={
                childCount === 0
                  ? async () => {
                      await removePlot(editingPlot.id)
                      setSelected(null)
                    }
                  : undefined
              }
            />
            {childCount > 0 && (
              <p className="mt-2 text-xs text-neutral-400">
                Cette parcelle a {childCount} sous-parcelle(s) — détachez-les ou supprimez-les d'abord pour pouvoir
                supprimer celle-ci.
              </p>
            )}
          </>
        )}
        {!selected && <EmptyState>Sélectionnez une parcelle ou créez-en une nouvelle.</EmptyState>}
      </DetailAside>
    </div>
  )
}
