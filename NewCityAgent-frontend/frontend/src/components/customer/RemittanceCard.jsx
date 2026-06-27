import { Send, Calendar } from 'lucide-react'
import Badge from '../ui/Badge'

export default function RemittanceCard({ remittances = [] }) {
  if (!remittances.length) return null

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <Send size={18} className="text-accent" />
        <h3 className="text-sm font-semibold">Active Remittances</h3>
      </div>
      <div className="space-y-3">
        {remittances.map((r, idx) => (
          <div
            key={r.id || idx}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-surface-2 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate">
                    {r.beneficiaryName}
                  </p>
                  <Badge tone="green" size="xs">
                    {r.frequency}
                  </Badge>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  A/c {r.beneficiaryAccount}
                </p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold tabular-nums text-text">
                  ₹{Number(r.amount).toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-text-muted flex items-center gap-1 justify-end mt-0.5">
                  <Calendar size={10} />
                  {r.nextDate || 'Next: TBD'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
