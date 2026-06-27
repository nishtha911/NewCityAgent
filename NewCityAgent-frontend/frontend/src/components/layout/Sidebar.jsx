import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  PlayCircle,
  Radio,
  RotateCcw,
  Building2,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useDemoState } from '../../hooks/useDemoState'
import { DemoAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/demo', label: 'Demo', icon: PlayCircle },
  { to: '/signals', label: 'Signals', icon: Radio },
]

export default function Sidebar({ connected }) {
  const { refresh } = useDemoState(0)
  const toast = useToast()

  const handleReset = async () => {
    if (!confirm('Reset the entire demo state? This wipes all users, signals and events.'))
      return
    try {
      await DemoAPI.reset()
      await refresh()
      toast.success('Demo state reset')
    } catch (e) {
      toast.error('Reset failed: ' + e.message)
    }
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-gray-200 dark:border-gray-700 bg-surface">
        <Logo />
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:bg-surface-2 hover:text-text',
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={handleReset}
            className="w-full inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-text-muted hover:bg-surface-2 hover:text-text"
          >
            <RotateCcw size={14} /> Reset Demo State
          </button>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-2">
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                connected ? 'bg-accent pulse-dot' : 'bg-gray-400',
              )}
            />
            <span className="text-xs font-medium text-text-muted">
              {connected ? 'Live' : 'Disconnected'}
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-gray-200 dark:border-gray-700 flex items-center justify-around py-2 px-2">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-md text-[10px] font-medium',
                isActive ? 'text-primary' : 'text-text-muted',
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
        <button
          onClick={handleReset}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-md text-[10px] font-medium text-text-muted"
        >
          <RotateCcw size={18} />
          Reset
        </button>
      </nav>
    </>
  )
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 px-4 py-5 border-b border-gray-200 dark:border-gray-700">
      <div className="relative h-9 w-9 rounded-lg bg-primary flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 36 36" className="h-full w-full">
          <defs>
            <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#1a56db" />
              <stop offset="100%" stopColor="#0e9f6e" />
            </linearGradient>
          </defs>
          <rect width="36" height="36" rx="8" fill="url(#sky)" />
          {/* skyline */}
          <g fill="white" opacity="0.95">
            <rect x="6" y="20" width="3" height="10" />
            <rect x="10" y="16" width="3" height="14" />
            <rect x="14" y="22" width="3" height="8" />
            <rect x="18" y="14" width="3" height="16" />
            <rect x="22" y="18" width="3" height="12" />
            <rect x="26" y="21" width="3" height="9" />
          </g>
          <text
            x="18"
            y="13"
            textAnchor="middle"
            fontSize="9"
            fontWeight="800"
            fill="white"
            fontFamily="Inter, sans-serif"
          >
            NCA
          </text>
        </svg>
      </div>
      <div className="leading-tight">
        <div className="text-sm font-bold text-text">NewCityAgent</div>
        <div className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
          SBI Onboarding
        </div>
      </div>
    </Link>
  )
}
