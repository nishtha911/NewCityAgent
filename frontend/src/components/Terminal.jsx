import React, { useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Trash2 } from 'lucide-react';

export default function Terminal({ events, onClear }) {
  const terminalEndRef = useRef(null);

  // Auto scroll to bottom when events update
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events]);

  const getLineClass = (type) => {
    if (!type) return 'text-slate-300';
    const typeUpper = type.toUpperCase();
    if (typeUpper.includes('ERROR')) return 'text-rose-450 dark:text-rose-405 font-medium';
    if (typeUpper.includes('WARNING')) return 'text-amber-500 font-medium';
    if (
      [
        'CITY_CHANGE',
        'NOTIFICATION_SENT',
        'REMITTANCE_SCHEDULED',
        'CBS_TRANSACTION',
        'ACCOUNT_REACTIVATED',
        'ACCOUNT_OPENED',
      ].includes(typeUpper)
    ) {
      return 'text-emerald-450 dark:text-emerald-405';
    }
    if (['SCENARIO_START', 'SCENARIO_NUDGE'].includes(typeUpper)) {
      return 'text-blue-400 font-semibold';
    }
    return 'text-slate-350 dark:text-slate-400';
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="flex h-full flex-col rounded-lg bg-slate-950 border border-slate-900 shadow-xl overflow-hidden">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between bg-slate-900 px-4 py-2 border-b border-slate-950">
        <div className="flex items-center gap-2">
          {/* Decorative Window Controls */}
          <div className="flex gap-1.5">
            <span className="h-3.5 w-3.5 rounded-full bg-rose-500 opacity-80" />
            <span className="h-3.5 w-3.5 rounded-full bg-amber-500 opacity-80" />
            <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 opacity-80" />
          </div>
          <span className="ml-2 flex items-center gap-1.5 font-mono text-xs font-medium text-slate-400">
            <TerminalIcon className="h-3.5 w-3.5" />
            Live Event Stream
          </span>
        </div>
        
        <button
          onClick={onClear}
          className="flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2.5 py-1 font-mono text-2xs font-semibold text-slate-400 hover:text-white transition-colors"
          title="Clear logs"
        >
          <Trash2 className="h-3 w-3" />
          Clear
        </button>
      </div>

      {/* Terminal Lines Container */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed">
        {events.length === 0 ? (
          <div className="text-slate-500 italic">No events recorded. Waiting for backend activities...</div>
        ) : (
          <div className="space-y-1.5">
            {events.map((event, idx) => (
              <div key={event.id || idx} className="border-b border-slate-900/50 pb-1 last:border-0 last:pb-0">
                <span className="text-slate-500">[{formatTimestamp(event.timestamp)}] </span>
                <span className="text-slate-400 font-medium">[{event.type}] </span>
                <span className={getLineClass(event.type)}>{event.message}</span>
                
                {/* Embedded details block */}
                {event.details && Object.keys(event.details).length > 0 && (
                  <pre className="mt-1 ml-4 rounded bg-slate-900/70 p-2 text-3xs text-slate-400 border border-slate-900/30 overflow-x-auto whitespace-pre">
                    {JSON.stringify(event.details, null, 2)}
                  </pre>
                )}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
