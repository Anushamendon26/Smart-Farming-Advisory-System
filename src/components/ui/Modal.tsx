import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { Card } from './Card'

/** Accessible modal dialog with Escape-to-close and backdrop click. */
export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-ink">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-muted hover:bg-gray-50 hover:text-ink"
              aria-label="Close dialog"
            >
              <X size={20} aria-hidden />
            </button>
          </div>
          {children}
        </Card>
      </div>
    </div>
  )
}
