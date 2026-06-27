import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react'

const ToastContext = createContext(null)

let _id = 0

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}

const COLORS = {
  success: 'bg-accent text-white',
  error: 'bg-danger text-white',
  info: 'bg-primary text-white',
  warning: 'bg-warning text-white',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const push = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++_id
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, duration)
  }, [])

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const api = {
    success: (m, d) => push(m, 'success', d),
    error: (m, d) => push(m, 'error', d),
    info: (m, d) => push(m, 'info', d),
    warning: (m, d) => push(m, 'warning', d),
  }

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info
          return (
            <div
              key={t.id}
              className={`toast-enter ${COLORS[t.type]} rounded-lg shadow-lg px-4 py-3 flex items-start gap-3 min-w-[280px]`}
            >
              <Icon size={18} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm font-medium leading-snug">
                {t.message}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="opacity-70 hover:opacity-100"
                aria-label="dismiss"
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}
