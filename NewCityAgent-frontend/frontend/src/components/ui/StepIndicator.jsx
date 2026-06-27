import { Check } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function StepIndicator({ steps, current, onJump, maxReached }) {
  return (
    <div className="w-full">
      <ol className="flex items-center w-full">
        {steps.map((step, idx) => {
          const isCompleted = current > idx + 1
          const isCurrent = current === idx + 1
          const isReachable = idx + 1 <= maxReached
          const isLast = idx === steps.length - 1
          return (
            <li
              key={step.title}
              className={cn(
                'flex items-center',
                isLast ? 'flex-none' : 'flex-1',
              )}
            >
              <button
                disabled={!isReachable}
                onClick={() => isReachable && onJump?.(idx + 1)}
                className={cn(
                  'flex items-center gap-3 group focus:outline-none',
                  isReachable ? 'cursor-pointer' : 'cursor-not-allowed',
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all border-2',
                    isCompleted &&
                      'bg-accent border-accent text-white',
                    isCurrent &&
                      !isCompleted &&
                      'bg-primary border-primary text-white shadow-md scale-105',
                    !isCompleted &&
                      !isCurrent &&
                      'bg-surface-2 border-gray-300 text-text-muted dark:border-gray-600',
                  )}
                >
                  {isCompleted ? <Check size={16} /> : idx + 1}
                </span>
                <div className="text-left hidden sm:block">
                  <div
                    className={cn(
                      'text-[10px] uppercase tracking-wider font-semibold',
                      isCurrent
                        ? 'text-primary'
                        : isCompleted
                          ? 'text-accent'
                          : 'text-text-muted',
                    )}
                  >
                    Step {idx + 1}
                  </div>
                  <div
                    className={cn(
                      'text-sm font-medium',
                      isCurrent ? 'text-text' : 'text-text-muted',
                    )}
                  >
                    {step.title}
                  </div>
                </div>
              </button>
              {!isLast && (
                <div className="flex-1 mx-3 sm:mx-5 h-0.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all',
                      isCompleted ? 'bg-accent w-full' : 'w-0',
                    )}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
