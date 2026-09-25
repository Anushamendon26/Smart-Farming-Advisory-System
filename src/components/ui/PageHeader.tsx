import type { ReactNode } from 'react'

export default function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold text-ink md:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-base text-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}
