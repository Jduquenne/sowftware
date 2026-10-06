import { Calculator, LayoutDashboard } from 'lucide-react'
import { PageHeader } from '../../ui/PageHeader'
import { SectionCard } from '../../ui/SectionCard'
import { YieldCalculator } from './YieldCalculator'
import { PlotYieldEstimate } from './PlotYieldEstimate'

export function YieldDesktop() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Rendement" subtitle="Estimez ce que votre jardin peut produire" />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 px-10 py-8 xl:grid-cols-2">
          <SectionCard title="Calculateur" icon={Calculator}>
            <YieldCalculator />
          </SectionCard>
          <SectionCard title="Par parcelle" icon={LayoutDashboard} iconClass="bg-sun-100 text-sun-800">
            <PlotYieldEstimate />
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
