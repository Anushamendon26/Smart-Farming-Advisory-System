import type { ReactNode } from 'react'
import type { AdvisorySeverity } from '../../types'

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const tones: Record<Tone, string> = {
  success: 'bg-primary-light text-primary',
  warning: 'bg-accent-light text-[#8a6d1a]',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-blue-50 text-blue-700',
  neutral: 'bg-gray-100 text-muted',
}

export function severityTone(s: AdvisorySeverity): Tone {
  return s === 'success' ? 'success' : s === 'warning' ? 'warning' : s === 'danger' ? 'danger' : 'info'
}

export default function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${tones[tone]}`}>
      {children}
    </span>
  )
}
