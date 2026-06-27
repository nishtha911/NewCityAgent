import { cn } from '../../utils/cn'

const TONE = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  orange:
    'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  green:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  purple:
    'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  yellow:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  slate:
    'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
}

export default function Badge({
  children,
  tone = 'gray',
  className = '',
  icon: Icon,
  size = 'sm',
}) {
  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-semibold tracking-wide uppercase',
        sizes[size] || sizes.sm,
        TONE[tone] || TONE.gray,
        className,
      )}
    >
      {Icon && <Icon size={12} />}
      {children}
    </span>
  )
}
