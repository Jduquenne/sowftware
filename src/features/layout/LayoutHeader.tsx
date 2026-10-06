import { ChevronRight, Grip, Pencil, Trash2 } from 'lucide-react'
import type { Plot } from '../../services/db'
import type { Tool } from './logic/desktopUiState'
import { flattenHierarchy } from '../plots/logic/hierarchy'
import { PageHeader } from '../../ui/PageHeader'
import { Button } from '../../ui/Button'
import { Select } from '../../ui/Input'

interface LayoutPageHeaderProps {
  plots: Plot[]
  allPlots: Plot[]
  plot: Plot | undefined
  tool: Tool
  onSelectPlot: (id: string) => void
  onToggleTool: (tool: 'shape' | 'delete') => void
  onToggleSeries: () => void
}

function ancestorsOf(plot: Plot, allPlots: Plot[]): Plot[] {
  const chain: Plot[] = []
  let parentId = plot.parentPlotId
  while (parentId) {
    const parent = allPlots.find((p) => p.id === parentId)
    if (!parent) break
    chain.unshift(parent)
    parentId = parent.parentPlotId
  }
  return chain
}

export function LayoutPageHeader({
  plots,
  allPlots,
  plot,
  tool,
  onSelectPlot,
  onToggleTool,
  onToggleSeries,
}: LayoutPageHeaderProps) {
  const layoutableIds = new Set(plots.map((p) => p.id))
  const breadcrumb = plot && (
    <span className="flex items-center gap-1.5">
      {ancestorsOf(plot, allPlots).map((ancestor) => (
        <span key={ancestor.id} className="flex items-center gap-1.5">
          {layoutableIds.has(ancestor.id) ? (
            <button type="button" onClick={() => onSelectPlot(ancestor.id)} className="hover:text-forest-700">
              {ancestor.name}
            </button>
          ) : (
            ancestor.name
          )}
          <ChevronRight size={14} />
        </span>
      ))}
      <span className="font-semibold text-forest-950">{plot.name}</span>
    </span>
  )

  return (
    <PageHeader
      eyebrow={breadcrumb}
      title="Disposition"
      actions={
        <>
          <div className="w-52">
            <Select value={plot?.id ?? ''} onChange={(e) => onSelectPlot(e.target.value)}>
              {flattenHierarchy(plots).map(({ plot: p, depth }) => (
                <option key={p.id} value={p.id}>
                  {depth > 0 ? `${'—'.repeat(depth)} ${p.name}` : p.name}
                </option>
              ))}
            </Select>
          </div>
          <Button variant={tool.kind === 'shape' ? 'primary' : 'secondary'} onClick={() => onToggleTool('shape')}>
            <Pencil size={16} />
            {tool.kind === 'shape' ? 'Terminer' : 'Modifier la forme'}
          </Button>
          <Button variant={tool.kind === 'delete' ? 'danger' : 'secondary'} onClick={() => onToggleTool('delete')}>
            <Trash2 size={16} />
            {tool.kind === 'delete' ? 'Terminer' : 'Supprimer'}
          </Button>
          <Button variant={tool.kind === 'armed' ? 'primary' : 'secondary'} onClick={onToggleSeries}>
            <Grip size={16} />
            {tool.kind === 'armed' ? 'Arrêter la série' : 'Placement en série'}
          </Button>
        </>
      }
    />
  )
}

interface LayoutStatusProps {
  tool: Tool
  unpositionedCount: number
}

export function LayoutStatus({ tool, unpositionedCount }: LayoutStatusProps) {
  const message =
    tool.kind === 'shape'
      ? "Cliquez ou glissez sur les cases pour les exclure de la parcelle, ou sur une case exclue pour la réintégrer."
      : tool.kind === 'delete'
        ? 'Cliquez ou glissez sur les plantes pour les retirer.'
        : tool.kind === 'armed'
          ? `Placement en série : ${tool.entry.nomCommun} — cliquez les cases vides où la placer.`
          : unpositionedCount > 0
            ? `${unpositionedCount} sous-parcelle(s) à positionner — cliquez une case vide pour choisir où la placer.`
            : null
  if (!message) return null
  return (
    <p className="w-fit rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-forest-800 shadow-card">{message}</p>
  )
}
