import { useNavigate } from 'react-router-dom'
import {
  Users,
  Radio,
  Bell,
  Send,
  ArrowRight,
  Activity,
  RefreshCcw,
} from 'lucide-react'
import { useDemoState } from '../hooks/useDemoState'
import KpiCard from '../components/ui/KpiCard'
import EventLog from '../components/ui/EventLog'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
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

export default function DashboardPage() {
  const navigate = useNavigate()
  const { state, loading, refresh } = useDemoState(5000)

  if (loading && !state) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner label="Loading demo state..." />
      </div>
    )
  }

  const users = state?.users || []
  const signals = state?.signals || []
  const notifications = state?.notifications || []
  const remittances = state?.remittances || []

  // index users by phone for quick lookup
  const userMap = Object.fromEntries(users.map((u) => [u.phone, u]))

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-sm text-text-muted mt-1">
            Live overview of NewCityAgent's agentic onboarding pipeline.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={RefreshCcw}
            onClick={refresh}
          >
            Refresh
          </Button>
          <Button
            size="sm"
            variant="primary"
            iconRight={ArrowRight}
            onClick={() => navigate('/demo')}
          >
            Run a Demo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Users Tracked"
          value={users.length}
          icon={Users}
          tone="blue"
        />
        <KpiCard
          label="Signals Processed"
          value={signals.length}
          icon={Radio}
          tone="orange"
        />
        <KpiCard
          label="Notifications Sent"
          value={notifications.length}
          icon={Bell}
          tone="green"
        />
        <KpiCard
          label="Remittances Created"
          value={remittances.length}
          icon={Send}
          tone="purple"
        />
      </div>

      <EventLog />

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <Users size={16} className="text-text-muted" />
          <h3 className="text-sm font-semibold">Tracked Users</h3>
          <span className="ml-auto text-xs text-text-muted">
            {users.length} total
          </span>
        </div>
        {users.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Activity}
              title="No users tracked yet"
              description="Run a demo scenario to begin onboarding a migrant worker or student."
              action={
                <Button
                  size="sm"
                  variant="primary"
                  iconRight={ArrowRight}
                  onClick={() => navigate('/demo')}
                >
                  Start Demo
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-2 text-text-muted text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold">Phone</th>
                  <th className="px-5 py-3 text-left font-semibold">Name</th>
                  <th className="px-5 py-3 text-left font-semibold">Segment</th>
                  <th className="px-5 py-3 text-left font-semibold">
                    Last City
                  </th>
                  <th className="px-5 py-3 text-left font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const lastSig = [...signals]
                    .reverse()
                    .find((s) => s.phone === u.phone)
                  return (
                    <tr
                      key={u.phone}
                      className="border-t border-gray-100 dark:border-gray-700 hover:bg-surface-2 transition-colors"
                    >
                      <td className="px-5 py-3 font-mono text-xs">
                        {u.phone}
                      </td>
                      <td className="px-5 py-3 font-medium">{u.name}</td>
                      <td className="px-5 py-3">
                        <Badge tone={segmentTone(u.segment)}>
                          {u.segment || 'Worker'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-text-muted">
                        {u.lastCity || lastSig?.city || '—'}
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={statusTone(u.status)}>
                          {(u.status || 'none').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          iconRight={ArrowRight}
                          onClick={() => navigate(`/customer/${u.phone}`)}
                        >
                          View Journey
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
