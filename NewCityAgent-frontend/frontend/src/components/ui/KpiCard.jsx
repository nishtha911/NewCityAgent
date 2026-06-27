import { useCountUp } from '../../hooks/useCountUp'
import { cn } from '../../utils/cn'

export default function KpiCard({
  label,
  value = 0,
  icon: Icon,
  tone = 'blue',
  sub,
}) {
  const animated = useCountUp(value, 900)

  const toneMap = {
    blue: 'text-primary bg-blue-50 dark:bg-blue-900/30',
    green: 'text-accent bg-emerald-50 dark:bg-emerald-900/30',
    orange: 'text-warning bg-amber-50 dark:bg-amber-900/30',
    purple: 'text-violet-600 bg-violet-50 dark:bg-violet-900/30',
    red: 'text-danger bg-red-50 dark:bg-red-900/30',
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface shadow-sm p-5 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-text">
            {animated.toLocaleString('en-IN')}
          </p>
          {sub && (
            <p className="mt-1 text-xs text-text-muted">{sub}</p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              toneMap[tone] || toneMap.blue,
            )}
          >
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  )
}
