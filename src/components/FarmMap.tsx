import type { FieldZone, ZoneStatus } from '../types'

// Mock field layout — clearly labelled demo visualization, NOT a satellite
// map (spec §38). Each zone carries an icon + text label in addition to
// color so status never depends on color alone.

const zoneStyle: Record<ZoneStatus, { bg: string; icon: string; label: string }> = {
  healthy: { bg: 'bg-primary-light border-primary/30', icon: '🟢', label: 'Healthy' },
  attention: { bg: 'bg-accent-light border-accent/50', icon: '🟡', label: 'Needs Attention' },
  critical: { bg: 'bg-red-50 border-red-300', icon: '🔴', label: 'Critical' },
}

export default function FarmMap({ zones, area, crop }: { zones: FieldZone[]; area: string; crop: string }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="list" aria-label="Field zones">
        {zones.map((z) => {
          const s = zoneStyle[z.status]
          return (
            <div
              key={z.id}
              role="listitem"
              className={`min-h-28 rounded-xl2 border-2 p-3 ${s.bg}`}
              title={z.note}
            >
              <p className="text-sm font-bold text-ink">
                {s.icon} {z.name}
              </p>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-muted">{s.label}</p>
              <p className="mt-1 text-sm text-ink/80">{z.note}</p>
            </div>
          )
        })}
      </div>
      <p className="mt-3 text-sm text-muted">
        🗺️ {area} · {crop} — mock field layout (demo visualization). Real satellite / NDVI field monitoring is
        <strong> coming soon</strong> once the imagery API is connected.
      </p>
    </div>
  )
}
