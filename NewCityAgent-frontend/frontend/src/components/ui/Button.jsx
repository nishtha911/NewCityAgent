import { cn } from '../../utils/cn'

const VARIANTS = {
  primary:
    'bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary',
  secondary:
    'bg-surface-2 text-text hover:bg-gray-200 dark:hover:bg-gray-600 focus-visible:ring-gray-400',
  outline:
    'border border-gray-300 dark:border-gray-600 bg-surface text-text hover:bg-surface-2 focus-visible:ring-primary',
  danger: 'bg-danger text-white hover:bg-red-700 focus-visible:ring-danger',
  ghost:
    'bg-transparent text-text hover:bg-surface-2 focus-visible:ring-primary',
  success: 'bg-accent text-white hover:bg-emerald-700 focus-visible:ring-accent',
}

const SIZES = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
  xl: 'text-base px-6 py-3',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  icon: Icon,
  iconRight: IconRight,
  ...rest
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight size={16} />}
    </button>
  )
}
