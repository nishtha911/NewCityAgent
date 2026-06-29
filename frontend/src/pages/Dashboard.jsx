import React from 'react';
import { triggerScenario, resetState } from '../services/api';
import { RefreshCw, Zap } from 'lucide-react';



export default function Dashboard() {

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
    <div style={{ padding: '40px 80px' }}>

      {/* Controls Section */}
      <div style={{ flex: 1, maxWidth: '600px' }}>
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
                gap: '10px',
                cursor: 'pointer'
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
                gap: '10px',
                cursor: 'pointer'
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
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={16} /> Reset State
          </button>
        </div>
      </div>


    </div>
  );
}
