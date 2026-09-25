import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BellOff, Check, Trash2 } from 'lucide-react'
import { Card } from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import { useApp } from '../context/AppContext'

const iconFor: Record<string, string> = {
  rain: '🌧️',
  irrigation: '💧',
  disease: '🐛',
  crop: '🌱',
  market: '📈',
}

const linkFor: Record<string, string> = {
  rain: '/weather',
  irrigation: '/irrigation',
  disease: '/disease',
  crop: '/crop-advisory',
  market: '/market',
}

export default function Notifications() {
  const { notifications, markRead, deleteNotification } = useApp()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const shown = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications

  return (
    <div className="page-container">
      <PageHeader
        title="Notifications"
        description="Weather alerts, advisory updates and detection results."
        action={
          <div className="flex gap-2 rounded-xl bg-primary-light p-1" role="tablist" aria-label="Filter notifications">
            {(['all', 'unread'] as const).map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-4 py-2 text-sm font-bold capitalize ${
                  filter === f ? 'bg-primary text-white' : 'text-primary'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      />

      {shown.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 py-14 text-center">
          <BellOff size={36} className="text-muted" aria-hidden />
          <p className="text-xl font-bold text-ink">You’re all caught up!</p>
          <p className="text-base text-muted">New advisories and alerts will appear here.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {shown.map((n) => (
            <Card key={n.id} className={`flex flex-wrap items-start gap-4 ${n.read ? 'opacity-75' : 'border-l-4 border-l-primary'}`}>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light text-2xl" aria-hidden>
                {iconFor[n.icon]}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-ink">{n.title}</h3>
                  {!n.read && (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-ink">New</span>
                  )}
                </div>
                <p className="mt-0.5 text-base text-muted">{n.message}</p>
                <p className="mt-1 text-sm text-muted/80">{n.time}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    to={linkFor[n.icon] ?? '/dashboard'}
                    onClick={() => markRead(n.id)}
                    className="rounded-lg border-2 border-primary px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary-light"
                  >
                    View Details
                  </Link>
                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-muted hover:bg-gray-50 hover:text-ink"
                    >
                      <Check size={16} aria-hidden /> Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                    aria-label={`Delete notification: ${n.title}`}
                  >
                    <Trash2 size={16} aria-hidden /> Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
