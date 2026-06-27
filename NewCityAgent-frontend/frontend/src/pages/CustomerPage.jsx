import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, User } from 'lucide-react'
import { useDemoState } from '../hooks/useDemoState'
import AccountCard from '../components/customer/AccountCard'
import RemittanceCard from '../components/customer/RemittanceCard'
import CustomerTimeline from '../components/customer/CustomerTimeline'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { cn } from '../utils/cn'

function statusTone(status) {
  if (status === 'active') return 'green'
  if (status === 'dormant') return 'orange'
  return 'gray'
}

function segmentTone(segment) {
  if (segment === 'Student') return 'blue'
  if (segment === 'Worker' || segment === 'Migrant') return 'green'
  return 'gray'
}

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function CustomerPage() {
  const { phone } = useParams()
  const navigate = useNavigate()
  const { state, loading } = useDemoState(5000)

  const user = useMemo(() => {
    if (!state?.users) return null
    return state.users.find((u) => u.phone === phone) || null
  }, [state, phone])

  const remittances = useMemo(
    () =>
      (state?.remittances || []).filter(
        (r) => r.phone === phone || r.userPhone === phone,
      ),
    [state, phone],
  )

  const lastSig = useMemo(() => {
    if (!state?.signals) return null
    const reversed = [...state.signals].reverse()
    return reversed.find((s) => s.phone === phone) || null
  }, [state, phone])

  if (loading && !state) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner label="Loading customer..." />
      </div>
    )
  }

  const name = user?.name || 'Unknown Customer'
  const status = user?.status || 'none'
  const segment = user?.segment || 'Worker'
  const city = user?.lastCity || lastSig?.city || '—'

  const avatarTone =
    segment === 'Student'
      ? 'bg-blue-500'
      : segment === 'Worker' || segment === 'Migrant'
        ? 'bg-emerald-500'
        : 'bg-gray-500'

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        icon={ArrowLeft}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface p-5 sm:p-6 flex items-center gap-4 sm:gap-5">
        <div
          className={cn(
            'h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0',
            avatarTone,
          )}
        >
          {initials(name) || <User size={28} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold truncate">{name}</h2>
            <Badge tone={segmentTone(segment)}>{segment}</Badge>
            <Badge tone={statusTone(status)}>{status.toUpperCase()}</Badge>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
            <span className="font-mono">{phone}</span>
            <span>•</span>
            <span>{city}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AccountCard account={user ? { ...user, status } : null} phone={phone} />
          <CustomerTimeline phone={phone} />
        </div>
        <div className="space-y-6">
          <RemittanceCard remittances={remittances} />
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface p-5">
            <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-text-muted">Last signal</span>
                <span className="font-mono text-xs">
                  {lastSig
                    ? new Date(lastSig.timestamp).toLocaleString('en-IN', {
                        hour12: false,
                      })
                    : '—'}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-text-muted">Signals</span>
                <span className="font-mono text-xs">
                  {(state?.signals || []).filter((s) => s.phone === phone).length}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-text-muted">Notifications</span>
                <span className="font-mono text-xs">
                  {
                    (state?.notifications || []).filter(
                      (n) => n.phone === phone || n.to === phone,
                    ).length
                  }
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
