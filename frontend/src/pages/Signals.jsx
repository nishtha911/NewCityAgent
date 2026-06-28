import React, { useState } from 'react';
import axios from 'axios';
import { Radio, Send, Database, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function Signals({ dbState, fetchState }) {
  const [phone, setPhone] = useState('9876543210'); // Defaults to Ramesh
  const [source, setSource] = useState('ATM');
  const [city, setCity] = useState('Bengaluru');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rawResponse, setRawResponse] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const { signals = [], users = [] } = dbState || {};

  const handleInjectSignal = async (e) => {
    e.preventDefault();
    if (!phone.trim() || !city.trim()) {
      setFormError('Phone number and destination city are required.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(false);
    setRawResponse(null);

    try {
      const response = await axios.post('/api/signals', {
        phone: phone.trim(),
        source,
        city: city.trim()
      });

      setRawResponse(response.data);
      setFormSuccess(true);
      
      // Refresh the global database explorer
      await fetchState();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.error || err.message || 'Failed to inject signal');
      setRawResponse(err.response?.data || null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSourceBadgeColor = (src) => {
    switch (src?.toUpperCase()) {
      case 'UPI': return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/20 dark:text-cyan-400';
      case 'ATM': return 'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400';
      case 'SIM': return 'bg-orange-50 text-orange-700 dark:bg-orange-955/25 dark:text-orange-400';
      default: return 'bg-slate-50 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Signal Injection Tool
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Simulate real-time external network activities (UPI transactions, ATM withdrawals, SIM card roaming) to test the agentic relocation hooks.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Form and JSON Panel: 5 cols */}
        <div className="md:col-span-5 space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 theme-transition">
            <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Radio className="h-4.5 w-4.5 text-sbi-blue dark:text-blue-400" />
              Manual Signal Injector
            </h2>

            <form onSubmit={handleInjectSignal} className="space-y-4">
              {/* Phone Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Customer / Phone Number
                </label>
                <div className="relative">
                  <select
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-md border border-slate-250 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sbi-blue dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-400 transition-colors"
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.phone}>
                        {u.name} ({u.phone}) - {u.segment}
                      </option>
                    ))}
                    <option value="9876549999">Unregistered User (9876549999)</option>
                  </select>
                </div>
              </div>

              {/* Source Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Signal Channel Source
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full rounded-md border border-slate-250 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sbi-blue dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-400 transition-colors"
                >
                  <option value="ATM">ATM Withdrawal (Location: ATM Terminal)</option>
                  <option value="UPI">UPI Merchant Scan (Location: QR Code Merchant)</option>
                  <option value="SIM">SIM Telephony Signal (Location: Roaming Tower)</option>
                </select>
              </div>

              {/* Destination City */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Relocated City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru, Pune, Delhi"
                  className="w-full rounded-md border border-slate-250 bg-white px-3 py-2 text-sm text-slate-905 outline-none focus:border-sbi-blue dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-400 transition-colors"
                />
              </div>

              {/* Error/Success Feedbacks */}
              {formError && (
                <div className="flex items-center gap-2 rounded bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/20 dark:text-rose-400">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="flex items-center gap-2 rounded bg-emerald-50 p-3 text-xs text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0 animate-bounce" />
                  <span>Signal successfully processed and recorded.</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex justify-center items-center gap-2 rounded bg-sbi-blue hover:bg-sbi-blue-hover disabled:bg-slate-205 text-white py-2.5 text-sm font-semibold cursor-pointer shadow-sm transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Injecting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Transmit Signal
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Raw Response Monospace Container */}
          {rawResponse && (
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 theme-transition overflow-hidden">
              <h3 className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                API JSON Response
              </h3>
              <pre className="rounded bg-slate-950 p-4 font-mono text-xs text-slate-200 border border-slate-900 overflow-x-auto whitespace-pre">
                {JSON.stringify(rawResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Signals Log Table: 7 cols */}
        <div className="md:col-span-7 flex flex-col rounded-lg border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900 theme-transition overflow-hidden">
          <div className="border-b border-slate-150 px-6 py-4 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Relocation Signal Logs</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Chronological history of ingested customer location triggers.</p>
            </div>
            <div className="rounded bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-2xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Database className="h-3 w-3" />
              {signals.length} Signals
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            {signals.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                No geolocation signals have been injected yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-2xs font-semibold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-4 py-3">Source Channel</th>
                    <th className="px-4 py-3">Injected City</th>
                    <th className="px-6 py-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-105 dark:divide-slate-800 text-sm">
                  {signals.map((sig) => (
                    <tr key={sig.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white">
                        {sig.phone}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold uppercase ${getSourceBadgeColor(sig.source)}`}>
                          {sig.source}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-300">
                        {sig.city}
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-slate-500 dark:text-slate-450 font-mono">
                        {new Date(sig.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
