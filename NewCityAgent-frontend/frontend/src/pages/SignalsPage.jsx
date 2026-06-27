import { useState } from 'react'
import {
  Radio,
  Send,
  Smartphone,
  Banknote,
  Signal,
  MapPin,
  RefreshCcw,
} from 'lucide-react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { SignalsAPI } from '../services/api'
import { useDemoState } from '../hooks/useDemoState'
import { useToast } from '../context/ToastContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import { cn } from '../utils/cn'

const SOURCE_OPTIONS = [
  { value: 'UPI', label: 'UPI', icon: Banknote, hint: 'Merchant payment' },
  { value: 'ATM', label: 'ATM', icon: Banknote, hint: 'Geolocation ping' },
  { value: 'SIM', label: 'SIM', icon: Smartphone, hint: 'Roaming telemetry' },
]

const CITY_OPTIONS = [
  'Mumbai',
  'Delhi',
  'Bengaluru',
  'Pune',
  'Chennai',
  'Hyderabad',
  'Kolkata',
  'Patna',
  'Ranchi',
  'Ahmedabad',
]

export default function SignalsPage() {
  const toast = useToast()
  const { state, refresh } = useDemoState(5000)
  const [phone, setPhone] = useState('9876543210')
  const [source, setSource] = useState('ATM')
  const [city, setCity] = useState('Bengaluru')
  const [submitting, setSubmitting] = useState(false)
  const [response, setResponse] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!/^\d{10}$/.test(phone)) {
      toast.error('Phone must be 10 digits')
      return
    }
    if (!city.trim()) {
      toast.error('City is required')
      return
    }
    setSubmitting(true)
    try {
      const res = await SignalsAPI.send({ phone, source, city })
      setResponse(res)
      toast.success('Signal sent — agent pipeline triggered')
      refresh()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const signals = [...(state?.signals || [])].reverse()
  const notification =
    response?.notification ||
    response?.signalResult?.notification ||
    response?.data?.notification

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Signal Injection</h2>
        <p className="text-sm text-text-muted mt-1">
          Manually fire a UPI / ATM / SIM signal to trigger the agentic
          onboarding pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface p-6">
          <div className="flex items-center gap-2 mb-5">
            <Radio size={18} className="text-primary" />
            <h3 className="text-sm font-semibold">New Signal</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Phone
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                inputMode="numeric"
                placeholder="10-digit phone"
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-surface px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Source
              </label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {SOURCE_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setSource(opt.value)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all',
                      source === opt.value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-text-muted',
                    )}
                  >
                    <opt.icon size={20} />
                    <span className="text-xs font-semibold">{opt.label}</span>
                    <span className="text-[10px] text-text-muted">
                      {opt.hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                City
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                list="city-options"
                placeholder="e.g. Bengaluru"
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-surface px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
              <datalist id="city-options">
                {CITY_OPTIONS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={Send}
              loading={submitting}
              className="w-full sm:w-auto"
            >
              Send Signal
            </Button>
          </form>
        </div>

        <div className="space-y-4">
          {notification && (
            <div className="rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Signal size={16} className="text-accent" />
                <h4 className="text-sm font-semibold text-accent">
                  Notification Fired
                </h4>
              </div>
              <p className="text-sm text-text">{notification.message}</p>
              {notification.language && (
                <p className="text-[10px] uppercase tracking-wider text-text-muted mt-2">
                  Language: {notification.language}
                </p>
              )}
            </div>
          )}

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              Response
            </h4>
            {!response ? (
              <p className="text-sm text-text-muted italic">
                Submit a signal to see the agent's response here.
              </p>
            ) : (
              <pre className="text-[11px] font-mono bg-gray-950 text-gray-100 rounded-lg p-3 overflow-auto max-h-72">
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <MapPin size={16} className="text-text-muted" />
          <h3 className="text-sm font-semibold">Recent Signals</h3>
          <button
            onClick={refresh}
            className="ml-auto text-xs text-text-muted hover:text-text inline-flex items-center gap-1"
          >
            <RefreshCcw size={12} /> Refresh
          </button>
        </div>
        {signals.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Signal}
              title="No signals yet"
              description="Send a signal above to populate this list."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-2 text-text-muted text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold">Phone</th>
                  <th className="px-5 py-3 text-left font-semibold">Source</th>
                  <th className="px-5 py-3 text-left font-semibold">City</th>
                  <th className="px-5 py-3 text-left font-semibold">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody>
                {signals.map((s, i) => (
                  <tr
                    key={s.id || i}
                    className="border-t border-gray-100 dark:border-gray-700"
                  >
                    <td className="px-5 py-3 font-mono text-xs">{s.phone}</td>
                    <td className="px-5 py-3">
                      <Badge tone="blue">{s.source}</Badge>
                    </td>
                    <td className="px-5 py-3 font-medium">{s.city}</td>
                    <td className="px-5 py-3 text-text-muted text-xs">
                      {s.timestamp
                        ? new Date(s.timestamp).toLocaleString('en-IN', {
                            hour12: false,
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
