import { cn } from '../../utils/cn'

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-10 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-surface',
        className,
      )}
    >
      {Icon && (
        <div className="h-12 w-12 rounded-full bg-surface-2 flex items-center justify-center mb-4">
          <Icon size={22} className="text-text-muted" />
        </div>
      )}
      {title && (
        <h4 className="text-base font-semibold text-text">{title}</h4>
      )}
      {description && (
        <p className="mt-1 text-sm text-text-muted max-w-md">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
