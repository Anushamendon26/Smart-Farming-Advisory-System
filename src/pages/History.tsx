import { useEffect, useMemo, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import Badge from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Select } from '../components/ui/Form'
import PageHeader from '../components/ui/PageHeader'
import { Spinner } from '../components/ui/Loading'
import { fetchAdvisoryHistory } from '../services/advisoryService'
import type { HistoryItem } from '../types'

const typeOptions = [
  'Crop Recommendation',
  'Weather Advisory',
  'Irrigation',
  'Disease Detection',
  'Fertilizer',
  'Soil Analysis',
]

const statusTone = (s: HistoryItem['status']) =>
  s === 'Followed' ? 'success' : s === 'Pending' ? 'warning' : 'neutral'

export default function History() {
  const [items, setItems] = useState<HistoryItem[] | null>(null)
  const [cropFilter, setCropFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    let alive = true
    fetchAdvisoryHistory().then((h) => alive && setItems(h))
    return () => {
      alive = false
    }
  }, [])

  const crops = items ? [...new Set(items.map((i) => i.crop))] : []
  const filtered = useMemo(
    () =>
      (items ?? []).filter(
        (i) =>
          (cropFilter === 'all' || i.crop === cropFilter) &&
          (typeFilter === 'all' || i.type === typeFilter),
      ),
    [items, cropFilter, typeFilter],
  )

  return (
    <div className="page-container">
      <PageHeader
        title="Advisory History"
        description="Every recommendation you received, so you can review what worked."
      />

      <Card className="mb-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-base font-semibold text-ink">Crop</span>
            <Select value={cropFilter} onChange={(e) => setCropFilter(e.target.value)}>
              <option value="all">All crops</option>
              {crops.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-base font-semibold text-ink">Advisory Type</span>
            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All types</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </label>
          <div className="flex items-end">
            <p className="flex items-center gap-1.5 rounded-xl bg-background px-4 py-3 text-base font-semibold text-muted">
              <CalendarDays size={18} aria-hidden /> Newest first
            </p>
          </div>
        </div>
      </Card>

      {!items ? (
        <Spinner label="Loading your advisory history…" />
      ) : (
        <>
          {/* Table for desktop */}
          <Card padded={false} className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-base">
              <thead className="border-b border-gray-100 bg-background text-sm uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Date</th>
                  <th className="px-5 py-3.5 font-semibold">Type</th>
                  <th className="px-5 py-3.5 font-semibold">Crop</th>
                  <th className="px-5 py-3.5 font-semibold">Recommendation</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((h) => (
                  <tr key={h.id} className="border-b border-gray-50 last:border-0 hover:bg-background/70">
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-ink">{h.date}</td>
                    <td className="px-5 py-4 text-muted">{h.type}</td>
                    <td className="px-5 py-4 text-muted">{h.crop}</td>
                    <td className="px-5 py-4 text-ink">{h.recommendation}</td>
                    <td className="px-5 py-4"><Badge tone={statusTone(h.status)}>{h.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Cards for mobile */}
          <div className="space-y-4 md:hidden">
            {filtered.map((h) => (
              <Card key={h.id}>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-ink">{h.type}</p>
                  <Badge tone={statusTone(h.status)}>{h.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted">{h.date} · {h.crop}</p>
                <p className="mt-2 text-base text-ink">{h.recommendation}</p>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <Card className="text-center text-muted">No advisories match the selected filters.</Card>
          )}
        </>
      )}
    </div>
  )
}
