import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge, { severityTone } from './Badge'
import { Card } from './Card'
import Button from './Button'
import ExplanationCard from './ExplanationCard'
import type { AdvisoryItem } from '../../types'

const categoryIcons: Record<AdvisoryItem['category'], ReactNode> = {
  weather: <span aria-hidden>🌦️</span>,
  irrigation: <span aria-hidden>💧</span>,
  fertilizer: <span aria-hidden>🧪</span>,
  'crop-health': <span aria-hidden>🐛</span>,
  general: <span aria-hidden>🌱</span>,
}

export default function AdvisoryCard({
  advisory,
  featured = false,
  link = '/weather',
}: {
  advisory: AdvisoryItem
  featured?: boolean
  link?: string
}) {
  const navigate = useNavigate()
  return (
    <Card
      hoverable
      className={`flex flex-col gap-3 ${featured ? 'border-l-4 border-l-accent bg-accent-light/40' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`flex items-center justify-center rounded-xl bg-primary-light ${featured ? 'h-12 w-12 text-2xl' : 'h-10 w-10 text-xl'}`}>
            {categoryIcons[advisory.category]}
          </span>
          <div>
            <h3 className={`font-bold text-ink ${featured ? 'text-xl' : 'text-base'}`}>{advisory.title}</h3>
            <Badge tone={severityTone(advisory.severity)}>{advisory.status}</Badge>
          </div>
        </div>
      </div>
      <p className={`text-ink/90 ${featured ? 'text-lg' : 'text-base'}`}>{advisory.message}</p>
      {(advisory.why || advisory.dataUsed || advisory.nextStep) && (
        <ExplanationCard
          what={advisory.title}
          why={advisory.why}
          dataUsed={advisory.dataUsed}
          nextStep={advisory.nextStep}
          collapsible
        />
      )}
      <Button
        variant={featured ? 'primary' : 'outline'}
        size={featured ? 'md' : 'sm'}
        className="mt-auto self-start"
        onClick={() => navigate(link)}
      >
        View Details
      </Button>
    </Card>
  )
}
