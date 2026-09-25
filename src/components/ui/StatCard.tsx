import type { ReactNode } from 'react'
import { Card } from './Card'

export default function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: ReactNode
  label: string
  value: string
  sub?: string
}) {
  return (
    <Card hoverable className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted">{label}</p>
        <p className="truncate text-xl font-bold text-ink">{value}</p>
        {sub && <p className="text-sm text-muted">{sub}</p>}
      </div>
    </Card>
  )
}
