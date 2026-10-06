import { monthChipLabel } from './logic/season'

interface SeasonHeroProps {
  eyebrow: string
  headline: string
  sentence: string
  month: number
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

function HeroFoliage({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 400 320" className={className} aria-hidden="true">
      <path d="M150 -10 C 210 90, 250 190, 330 330" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M196 70 C 236 54, 270 72, 280 104 C 240 112, 206 98, 196 70 Z" fill="currentColor" />
      <path d="M232 150 C 196 150, 168 176, 166 210 C 204 208, 230 184, 232 150 Z" fill="currentColor" />
      <path d="M290 250 C 330 226, 380 236, 400 262 C 360 286, 312 280, 290 250 Z" fill="currentColor" />
    </svg>
  )
}

export function SeasonHero({ eyebrow, headline, sentence, month }: SeasonHeroProps) {
  return (
    <section className="relative flex flex-col overflow-hidden rounded-3xl bg-linear-to-br from-forest-800 via-forest-600 to-forest-400 p-10 text-white shadow-float">
      <HeroFoliage className="pointer-events-none absolute right-0 bottom-0 h-full text-white/15" />
      <div className="pointer-events-none absolute top-10 right-12 size-20 rounded-full bg-sun-300/35 p-3">
        <div className="size-full rounded-full bg-sun-300/90" />
      </div>
      <div className="relative max-w-2xl">
        <div className="text-sm font-bold tracking-[0.2em] text-sun-300 uppercase">{eyebrow}</div>
        <h2 className="mt-3 font-display text-5xl leading-tight font-semibold">{headline}</h2>
        <p className="mt-4 text-lg text-white/90">{sentence}</p>
      </div>
      <div className="relative mt-auto flex flex-wrap gap-2 pt-10">
        {MONTHS.map((m) => (
          <span
            key={m}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              m === month ? 'bg-sun-300 font-semibold text-forest-950' : 'bg-white/12 text-white/80'
            }`}
          >
            {monthChipLabel(m)}
          </span>
        ))}
      </div>
    </section>
  )
}
