import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  Bot,
  CloudSun,
  Droplets,
  FlaskConical,
  Gauge,
  Home,
  Leaf,
  LogOut,
  MapPinHouse,
  PiggyBank,
  Router,
  ScanLine,
  Settings,
  Sprout,
  History as HistoryIcon,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useT } from '../../hooks/useT'
import type { TranslationKey } from '../../i18n'
import LanguageSelector from '../ui/LanguageSelector'
import OfflineIndicator from '../ui/OfflineIndicator'
import type { ReactNode } from 'react'

interface NavItem {
  to: string
  icon: ReactNode
  labelKey: TranslationKey
}

const navGroups: { headingKey: TranslationKey; items: NavItem[] }[] = [
  {
    headingKey: 'nav.dashboard',
    items: [
      { to: '/dashboard', icon: <Home size={19} />, labelKey: 'nav.dashboard' },
      { to: '/farm', icon: <MapPinHouse size={19} />, labelKey: 'nav.farm' },
      { to: '/farm-health', icon: <Gauge size={19} />, labelKey: 'nav.farmHealth' },
    ],
  },
  {
    headingKey: 'nav.advisory',
    items: [
      { to: '/crop-advisory', icon: <Sprout size={19} />, labelKey: 'nav.crop' },
      { to: '/soil', icon: <FlaskConical size={19} />, labelKey: 'nav.soil' },
      { to: '/weather', icon: <CloudSun size={19} />, labelKey: 'nav.weather' },
      { to: '/irrigation', icon: <Droplets size={19} />, labelKey: 'nav.irrigation' },
      { to: '/fertilizer', icon: <FlaskConical size={19} />, labelKey: 'nav.fertilizer' },
      { to: '/disease', icon: <ScanLine size={19} />, labelKey: 'nav.disease' },
    ],
  },
  {
    headingKey: 'nav.market',
    items: [
      { to: '/market', icon: <BarChart3 size={19} />, labelKey: 'nav.market' },
      { to: '/savings', icon: <PiggyBank size={19} />, labelKey: 'nav.savings' },
      { to: '/sensors', icon: <Router size={19} />, labelKey: 'nav.sensors' },
      { to: '/ai-assistant', icon: <Bot size={19} />, labelKey: 'nav.ai' },
    ],
  },
  {
    headingKey: 'nav.history',
    items: [
      { to: '/history', icon: <HistoryIcon size={19} />, labelKey: 'nav.history' },
      { to: '/notifications', icon: <Bell size={19} />, labelKey: 'nav.notifications' },
      { to: '/settings', icon: <Settings size={19} />, labelKey: 'nav.settings' },
    ],
  },
]

const bottomLinks: NavItem[] = [
  { to: '/dashboard', icon: <Home size={22} />, labelKey: 'bottom.home' },
  { to: '/crop-advisory', icon: <Sprout size={22} />, labelKey: 'bottom.advisory' },
  { to: '/weather', icon: <CloudSun size={22} />, labelKey: 'bottom.weather' },
  { to: '/ai-assistant', icon: <Bot size={22} />, labelKey: 'bottom.ai' },
  { to: '/farm', icon: <Leaf size={22} />, labelKey: 'bottom.profile' },
]

export default function AppLayout() {
  const { user, farm, logout, unreadCount } = useApp()
  const t = useT()
  const navigate = useNavigate()
  const name = user?.name || farm.farmerName

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-4 backdrop-blur md:pl-64 md:px-6">
        <NavLink to="/dashboard" className="flex items-center gap-2 text-xl font-extrabold text-primary">
          <span aria-hidden>🌾</span>
          <span>{t('app.name')}</span>
        </NavLink>

        <div className="flex items-center gap-2 md:gap-3">
          <OfflineIndicator />
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
          <button
            onClick={() => navigate('/notifications')}
            className="relative rounded-full p-2 text-muted hover:bg-gray-50 hover:text-ink"
            aria-label={`${t('nav.notifications')}${unreadCount ? `, ${unreadCount} unread` : ''}`}
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-ink">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('/farm')}
            className="flex items-center gap-2 rounded-full bg-primary-light py-1 pl-1 pr-3"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white" aria-hidden>
              {name.charAt(0)}
            </span>
            <span className="hidden max-w-[120px] truncate text-sm font-semibold text-primary lg:inline">{name}</span>
          </button>
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600"
            aria-label={t('nav.logout')}
            title={t('nav.logout')}
          >
            <LogOut size={20} aria-hidden />
          </button>
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 overflow-y-auto border-r border-gray-100 bg-white pt-20 pb-4 md:block" aria-label="Main navigation">
        <nav className="space-y-5 px-3">
          {navGroups.map((group) => (
            <div key={group.headingKey}>
              <p className="mb-1 px-3 text-xs font-bold uppercase tracking-wider text-muted">{t(group.headingKey)}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-base font-semibold transition-colors ${
                        isActive ? 'bg-primary-light text-primary' : 'text-muted hover:bg-gray-50 hover:text-ink'
                      }`
                    }
                  >
                    {item.icon}
                    {t(item.labelKey)}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Page content */}
      <main className="mx-auto max-w-7xl pt-16 md:pl-60">
        <Outlet />
      </main>

      {/* Mobile bottom navigation */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-100 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label="Mobile navigation"
      >
        <div className="grid grid-cols-5">
          {bottomLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2.5 text-xs font-semibold ${
                  isActive ? 'text-primary' : 'text-muted'
                }`
              }
            >
              {l.icon}
              {t(l.labelKey)}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
