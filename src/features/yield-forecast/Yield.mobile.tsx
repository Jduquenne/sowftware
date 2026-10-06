import { useState } from 'react'
import { PageHeader } from '../../ui/PageHeader'
import { Segmented } from '../../ui/Segmented'
import type { FilterOption } from '../../ui/Filter'
import { YieldCalculator } from './YieldCalculator'
import { PlotYieldEstimate } from './PlotYieldEstimate'

type Mode = 'calculator' | 'plot'

const MODE_OPTIONS: FilterOption<Mode>[] = [
  { value: 'calculator', label: 'Calculateur' },
  { value: 'plot', label: 'Mes parcelles' },
]

export function YieldMobile() {
  const [mode, setMode] = useState<Mode>('calculator')

  return (
    <div>
      <PageHeader variant="mobile" title="Rendement" />
      <div className="space-y-4 px-5 pb-4">
        <Segmented options={MODE_OPTIONS} selected={mode} onSelect={setMode} />
        <div className="rounded-3xl border border-line bg-white p-5 shadow-card">
          {mode === 'calculator' ? <YieldCalculator /> : <PlotYieldEstimate />}
        </div>
      </div>
    </div>
  )
}
