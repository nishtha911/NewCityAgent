import React, { useState, Component } from 'react';
import { triggerScenario, reactivateAccount, resetState } from '../services/api';
import { Briefcase, GraduationCap, CheckCircle, ArrowRight, AlertTriangle, RotateCcw } from 'lucide-react';

// Error Boundary to catch render crashes and show a useful message instead of white screen
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('[DemoPage crash]', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-primary)' }}>
          <AlertTriangle size={48} color="#f59e0b" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ color: 'var(--secondary-magenta)', marginBottom: '10px' }}>Something crashed</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>{String(this.state.error)}</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.85rem' }}>
            This usually means the backend state is stale. Click Reset to clear it, then try again.
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); }}
            style={{ background: 'var(--secondary-magenta)', color: 'white', padding: '10px 24px', borderRadius: '4px', fontWeight: 'bold' }}
          >
            Dismiss Error
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function DemoPageInner() {
  const [step, setStep] = useState(1);
  const [scenario, setScenario] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);

  const handleSelectScenario = async (scen) => {
    setError(null);
    setLoading(true);
    setScenario(scen);
    try {
      const res = await triggerScenario(scen);
      console.log('[DemoPage] trigger-scenario response:', JSON.stringify(res));
      if (res && res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }
      setResult(res);
      setStep(2);
    } catch (e) {
      console.error('[DemoPage] trigger-scenario error:', e);
      setError('Network error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async () => {
    if (!result) return;
    setError(null);
    setLoading(true);
    try {
      const phone = result.phone || '9876543210';
      const res = await reactivateAccount(phone, otp);
      console.log('[DemoPage] reactivate response:', JSON.stringify(res));
      setStep(4);
    } catch (e) {
      console.error('[DemoPage] reactivate error:', e);
      setError('Reactivation error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setError(null);
    try {
      await resetState();
    } catch (e) {
      console.error('[DemoPage] reset error:', e);
    }
    setStep(1);
    setScenario(null);
    setResult(null);
    setOtp('');
  };

  const signalResult = result?.signalResult || {};
  const cityChanged = signalResult.cityChangeDetected === true;
  const prevCity = signalResult.previousCity || '—';
  const newCity = signalResult.newCity || result?.destinationCity || '—';
  const notifMessage = signalResult.notification?.message || '';

  return (
    <div style={{ padding: '40px 80px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Error Banner */}
      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #f87171', borderRadius: '8px', padding: '15px 20px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#b91c1c' }}>{error}</span>
          <button onClick={() => setError(null)} style={{ background: 'transparent', color: '#b91c1c', fontSize: '1.2rem', fontWeight: 'bold' }}>×</button>
        </div>
      )}

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
          <h2 style={{ textAlign: 'center', marginBottom: '10px', color: 'var(--primary-purple)' }}>Select a Demo Scenario</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '30px' }}>
            Make sure you click <strong>Reset State</strong> on the Dashboard before running a fresh demo.
          </p>
          <div style={{ display: 'flex', gap: '30px' }}>

            {/* Migrant Worker Card */}
            <div
              style={{
                flex: 1, padding: '30px', borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                border: scenario === 'migrant_worker' ? '2px solid var(--primary-purple)' : '2px solid transparent',
                background: 'var(--bg-secondary)', boxShadow: 'var(--card-shadow)',
                textAlign: 'center', opacity: (loading && scenario !== 'migrant_worker') ? 0.5 : 1,
                transition: 'border 0.2s'
              }}
              onClick={() => !loading && handleSelectScenario('migrant_worker')}
            >
              <Briefcase size={48} color="var(--primary-purple)" style={{ display: 'block', margin: '0 auto 15px' }} />
              <h3 style={{ color: 'var(--text-primary)' }}>Migrant Worker</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Ramesh Kumar · Dormant Account</p>
              <div style={{ marginTop: '15px', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
                <span>Patna</span> <ArrowRight size={14} /> <span>Bengaluru</span>
              </div>
              <div style={{ marginTop: '15px', padding: '5px 10px', background: '#3e1b7015', color: 'var(--primary-purple)', borderRadius: '4px', display: 'inline-block', fontSize: '0.85rem', fontWeight: 'bold' }}>
                ATM Geolocation Signal
              </div>
              {loading && scenario === 'migrant_worker' && (
                <p style={{ marginTop: '15px', color: 'var(--highlight-cyan)' }}>Running LLM Agent...</p>
              )}
            </div>

            {/* Student Card */}
            <div
              style={{
                flex: 1, padding: '30px', borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                border: scenario === 'student' ? '2px solid var(--secondary-magenta)' : '2px solid transparent',
                background: 'var(--bg-secondary)', boxShadow: 'var(--card-shadow)',
                textAlign: 'center', opacity: (loading && scenario !== 'student') ? 0.5 : 1,
                transition: 'border 0.2s'
              }}
              onClick={() => !loading && handleSelectScenario('student')}
            >
              <GraduationCap size={48} color="var(--secondary-magenta)" style={{ display: 'block', margin: '0 auto 15px' }} />
              <h3 style={{ color: 'var(--text-primary)' }}>Student</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Priya Sharma · No Account</p>
              <div style={{ marginTop: '15px', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
                <span>Ranchi</span> <ArrowRight size={14} /> <span>Pune</span>
              </div>
              <div style={{ marginTop: '15px', padding: '5px 10px', background: '#b0185e15', color: 'var(--secondary-magenta)', borderRadius: '4px', display: 'inline-block', fontSize: '0.85rem', fontWeight: 'bold' }}>
                SIM Roaming Signal
              </div>
              {loading && scenario === 'student' && (
                <p style={{ marginTop: '15px', color: 'var(--highlight-cyan)' }}>Running LLM Agent...</p>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              onClick={handleReset}
              style={{ background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RotateCcw size={14} /> Reset Backend State
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Signal Detected */}
      {step === 2 && (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px', color: 'var(--primary-purple)' }}>Agent Signal Processing</h2>

          {!cityChanged ? (
            <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', padding: '25px', maxWidth: '500px', margin: '0 auto' }}>
              <AlertTriangle size={32} color="#f59e0b" style={{ display: 'block', margin: '0 auto 10px' }} />
              <p style={{ color: '#92400e', marginBottom: '15px' }}>
                No city change was detected — the user was already recorded in that city from a previous run.
                Reset the backend state and try the demo again.
              </p>
              <button
                onClick={handleReset}
                style={{ background: 'var(--secondary-magenta)', color: 'white', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <RotateCcw size={14} /> Reset & Try Again
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <div style={{ padding: '15px 30px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--card-border)', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {prevCity}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--secondary-magenta)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px' }}>{result?.source || 'SIGNAL'}</span>
                  <ArrowRight size={24} />
                </div>
                <div style={{ padding: '15px 30px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '2px solid var(--highlight-cyan)', fontWeight: 'bold', color: 'var(--highlight-cyan)' }}>
                  {newCity}
                </div>
              </div>

              {notifMessage && (
                <div style={{ background: 'var(--gradient-banner)', color: 'white', padding: '25px', borderRadius: '8px', maxWidth: '640px', margin: '0 auto', textAlign: 'left' }}>
                  <h4 style={{ marginBottom: '10px', opacity: 0.9, color: 'white' }}>AI-Generated Hyper-Personalized Outreach:</h4>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'white' }}>"{notifMessage}"</p>
                </div>
              )}

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
      {step === 3 && (
        <div>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-purple)' }}>Customer Onboarding</h2>

          <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '8px', border: '1px solid var(--card-border)', maxWidth: '500px', margin: '0 auto' }}>
            {scenario === 'migrant_worker' ? (
              <>
                <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Reactivate Dormant Account</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Customer clicked the notification link to reactivate their account via Aadhaar OTP.</p>
                <input
                  type="text"
                  placeholder="Enter Aadhaar OTP (e.g. 123456)"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid var(--card-border)', borderRadius: '4px', marginBottom: '15px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                />
                <button
                  onClick={handleReactivate}
                  disabled={loading}
                  style={{ width: '100%', background: 'var(--gradient-btn)', color: 'white', padding: '12px', borderRadius: '4px', fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Verifying OTP...' : 'Verify OTP & Reactivate Account'}
                </button>
              </>
            ) : (
              <>
                <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Open Insta Savings Account</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Customer clicked the notification link to open a new digital account in {newCity}.
                </p>
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
        <div style={{ textAlign: 'center' }}>
          <CheckCircle size={64} color="#4ade80" style={{ display: 'block', margin: '0 auto 20px' }} />
          <h2 style={{ marginBottom: '10px', color: 'var(--primary-purple)' }}>Journey Complete!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
            {scenario === 'migrant_worker'
              ? 'Ramesh successfully reactivated his account in Bengaluru and set up a remittance home.'
              : 'Priya successfully opened her new digital Insta Savings Account in Pune.'}
          </p>
          <button
            onClick={handleReset}
            style={{ background: 'transparent', border: '2px solid var(--card-border)', color: 'var(--text-primary)', padding: '10px 24px', borderRadius: '4px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={14} /> Reset Demo & Run Again
          </button>
        </div>
      )}

    </div>
  );
}

export default function DemoPage() {
  return (
    <ErrorBoundary>
      <DemoPageInner />
    </ErrorBoundary>
  );
}
