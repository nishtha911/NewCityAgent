import React, { useState, useEffect } from 'react';
import { getState } from '../services/api';
import { Smartphone, CreditCard, Send } from 'lucide-react';

export default function SignalsPage() {
  const [form, setForm] = useState({ phone: '', source: 'ATM', city: '' });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [signals, setSignals] = useState([]);
  
  const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Patna', 'Ranchi', 'Ahmedabad'];

  const fetchSignals = async () => {
    try {
      const data = await getState();
      setSignals(data.signals || []);
    } catch (e) {}
  };

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch('/api/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setResponse(data);
      fetchSignals();
    } catch (e) {
      setResponse({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 80px' }}>
      <h2 style={{ color: 'var(--primary-purple)', marginBottom: '20px' }}>Signal Injection Tool</h2>
      
      <div style={{ display: 'flex', gap: '40px' }}>
        {/* Form Column */}
        <div style={{ flex: 1 }}>
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '25px',
            borderRadius: '8px',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Inject Location Signal</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)' }}>Phone Number</label>
                <input 
                  type="text" 
                  value={form.phone} 
                  onChange={e => setForm({...form, phone: e.target.value})}
                  required
                  placeholder="e.g. 9876543210"
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--card-border)', borderRadius: '4px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)' }}>Signal Source</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['UPI', 'ATM', 'SIM'].map(src => (
                    <button
                      type="button"
                      key={src}
                      onClick={() => setForm({...form, source: src})}
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: form.source === src ? '2px solid var(--primary-purple)' : '1px solid var(--card-border)',
                        background: form.source === src ? '#3e1b7015' : 'transparent',
                        color: form.source === src ? 'var(--primary-purple)' : 'var(--text-secondary)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        fontWeight: 'bold'
                      }}
                    >
                      {src === 'SIM' ? <Smartphone size={16} /> : <CreditCard size={16} />}
                      {src}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)' }}>City</label>
                <input 
                  type="text" 
                  value={form.city} 
                  onChange={e => setForm({...form, city: e.target.value})}
                  required
                  list="city-list"
                  placeholder="Type or select city..."
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--card-border)', borderRadius: '4px' }}
                />
                <datalist id="city-list">
                  {cities.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{
                  width: '100%',
                  background: 'var(--gradient-btn)',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: loading ? 0.7 : 1
                }}
              >
                <Send size={16} /> {loading ? 'Sending...' : 'Send Signal'}
              </button>
            </form>
          </div>
        </div>

        {/* Response Column */}
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Response & Recent Signals</h3>
          
          {response && (
            <div style={{
              background: '#0a0a0a',
              color: '#4ade80',
              padding: '15px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              overflowX: 'auto',
              marginBottom: '20px',
              border: '1px solid #333'
            }}>
              {response.cityChangeDetected && (
                <div style={{ color: '#fb923c', marginBottom: '10px', fontWeight: 'bold' }}>
                  ⚠️ CITY CHANGE DETECTED!<br/>
                  Notification: {response.notification?.message}
                </div>
              )}
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}

          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '8px',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f9f9f9', borderBottom: '1px solid var(--card-border)' }}>
                  <th style={{ padding: '12px 15px', textAlign: 'left', color: 'var(--text-secondary)' }}>Phone</th>
                  <th style={{ padding: '12px 15px', textAlign: 'left', color: 'var(--text-secondary)' }}>Source</th>
                  <th style={{ padding: '12px 15px', textAlign: 'left', color: 'var(--text-secondary)' }}>City</th>
                </tr>
              </thead>
              <tbody>
                {signals.length === 0 ? (
                  <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No signals logged yet.</td></tr>
                ) : (
                  [...signals].reverse().map((sig, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px 15px' }}>{sig.phone}</td>
                      <td style={{ padding: '12px 15px' }}>
                        <span style={{ 
                          background: sig.source === 'SIM' ? '#3e1b7020' : '#b0185e20',
                          color: sig.source === 'SIM' ? 'var(--primary-purple)' : 'var(--secondary-magenta)',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>{sig.source}</span>
                      </td>
                      <td style={{ padding: '12px 15px' }}>{sig.city}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
