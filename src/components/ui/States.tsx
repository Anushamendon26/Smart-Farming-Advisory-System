import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import Button from './Button'
import { Card } from './Card'

/** Meaningful empty state (spec §30/§40). */
export function EmptyState({
  emoji,
  icon,
  title,
  description,
  action,
}: {
  emoji?: string
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <Card className="flex flex-col items-center gap-2 py-12 text-center">
      {icon ?? <span className="text-5xl" aria-hidden>{emoji ?? '📭'}</span>}
      <h3 className="text-xl font-bold text-ink">{title}</h3>
      {description && <p className="max-w-sm text-base text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </Card>
  )
}

/** Meaningful error state with retry (spec §40). */
export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: {
  title?: string
  message: string
  onRetry?: () => void
}) {
  return (
    <Card className="flex flex-col items-center gap-3 border-red-100 py-12 text-center" role="alert">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <AlertTriangle size={28} aria-hidden />
      </span>
      <h3 className="text-xl font-bold text-ink">{title}</h3>
      <p className="max-w-sm text-base text-muted">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Card>
  )
}
