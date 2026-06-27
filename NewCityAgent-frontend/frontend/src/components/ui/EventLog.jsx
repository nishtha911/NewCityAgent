import { useEffect, useRef, useState } from 'react'
import { Terminal, Trash2 } from 'lucide-react'
import Badge from './Badge'
import { useSSE } from '../../hooks/useSSE'

function classifyEvent(type = '') {
  const t = type.toUpperCase()
  if (t.includes('SIGNAL_RECEIVED')) return 'blue'
  if (t.includes('CITY_CHANGE')) return 'orange'
  if (t.includes('NOTIFICATION')) return 'green'
  if (t.includes('REACTIVATION')) return 'purple'
  if (t.includes('SCENARIO')) return 'yellow'
  if (t.includes('ERROR')) return 'red'
  if (t.includes('ACCOUNT')) return 'blue'
  return 'slate'
}

function formatTime(ts) {
  try {
    const d = new Date(ts)
    return d.toLocaleTimeString('en-IN', { hour12: false })
  } catch {
    return '--:--:--'
  }
}

export default function EventLog({ compact = false }) {
  const { events, connected, clear } = useSSE('/api/demo/events')
  const containerRef = useRef(null)
  const [autoScroll, setAutoScroll] = useState(true)

  useEffect(() => {
    if (!autoScroll || !containerRef.current) return
    const el = containerRef.current
    el.scrollTop = el.scrollHeight
  }, [events, autoScroll])

  const handleScroll = () => {
    const el = containerRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40
    setAutoScroll(atBottom)
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-text-muted" />
          <h3 className="text-sm font-semibold text-text">Live Event Log</h3>
          <span
            className={`flex items-center gap-1.5 text-[11px] font-medium ${
              connected ? 'text-accent' : 'text-text-muted'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                connected ? 'bg-accent pulse-dot' : 'bg-gray-400'
              }`}
            />
            {connected ? 'Live' : 'Disconnected'}
          </span>
        </div>
        <button
          onClick={clear}
          className="text-xs text-text-muted hover:text-text inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-surface-2"
        >
          <Trash2 size={12} /> Clear
        </button>
      </div>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={`bg-gray-950 text-gray-200 font-mono text-[12px] leading-relaxed overflow-y-auto ${
          compact ? 'h-72' : 'h-[420px]'
        } p-3`}
      >
        {events.length === 0 && (
          <div className="text-gray-500 italic">
            Waiting for events... trigger a scenario to see live updates.
          </div>
        )}
        {events.map((ev, i) => {
          const tone = classifyEvent(ev.type)
          return (
            <div key={i} className="flex items-start gap-2 py-0.5">
              <span className="text-gray-500 shrink-0">
                [{formatTime(ev.timestamp || Date.now())}]
              </span>
              <Badge
                tone={tone}
                size="xs"
                className="shrink-0 !uppercase !tracking-wider"
              >
                {(ev.type || 'EVENT').replace(/_/g, ' ')}
              </Badge>
              <span className="break-words">{ev.message || ''}</span>
            </div>
          )
        })}
        {connected && events.length > 0 && (
          <div className="text-gray-500 mt-1">
            <span className="animate-terminal-blink">▊</span>
          </div>
        )}
      </div>
    </div>
  )
}
