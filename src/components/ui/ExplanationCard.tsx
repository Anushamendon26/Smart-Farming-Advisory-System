import { useState } from 'react'
import { ChevronDown, ChevronUp, ListChecks, Sparkles } from 'lucide-react'
import { CardTitle } from './Card'

interface ExplanationCardProps {
  what: string
  why?: string
  dataUsed?: { label: string; value: string }[]
  nextStep?: string
  /** Collapsed by default on compact cards (dashboard). */
  collapsible?: boolean
}

/**
 * Explainable-advisory block: WHAT should I do → WHY → DATA USED → NEXT STEP.
 * Reused by crop / fertilizer / irrigation / weather / disease advisories.
 */
export default function ExplanationCard({ what, why, dataUsed, nextStep, collapsible = false }: ExplanationCardProps) {
  const [open, setOpen] = useState(!collapsible)

  return (
    <div className="rounded-xl bg-background p-4">
      <button
        type="button"
        onClick={() => collapsible && setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 text-left ${collapsible ? 'cursor-pointer' : 'cursor-default'}`}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-base font-bold text-primary">
          <Sparkles size={18} aria-hidden /> What should I do?
        </span>
        {collapsible &&
          (open ? <ChevronUp size={18} className="text-muted" aria-hidden /> : <ChevronDown size={18} className="text-muted" aria-hidden />)}
      </button>

      <p className="mt-1.5 text-lg font-semibold text-ink">{what}</p>

      {open && (
        <div className="mt-3 space-y-3">
          {why && (
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-muted">Why?</p>
              <p className="mt-0.5 text-base text-ink">{why}</p>
            </div>
          )}
          {dataUsed && dataUsed.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-muted">
                <ListChecks size={14} aria-hidden /> Data used
              </p>
              <ul className="mt-1 flex flex-wrap gap-2">
                {dataUsed.map((d) => (
                  <li key={d.label} className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-ink shadow-sm">
                    {d.label}: <span className="text-primary">{d.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {nextStep && (
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-muted">Next step</p>
              <p className="mt-0.5 text-base text-ink">→ {nextStep}</p>
            </div>
          )}
          <p className="text-xs text-muted">Advisories are informational and should be verified with local agricultural guidance.</p>
        </div>
      )}
    </div>
  )
}

export function ExplanationTitle() {
  return <CardTitle className="sr-only">Explanation of this recommendation</CardTitle>
}
