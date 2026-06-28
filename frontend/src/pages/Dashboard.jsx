import React from 'react';
import { triggerScenario, resetState } from '../services/api';
import { useSSE } from '../hooks/useSSE';
import { Terminal, RefreshCw, Zap } from 'lucide-react';

export default function Dashboard() {
  const events = useSSE('/api/demo/events');

  const handleTrigger = async (scenario) => {
    try {
      await triggerScenario(scenario);
      alert('Scenario triggered! Check Customer Simulator Tab.');
    } catch (e) {
      alert('Error triggering scenario. Is backend running?');
    }
  };

  const handleReset = async () => {
    await resetState();
    alert('Backend state reset.');
  };

  return (
    <div style={{ padding: '40px 80px', display: 'flex', gap: '40px' }}>
      
      {/* Controls Section */}
      <div style={{ flex: 1 }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--primary-purple)' }}>Agent Control Panel</h2>
        
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid var(--card-border)',
          boxShadow: 'var(--card-shadow)'
        }}>
          <h3 style={{ marginBottom: '15px' }}>Trigger Relocation Scenarios</h3>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
            <button 
              onClick={() => handleTrigger('migrant_worker')}
              style={{
                background: 'var(--secondary-magenta)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <Zap size={16} /> Migrant Worker (ATM Signal)
            </button>
            <button 
              onClick={() => handleTrigger('student')}
              style={{
                background: 'var(--primary-purple)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <Zap size={16} /> Student (SIM Signal)
            </button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px dashed var(--card-border)', margin: '20px 0' }} />

          <button 
            onClick={handleReset}
            style={{
              background: 'transparent',
              border: '1px solid var(--text-secondary)',
              color: 'var(--text-secondary)',
              padding: '8px 16px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <RefreshCw size={16} /> Reset State
          </button>
        </div>
      </div>

      {/* Live Logs Section */}
      <div style={{ flex: 1 }}>
        <div style={{
          background: '#0a0a0a',
          color: '#00ff00',
          fontFamily: 'monospace',
          padding: '20px',
          borderRadius: '8px',
          height: '400px',
          overflowY: 'auto',
          boxShadow: 'var(--card-shadow)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#fff' }}>
            <Terminal size={20} />
            <h3 style={{ margin: 0 }}>Backend Event Stream</h3>
          </div>
          
          {events.length === 0 ? (
            <p style={{ color: '#888' }}>Waiting for signals...</p>
          ) : (
            events.map((ev, idx) => (
              <div key={idx} style={{ marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                <span style={{ color: '#888', fontSize: '0.8rem' }}>
                  {new Date(ev.timestamp).toLocaleTimeString()}
                </span>
                <span style={{ color: '#ffb86c', marginLeft: '10px' }}>[{ev.type}]</span>
                <p style={{ margin: '5px 0 0 0' }}>{ev.message}</p>
                {ev.data && (
                  <pre style={{ fontSize: '0.75rem', color: '#8be9fd', marginTop: '5px' }}>
                    {JSON.stringify(ev.data, null, 2)}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
    </div>
  );
}
