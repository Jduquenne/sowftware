import { Droplet, LayoutDashboard, Leaf, ShoppingBasket, Sprout } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store'
import { buildDashboardSummary, type WateringAlert } from './logic/dashboard'
import { formatLongDate, seasonHeadline, seasonLabel, seasonOfMonth } from './logic/season'
import { monthSummarySentence } from './logic/summaryText'
import { statusBadgeClass } from './logic/statusStyle'
import { plantingStatusLabel } from '../plantings/logic/lifecycle'
import { getCurrentMonth, monthName } from '../../utils/months'
import { PageHeader } from '../../ui/PageHeader'
import { SectionCard } from '../../ui/SectionCard'
import { StatCard } from '../../ui/StatCard'
import { Badge } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import { EmptyState } from '../../ui/EmptyState'
import { SeasonHero } from './SeasonHero'
import { WateringAlertCard } from './WateringAlertCard'
import { SeasonPlantCard } from './SeasonPlantCard'
import { FirstPlotHint } from './FirstPlotHint'

export function HomeDesktop() {
  const catalog = useStore((s) => s.catalog)
  const plots = useStore((s) => s.plots)
  const plantings = useStore((s) => s.plantings)
  const wateringLogs = useStore((s) => s.wateringLogs)
  const addWateringLog = useStore((s) => s.addWateringLog)
  const navigate = useNavigate()

  const summary = buildDashboardSummary(catalog, plots, plantings, wateringLogs)
  const month = getCurrentMonth()
  const season = seasonOfMonth(month)
  const seasonTag = `${monthName(month)} · ${seasonLabel(season)}`

  const water = ({ planting }: WateringAlert) =>
    addWateringLog({
      plantingId: planting.id,
      plotId: planting.plotId,
      wateredAt: new Date().toISOString(),
      amountMl: null,
      note: '',
    })

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Accueil"
        subtitle={formatLongDate(new Date())}
        actions={
          <span className="flex items-center gap-2 rounded-full bg-sun-100 px-5 py-2 text-sm font-semibold text-sun-800">
            <Leaf size={16} />
            {seasonTag}
          </span>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-6 px-10 py-8">
          {plots.length === 0 && <FirstPlotHint />}

          <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
            <SeasonHero
              eyebrow={seasonTag}
              headline={seasonHeadline(season)}
              sentence={monthSummarySentence(summary)}
              month={month}
            />
            <div className="flex flex-col gap-6">
              <StatCard
                icon={LayoutDashboard}
                value={summary.plotCount}
                label={
                  summary.subPlotCount > 0 ? `Parcelles · dont ${summary.subPlotCount} sous-parcelles` : 'Parcelles'
                }
              />
              <StatCard
                icon={Sprout}
                iconClass="bg-pink-100 text-pink-700"
                value={summary.ongoingPlantingCount}
                label="Plantations actives"
              >
                {summary.statusCounts.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {summary.statusCounts.map(({ status, count }) => (
                      <Badge key={status} pill className={`py-1 text-sm ${statusBadgeClass(status)}`}>
                        {plantingStatusLabel(status)} · {count}
                      </Badge>
                    ))}
                  </div>
                )}
              </StatCard>
            </div>
          </div>

          <SectionCard
            title="Arrosage"
            icon={Droplet}
            iconClass="bg-water-50 text-water-600"
            badge={
              summary.wateringAlerts.length > 0 && (
                <Badge pill className="bg-sun-100 text-sun-800">
                  {summary.wateringAlerts.length} à arroser
                </Badge>
              )
            }
            action={<span className="text-neutral-500">Non arrosées depuis 3 jours ou plus</span>}
          >
            {summary.wateringAlerts.length === 0 ? (
              <EmptyState>Rien à arroser pour le moment.</EmptyState>
            ) : (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                {summary.wateringAlerts.map((alert) => (
                  <WateringAlertCard key={alert.planting.id} alert={alert} variant="desktop" onWater={() => water(alert)} />
                ))}
              </div>
            )}
          </SectionCard>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <SectionCard
              title="À semer ce mois-ci"
              icon={Sprout}
              action={
                <Button variant="link" onClick={() => navigate('/sowing')}>
                  Calendrier des semis →
                </Button>
              }
            >
              {summary.sowingThisMonth.length === 0 ? (
                <EmptyState>Rien à semer ce mois-ci.</EmptyState>
              ) : (
                <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                  {summary.sowingThisMonth.map((entry) => (
                    <SeasonPlantCard key={entry.id} entry={entry} strip="S" />
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="À récolter maintenant"
              icon={ShoppingBasket}
              iconClass="bg-orange-50 text-orange-600"
              action={
                <Button variant="link" onClick={() => navigate('/harvest')}>
                  Calendrier des récoltes →
                </Button>
              }
            >
              {summary.harvestThisMonth.length === 0 ? (
                <EmptyState>Rien à récolter ce mois-ci.</EmptyState>
              ) : (
                <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                  {summary.harvestThisMonth.map((entry) => (
                    <SeasonPlantCard key={entry.id} entry={entry} strip="R" />
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  )
}
