import { useState } from 'react'
import { useStore } from '../../store'
import { PlantingForm } from './PlantingForm'
import { WateringSection } from './WateringSection'
import { plantingStatusLabel } from './logic/lifecycle'
import { Button } from '../../ui/Button'
import { Badge } from '../../ui/Badge'
import { EmptyState } from '../../ui/EmptyState'
import { ListRow, ListRowGroup } from '../../ui/ListRow'

export function PlantingsMobile() {
  const plantings = useStore((s) => s.plantings)
  const catalogById = useStore((s) => s.catalogById)
  const plots = useStore((s) => s.plots)
  const addPlanting = useStore((s) => s.addPlanting)
  const editPlanting = useStore((s) => s.editPlanting)
  const removePlanting = useStore((s) => s.removePlanting)
  const [mode, setMode] = useState<'list' | 'create' | string>('list')

  const catalogName = (id: string) => {
    const entry = catalogById.get(id)
    return entry ? `${entry.nomCommun} — ${entry.variete}` : 'Plante inconnue'
  }
  const plotName = (id: string | null) => plots.find((p) => p.id === id)?.name ?? '—'

  if (mode === 'create') {
    return (
      <div className="p-4">
        <h1 className="mb-3 text-lg font-semibold text-green-800">Nouvelle plantation</h1>
        <PlantingForm
          onSubmit={async (input) => {
            await addPlanting(input)
            setMode('list')
          }}
          onCancel={() => setMode('list')}
        />
      </div>
    )
  }

  const editingPlanting = plantings.find((p) => p.id === mode)
  if (editingPlanting) {
    return (
      <div className="p-4">
        <h1 className="mb-3 text-lg font-semibold text-green-800">Modifier la plantation</h1>
        <PlantingForm
          initial={editingPlanting}
          onSubmit={async (input) => {
            await editPlanting(editingPlanting.id, input)
            setMode('list')
          }}
          onCancel={() => setMode('list')}
          onDelete={async () => {
            await removePlanting(editingPlanting.id)
            setMode('list')
          }}
        />
        <WateringSection plantingId={editingPlanting.id} />
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-green-800">Mes plantations</h1>
        <Button onClick={() => setMode('create')}>+ Nouvelle</Button>
      </div>

      <ListRowGroup className="mt-3">
        {plantings.map((planting) => (
          <ListRow
            key={planting.id}
            title={catalogName(planting.catalogId)}
            subtitle={plotName(planting.plotId)}
            trailing={<Badge className="bg-green-100 text-green-800">{plantingStatusLabel(planting.status)}</Badge>}
            onClick={() => setMode(planting.id)}
          />
        ))}
      </ListRowGroup>

      {plantings.length === 0 && <EmptyState className="mt-6">Aucune plantation pour le moment.</EmptyState>}
    </div>
  )
}
