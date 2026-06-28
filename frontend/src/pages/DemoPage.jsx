import React, { useState } from 'react';
import { triggerScenario, getState, reactivateAccount, resetState } from '../services/api';
import { Briefcase, GraduationCap, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

export default function DemoPage() {
  const [step, setStep] = useState(1);
  const [scenario, setScenario] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSelectScenario = async (scen) => {
    setLoading(true);
    setScenario(scen);
    try {
      const res = await triggerScenario(scen);
      setResult(res);
      setStep(2);
    } catch (e) {
      alert('Error triggering scenario');
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async () => {
    if (!result) return;
    setLoading(true);
    try {
      await reactivateAccount(result.phone, otp);
      setStep(4);
    } catch(e) {
      alert('Error reactivating account');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    await resetState();
    setStep(1);
    setScenario(null);
    setResult(null);
    setOtp('');
  };

  return (
    <div style={{ padding: '40px 80px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Step Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '15px', left: '0', right: '0', height: '2px', background: 'var(--card-border)', zIndex: 0 }} />
        {[1, 2, 3, 4].map(num => (
          <div key={num} style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: step >= num ? 'var(--primary-purple)' : 'var(--bg-secondary)',
            color: step >= num ? 'white' : 'var(--text-secondary)',
            border: step >= num ? 'none' : '2px solid var(--card-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', zIndex: 1,
            boxShadow: step === num ? '0 0 0 4px rgba(62,27,112,0.2)' : 'none'
          }}>
            {num}
          </div>
        ))}
      </div>

      {/* Step 1: Choose Scenario */}
      {step === 1 && (
        <div>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-purple)' }}>Select a Demo Scenario</h2>
          <div style={{ display: 'flex', gap: '30px' }}>
            {/* Migrant Worker Card */}
            <div 
              style={{
                flex: 1, padding: '30px', borderRadius: '8px', cursor: 'pointer',
                border: '2px solid transparent',
                background: 'var(--bg-secondary)', boxShadow: 'var(--card-shadow)',
                transition: 'transform 0.2s',
                textAlign: 'center'
              }}
              onClick={() => handleSelectScenario('migrant_worker')}
            >
              <Briefcase size={48} color="var(--primary-purple)" style={{ margin: '0 auto 15px' }} />
              <h3>Migrant Worker</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Ramesh Kumar (Dormant Account)</p>
              <div style={{ marginTop: '15px', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <span>Patna</span> <ArrowRight size={14} /> <span>Bengaluru</span>
              </div>
              <div style={{ marginTop: '15px', padding: '5px 10px', background: '#3e1b7015', color: 'var(--primary-purple)', borderRadius: '4px', display: 'inline-block', fontSize: '0.85rem', fontWeight: 'bold' }}>
                Trigger: ATM Geolocation
              </div>
              {loading && scenario === 'migrant_worker' && <p style={{ marginTop: '15px', color: 'var(--highlight-cyan)' }}>Running LLM Agent...</p>}
            </div>

            {/* Student Card */}
            <div 
              style={{
                flex: 1, padding: '30px', borderRadius: '8px', cursor: 'pointer',
                border: '2px solid transparent',
                background: 'var(--bg-secondary)', boxShadow: 'var(--card-shadow)',
                transition: 'transform 0.2s',
                textAlign: 'center'
              }}
              onClick={() => handleSelectScenario('student')}
            >
              <GraduationCap size={48} color="var(--secondary-magenta)" style={{ margin: '0 auto 15px' }} />
              <h3>Student</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Priya Sharma (No Account)</p>
              <div style={{ marginTop: '15px', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <span>Ranchi</span> <ArrowRight size={14} /> <span>Pune</span>
              </div>
              <div style={{ marginTop: '15px', padding: '5px 10px', background: '#b0185e15', color: 'var(--secondary-magenta)', borderRadius: '4px', display: 'inline-block', fontSize: '0.85rem', fontWeight: 'bold' }}>
                Trigger: SIM Roaming
              </div>
              {loading && scenario === 'student' && <p style={{ marginTop: '15px', color: 'var(--highlight-cyan)' }}>Running LLM Agent...</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Signal Detected */}
      {step === 2 && result && (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px', color: 'var(--primary-purple)' }}>Agent Signal Processing</h2>
          
          {!result.signalResult?.cityChangeDetected ? (
            <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
              <p style={{ color: '#856404' }}>No city change detected for this user. The signal was processed but no outreach was triggered because the user was already in that city. Try resetting the demo and running it again.</p>
              <button onClick={() => { handleReset(); }} style={{ marginTop: '15px', background: 'var(--secondary-magenta)', color: 'white', padding: '10px 20px', borderRadius: '4px' }}>
                Reset & Try Again
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <div style={{ padding: '15px 30px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--card-border)', fontWeight: 'bold' }}>
                  {result.signalResult.previousCity}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--secondary-magenta)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px' }}>{result.source} SIGNAL</span>
                  <ArrowRight size={24} />
                </div>
                <div style={{ padding: '15px 30px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '2px solid var(--highlight-cyan)', fontWeight: 'bold', color: 'var(--highlight-cyan)' }}>
                  {result.signalResult.newCity}
                </div>
              </div>

              <div style={{ background: 'var(--gradient-banner)', color: 'white', padding: '20px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
                <h4 style={{ marginBottom: '10px', opacity: 0.9 }}>Generated Hyper-Personalized Outreach:</h4>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>"{result.signalResult.notification?.message}"</p>
              </div>

              <button 
                onClick={() => setStep(3)}
                style={{ marginTop: '30px', background: 'var(--primary-purple)', color: 'white', padding: '12px 30px', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold' }}
              >
                Proceed to Onboarding Flow
              </button>
            </>
          )}
        </div>
      )}

      {/* Step 3: Onboarding */}
      {step === 3 && result && (
        <div>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-purple)' }}>Customer Onboarding</h2>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '8px', border: '1px solid var(--card-border)', maxWidth: '500px', margin: '0 auto' }}>
            {scenario === 'migrant_worker' ? (
              <>
                <h3 style={{ marginBottom: '20px' }}>Reactivate Dormant Account</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Customer clicked the notification link to reactivate their account via Aadhaar OTP.</p>
                <input 
                  type="text" placeholder="Enter Aadhaar OTP (e.g. 123456)" 
                  value={otp} onChange={e => setOtp(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid var(--card-border)', borderRadius: '4px', marginBottom: '15px' }}
                />
                <button 
                  onClick={handleReactivate}
                  disabled={loading}
                  style={{ width: '100%', background: 'var(--gradient-btn)', color: 'white', padding: '12px', borderRadius: '4px', fontWeight: 'bold' }}
                >
                  {loading ? 'Verifying...' : 'Verify OTP & Reactivate'}
                </button>
              </>
            ) : (
              <>
                <h3 style={{ marginBottom: '20px' }}>Open Insta Savings Account</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Customer clicked the notification link to open a new digital account in {result.signalResult.newCity}.</p>
                <button 
                  onClick={() => setStep(4)}
                  style={{ width: '100%', background: 'var(--gradient-btn)', color: 'white', padding: '12px', borderRadius: '4px', fontWeight: 'bold' }}
                >
                  Complete Video KYC & Open Account
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Complete */}
      {step === 4 && (
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
          <CheckCircle size={64} color="#4ade80" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ marginBottom: '10px', color: 'var(--primary-purple)' }}>Journey Complete!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
            {scenario === 'migrant_worker' ? 'Ramesh successfully reactivated his account in Bengaluru.' : 'Priya successfully opened her new digital account in Pune.'}
          </p>
          
          <button 
            onClick={handleReset}
            style={{ background: 'transparent', border: '2px solid var(--card-border)', color: 'var(--text-primary)', padding: '10px 24px', borderRadius: '4px', fontWeight: 'bold' }}
          >
            Reset Demo State
          </button>
        </div>
      )}

    </div>
  );
}
