import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function LoadingSpinner({
  size = 18,
  className = '',
  label,
}) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <Loader2 size={size} className="animate-spin" />
      {label && <span className="text-sm">{label}</span>}
    </span>
  )
}
