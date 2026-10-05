import type { Plot } from '../../services/db'
import { CELL_SIZE_CM, type GridDimensions } from './logic/grid'
import type { Tool } from './logic/desktopUiState'
import { flattenHierarchy } from '../plots/logic/hierarchy'
import { Button } from '../../ui/Button'
import { Select } from '../../ui/Input'

interface LayoutToolbarProps {
  plots: Plot[]
  selectedPlotId: string
  tool: Tool
  onSelectPlot: (id: string) => void
  onToggleTool: (tool: 'shape' | 'delete') => void
}

export function LayoutToolbar({ plots, selectedPlotId, tool, onSelectPlot, onToggleTool }: LayoutToolbarProps) {
  return (
    <div className="mb-4 flex shrink-0 items-baseline justify-between">
      <h1 className="text-xl font-semibold text-green-800">Assistant de disposition</h1>
      <div className="flex items-center gap-2">
        <div className="w-48">
          <Select value={selectedPlotId} onChange={(e) => onSelectPlot(e.target.value)}>
            {flattenHierarchy(plots).map(({ plot, depth }) => (
              <option key={plot.id} value={plot.id}>
                {depth > 0 ? `${'—'.repeat(depth)} ${plot.name}` : plot.name}
              </option>
            ))}
          </Select>
        </div>
        <Button variant={tool.kind === 'shape' ? 'primary' : 'secondary'} onClick={() => onToggleTool('shape')}>
          {tool.kind === 'shape' ? 'Terminer' : 'Modifier la forme'}
        </Button>
        <Button variant={tool.kind === 'delete' ? 'danger' : 'secondary'} onClick={() => onToggleTool('delete')}>
          {tool.kind === 'delete' ? 'Terminer' : 'Supprimer'}
        </Button>
      </div>
    </div>
  )
}

interface LayoutStatusProps {
  plot: Plot
  parentPlot: Plot | undefined
  grid: GridDimensions
  tool: Tool
  unpositionedCount: number
  onSelectPlot: (id: string) => void
  onDisarm: () => void
}

export function LayoutStatus({ plot, parentPlot, grid, tool, unpositionedCount, onSelectPlot, onDisarm }: LayoutStatusProps) {
  const shapeMode = tool.kind === 'shape'
  return (
    <>
      {parentPlot && (
        <button
          type="button"
          onClick={() => onSelectPlot(parentPlot.id)}
          className="mb-2 flex shrink-0 items-center gap-1 text-xs text-green-800 hover:underline"
        >
          ← {parentPlot.name}
        </button>
      )}
      <div className="mb-3 shrink-0">
        <p className="text-xs text-neutral-400">
          Grille {grid.cols}×{grid.rows} cases ({CELL_SIZE_CM} cm/case) — {plot.lengthCm}×{plot.widthCm} cm
          {shapeMode && " — cliquez une case pour l'exclure ou la réinclure dans la parcelle"}
          {tool.kind === 'delete' && ' — cliquez ou glissez sur les plantes pour les retirer'}
        </p>
        {!shapeMode && unpositionedCount > 0 && (
          <p className="mt-1 text-xs text-blue-700">
            {unpositionedCount} sous-parcelle(s) à positionner — cliquez une case vide pour choisir où la placer.
          </p>
        )}
        {tool.kind === 'armed' && (
          <div className="mt-1 flex items-center justify-between rounded border border-green-200 bg-green-50 px-2 py-1">
            <p className="text-xs text-green-800">
              Placement en série : <strong>{tool.entry.nomCommun}</strong> — cliquez une case vide pour en ajouter
              une autre.
            </p>
            <button
              type="button"
              onClick={onDisarm}
              className="ml-2 shrink-0 text-xs font-medium text-green-700 hover:underline"
            >
              Arrêter
            </button>
          </div>
        )}
      </div>
    </>
  )
}
