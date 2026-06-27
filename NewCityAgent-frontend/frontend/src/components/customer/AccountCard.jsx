import { useNavigate } from 'react-router-dom'
import { Wallet, ExternalLink, RefreshCcw } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'

function statusTone(status) {
  if (status === 'active') return 'green'
  if (status === 'dormant') return 'orange'
  return 'gray'
}

export default function AccountCard({ account, phone }) {
  const navigate = useNavigate()

  if (!account || account.status === 'none') {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface p-5">
        <div className="flex items-center gap-2 mb-3">
          <Wallet size={18} className="text-text-muted" />
          <h3 className="text-sm font-semibold">Account</h3>
        </div>
        <EmptyState
          icon={Wallet}
          title="No account on file"
          description={`No SBI account linked to phone ${phone || '—'} yet.`}
          action={
            <Button
              size="sm"
              variant="primary"
              icon={ExternalLink}
              onClick={() => navigate('/demo')}
            >
              Run a scenario
            </Button>
          }
        />
      </div>
    )
  }

  const fields = [
    { label: 'Name', value: account.user?.name || '—' },
    { label: 'Phone', value: account.user?.phone || phone || '—' },
    {
      label: 'Status',
      value: (
        <Badge tone={statusTone(account.status)}>
          {(account.status || '').toUpperCase()}
        </Badge>
      ),
    },
    { label: 'Account #', value: account.accountNumber || '—' },
    { label: 'IFSC', value: account.ifsc || 'SBIN0000001' },
    { label: 'Segment', value: account.segment || '—' },
    { label: 'Branch', value: account.branch || '—' },
    { label: 'Last City', value: account.lastCity || '—' },
  ]

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet size={18} className="text-primary" />
          <h3 className="text-sm font-semibold">Account Details</h3>
        </div>
        {account.status === 'dormant' && (
          <Button size="sm" variant="primary" icon={RefreshCcw}>
            Reactivate
          </Button>
        )}
      </div>
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {fields.map((f) => (
          <div key={f.label}>
            <dt className="text-[10px] uppercase tracking-wider font-semibold text-text-muted">
              {f.label}
            </dt>
            <dd className="mt-1 text-sm font-medium text-text">{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
