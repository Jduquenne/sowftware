import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useStore } from '../../store'
import { PlantingForm } from './PlantingForm'
import { WateringSection } from './WateringSection'
import { plantingStatusLabel } from './logic/lifecycle'
import { statusBadgeClass } from './logic/statusStyle'
import { PageHeader } from '../../ui/PageHeader'
import { Button } from '../../ui/Button'
import { Badge } from '../../ui/Badge'
import { EntryThumb } from '../../ui/EntryThumb'
import { EmptyState } from '../../ui/EmptyState'
import { DetailAside, DetailAsideHeading } from '../../ui/DetailAside'
import { TableBody, TableCard, TableHead, Td, Th, rowClass } from '../../ui/Table'

export function PlantingsDesktop() {
  const plantings = useStore((s) => s.plantings)
  const catalogById = useStore((s) => s.catalogById)
  const plots = useStore((s) => s.plots)
  const addPlanting = useStore((s) => s.addPlanting)
  const editPlanting = useStore((s) => s.editPlanting)
  const removePlanting = useStore((s) => s.removePlanting)
  const [selected, setSelected] = useState<'create' | string | null>(null)

  const plotName = (id: string | null) => plots.find((p) => p.id === id)?.name ?? '—'
  const editingPlanting = plantings.find((p) => p.id === selected)

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Plantations"
        subtitle={`${plantings.length} plantation${plantings.length > 1 ? 's' : ''} suivie${plantings.length > 1 ? 's' : ''}`}
        actions={
          <Button onClick={() => setSelected('create')}>
            <Plus size={16} />
            Nouvelle plantation
          </Button>
        }
      />

      <div className="flex min-h-0 flex-1">
        <div className="min-h-0 flex-1 overflow-y-auto px-10 py-8">
          {plantings.length === 0 ? (
            <EmptyState>Aucune plantation pour le moment.</EmptyState>
          ) : (
            <TableCard>
              <TableHead>
                <Th>Plante</Th>
                <Th>Parcelle</Th>
                <Th>Statut</Th>
              </TableHead>
              <TableBody>
                {plantings.map((planting) => {
                  const entry = catalogById.get(planting.catalogId)
                  return (
                    <tr
                      key={planting.id}
                      onClick={() => setSelected(planting.id)}
                      className={rowClass(selected === planting.id)}
                    >
                      <Td>
                        <div className="flex items-center gap-3">
                          <EntryThumb entry={entry} />
                          <div className="min-w-0">
                            <div className="font-semibold text-forest-950">{entry?.nomCommun ?? 'Plante inconnue'}</div>
                            <div className="truncate text-neutral-500">{entry?.variete}</div>
                          </div>
                        </div>
                      </Td>
                      <Td className="text-neutral-600">{plotName(planting.plotId)}</Td>
                      <Td>
                        <Badge pill className={statusBadgeClass(planting.status)}>
                          {plantingStatusLabel(planting.status)}
                        </Badge>
                      </Td>
                    </tr>
                  )
                })}
              </TableBody>
            </TableCard>
          )}
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
    </div>
  )
}
