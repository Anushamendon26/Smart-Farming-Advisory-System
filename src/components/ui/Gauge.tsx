/** Simple semi-circular gauge (pure SVG) — used for soil moisture etc. */
export default function Gauge({
  value,
  max = 100,
  label,
  unit = '%',
}: {
  value: number
  max?: number
  label: string
  unit?: string
}) {
  const pct = Math.max(0, Math.min(1, value / max))
  const radius = 60
  const circumference = Math.PI * radius
  const color = pct < 0.35 ? '#EF5350' : pct > 0.65 ? '#2E7D32' : '#F9A825'

  return (
    <figure className="flex flex-col items-center">
      <svg width="160" height="96" viewBox="0 0 160 96" role="img" aria-label={`${label}: ${value}${unit}`}>
        <path d="M20 88 A60 60 0 0 1 140 88" fill="none" stroke="#E5E7EB" strokeWidth="14" strokeLinecap="round" />
        <path
          d="M20 88 A60 60 0 0 1 140 88"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${circumference * pct} ${circumference}`}
        />
        <text x="80" y="72" textAnchor="middle" className="fill-ink" fontSize="26" fontWeight="800">
          {Math.round(value)}
          <tspan fontSize="14">{unit}</tspan>
        </text>
      </svg>
      <figcaption className="text-base font-semibold text-muted">{label}</figcaption>
    </figure>
  )
}
