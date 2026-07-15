import { useState } from 'react'
import { useStore } from '../../store'
import { PlantingForm } from './PlantingForm'
import { WateringSection } from './WateringSection'
import { plantingStatusLabel } from './logic/lifecycle'
import { Button } from '../../ui/Button'
import { EmptyState } from '../../ui/EmptyState'
import { DetailAside, DetailAsideHeading } from '../../ui/DetailAside'

export function PlantingsDesktop() {
  const plantings = useStore((s) => s.plantings)
  const catalog = useStore((s) => s.catalog)
  const plots = useStore((s) => s.plots)
  const addPlanting = useStore((s) => s.addPlanting)
  const editPlanting = useStore((s) => s.editPlanting)
  const removePlanting = useStore((s) => s.removePlanting)
  const [selected, setSelected] = useState<'create' | string | null>(null)

  const catalogName = (id: string) => {
    const entry = catalog.find((c) => c.id === id)
    return entry ? `${entry.nomCommun} — ${entry.variete}` : 'Plante inconnue'
  }
  const plotName = (id: string | null) => plots.find((p) => p.id === id)?.name ?? '—'

  const editingPlanting = plantings.find((p) => p.id === selected)

  return (
    <div className="flex h-full">
      <div className="flex min-h-0 flex-1 flex-col p-6">
        <div className="mb-4 flex shrink-0 items-baseline justify-between">
          <h1 className="text-xl font-semibold text-green-800">Mes plantations</h1>
          <Button onClick={() => setSelected('create')}>+ Nouvelle plantation</Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-400">
                <th className="pb-2 font-medium">Plante</th>
                <th className="pb-2 font-medium">Parcelle</th>
                <th className="pb-2 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {plantings.map((planting) => (
                <tr
                  key={planting.id}
                  onClick={() => setSelected(planting.id)}
                  className={`cursor-pointer ${selected === planting.id ? 'bg-green-50' : ''}`}
                >
                  <td className="py-2 text-neutral-800">{catalogName(planting.catalogId)}</td>
                  <td className="py-2 text-neutral-500">{plotName(planting.plotId)}</td>
                  <td className="py-2 text-neutral-500">{plantingStatusLabel(planting.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {plantings.length === 0 && <EmptyState className="mt-6">Aucune plantation pour le moment.</EmptyState>}
        </div>
      </div>

      <DetailAside>
        {selected === 'create' && (
          <>
            <DetailAsideHeading>Nouvelle plantation</DetailAsideHeading>
            <PlantingForm
              onSubmit={async (input) => {
                await addPlanting(input)
                setSelected(null)
              }}
              onCancel={() => setSelected(null)}
            />
          </>
        )}
        {editingPlanting && (
          <>
            <DetailAsideHeading>Modifier la plantation</DetailAsideHeading>
            <PlantingForm
              initial={editingPlanting}
              onSubmit={async (input) => {
                await editPlanting(editingPlanting.id, input)
                setSelected(null)
              }}
              onCancel={() => setSelected(null)}
              onDelete={async () => {
                await removePlanting(editingPlanting.id)
                setSelected(null)
              }}
            />
            <WateringSection plantingId={editingPlanting.id} />
          </>
        )}
        {!selected && <EmptyState>Sélectionnez une plantation ou créez-en une nouvelle.</EmptyState>}
      </DetailAside>
    </div>
  )
}
