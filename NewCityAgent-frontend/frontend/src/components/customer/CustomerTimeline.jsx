import { useMemo } from 'react'
import {
  Radio,
  MapPin,
  Bell,
  KeyRound,
  UserPlus,
  Send,
  Sparkles,
  Activity,
} from 'lucide-react'
import { useSSE } from '../../hooks/useSSE'

function iconFor(type = '') {
  const t = type.toUpperCase()
  if (t.includes('SIGNAL_RECEIVED')) return Radio
  if (t.includes('CITY_CHANGE')) return MapPin
  if (t.includes('NOTIFICATION')) return Bell
  if (t.includes('REACTIVATION')) return KeyRound
  if (t.includes('ACCOUNT_OPEN') || t.includes('ACCOUNT_CREATED')) return UserPlus
  if (t.includes('REMITTANCE')) return Send
  if (t.includes('SCENARIO')) return Sparkles
  return Activity
}

function toneFor(type = '') {
  const t = type.toUpperCase()
  if (t.includes('SIGNAL_RECEIVED')) return 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
  if (t.includes('CITY_CHANGE'))
    return 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300'
  if (t.includes('NOTIFICATION'))
    return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
  if (t.includes('REACTIVATION'))
    return 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300'
  if (t.includes('SCENARIO'))
    return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-300'
  if (t.includes('REMITTANCE'))
    return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
  if (t.includes('ERROR')) return 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300'
  return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
}

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleString('en-IN', { hour12: false })
  } catch {
    return ts
  }
}

export default function CustomerTimeline({ phone }) {
  const { events } = useSSE('/api/demo/events')

  const filtered = useMemo(() => {
    if (!phone) return events
    return events.filter((e) =>
      String(e.message || '').includes(phone) ||
      String(e.data?.phone || '').includes(phone) ||
      String(e.payload?.phone || '').includes(phone),
    )
  }, [events, phone])

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={18} className="text-primary" />
        <h3 className="text-sm font-semibold">Customer Timeline</h3>
        <span className="ml-auto text-xs text-text-muted">
          {filtered.length} event{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>
      {filtered.length === 0 ? (
        <div className="text-sm text-text-muted py-6 text-center">
          No events for this customer yet.
        </div>
      ) : (
        <ol className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-2 space-y-4">
          {filtered.map((ev, i) => {
            const Icon = iconFor(ev.type)
            return (
              <li key={i} className="relative pl-6">
                <span
                  className={`absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full ${toneFor(ev.type)}`}
                >
                  <Icon size={14} />
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-text-muted">
                    {(ev.type || 'EVENT').replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] text-text-muted">
                    {formatTime(ev.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-text mt-0.5">{ev.message}</p>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
