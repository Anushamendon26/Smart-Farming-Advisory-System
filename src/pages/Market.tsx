import { useEffect, useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, CalendarDays, MapPin, TrendingUp } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardTitle } from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import { Select } from '../components/ui/Form'
import { Spinner } from '../components/ui/Loading'
import { fetchMarketPrices } from '../services/marketService'
import type { MarketPrice, PricePoint } from '../types'

export default function Market() {
  const [prices, setPrices] = useState<MarketPrice[] | null>(null)
  const [trends, setTrends] = useState<Record<string, PricePoint[]>>({})
  const [fetchedAt, setFetchedAt] = useState('')
  const [cropFilter, setCropFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [dateRange, setDateRange] = useState('7')

  useEffect(() => {
    let alive = true
    fetchMarketPrices().then((d) => {
      if (!alive) return
      setPrices(d.prices)
      setTrends(d.trends)
      setFetchedAt(d.fetchedAt)
    })
    return () => {
      alive = false
    }
  }, [])

  const filtered = useMemo(() => {
    if (!prices) return []
    return prices.filter(
      (p) =>
        (cropFilter === 'all' || p.crop === cropFilter) &&
        (locationFilter === 'all' || p.market === locationFilter),
    )
  }, [prices, cropFilter, locationFilter])

  const crops = prices ? [...new Set(prices.map((p) => p.crop))] : []
  const markets = prices ? [...new Set(prices.map((p) => p.market))] : []
  const selectedCrop = cropFilter !== 'all' ? cropFilter : 'Tomato'
  const trendData = useMemo(() => {
    const full = trends[selectedCrop] ?? []
    return full.slice(-Number(dateRange))
  }, [trends, selectedCrop, dateRange])

  return (
    <div className="page-container">
      <PageHeader
        title="Market Information"
        description="Daily mandi prices for your region. Prices change frequently — always check the last updated time."
        action={fetchedAt && <span className="text-sm text-muted">Fetched: {fetchedAt}</span>}
      />

      {/* Filters */}
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
            <span className="mb-1.5 block text-base font-semibold text-ink">Location</span>
            <Select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
              <option value="all">All markets</option>
              {markets.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
          </label>
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1 text-base font-semibold text-ink">
              <CalendarDays size={16} aria-hidden /> Date Range
            </span>
            <Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="7">Last 7 days</option>
              <option value="14">Last 14 days</option>
              <option value="30">Last 30 days</option>
            </Select>
          </label>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Price table */}
        <div>
          <h2 className="mb-3 text-xl font-bold text-ink">Today’s Prices</h2>
          {!prices ? (
            <Spinner label="Loading market prices…" />
          ) : (
            <div className="space-y-4">
              {filtered.map((p) => (
                <Card key={`${p.crop}-${p.market}`} hoverable>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-xl" aria-hidden>
                        {p.crop === 'Tomato' ? '🍅' : p.crop === 'Onion' ? '🧅' : p.crop === 'Wheat' ? '🌾' : p.crop === 'Maize' ? '🌽' : p.crop === 'Potato' ? '🥔' : '🫘'}
                      </span>
                      <div>
                        <p className="text-lg font-bold text-ink">{p.crop}</p>
                        <p className="flex items-center gap-1 text-sm text-muted">
                          <MapPin size={13} aria-hidden /> {p.market}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-extrabold text-ink">₹{p.pricePerQuintal.toLocaleString('en-IN')} / quintal</p>
                      <p className={`flex items-center justify-end gap-1 text-base font-bold ${p.changePercent >= 0 ? 'text-primary' : 'text-red-600'}`}>
                        {p.changePercent >= 0 ? <ArrowUpRight size={16} aria-hidden /> : <ArrowDownRight size={16} aria-hidden />}
                        {p.changePercent >= 0 ? '+' : ''}{p.changePercent}%
                      </p>
                      <p className="text-xs text-muted">Last updated: {p.lastUpdated}</p>
                    </div>
                  </div>
                </Card>
              ))}
              {filtered.length === 0 && (
                <Card className="text-center text-muted">No matches for the selected filters.</Card>
              )}
            </div>
          )}
        </div>

        {/* Price trend chart */}
        <div>
          <h2 className="mb-3 text-xl font-bold text-ink">{selectedCrop} Price Trend</h2>
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="text-primary" size={20} aria-hidden />
              <CardTitle>₹ per quintal · last {trendData.length} days</CardTitle>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#66BB6A" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#66BB6A" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fontSize: 13 }} stroke="#6B7280" />
                  <YAxis tick={{ fontSize: 13 }} stroke="#6B7280" domain={['dataMin - 100', 'dataMax + 100']} />
                  <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Price']} />
                  <Area type="monotone" dataKey="price" stroke="#2E7D32" strokeWidth={3} fill="url(#priceFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-sm text-muted">
              Price history shown is sample data. This chart will render live values once the market-data API is connected.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
