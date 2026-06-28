import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Check, 
  Briefcase, 
  GraduationCap, 
  Smartphone, 
  Wifi, 
  Battery, 
  Signal, 
  Bell, 
  CheckCircle2, 
  CreditCard, 
  Send, 
  ShieldCheck, 
  BookOpen, 
  Clock,
  RotateCcw
} from 'lucide-react';

// Custom CSS Confetti Component
function ConfettiEffect() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ['#1a56db', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'];
    const newParticles = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage width
      y: -10 - Math.random() * 20, // offset top
      size: Math.random() * 8 + 6, // pixel size
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 3, // animation delay seconds
      duration: Math.random() * 2 + 2, // animation duration seconds
      rotation: Math.random() * 360,
      shape: Math.random() > 0.5 ? 'circle' : 'square'
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute opacity-85"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            transform: `rotate(${p.rotation}deg)`,
            animationName: 'fall',
            animationDuration: `${p.duration}s`,
            animationTimingFunction: 'linear',
            animationDelay: `${p.delay}s`,
            animationIterationCount: 'infinite'
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0vh) rotate(0deg);
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
          }
        }
      `}</style>
    </div>
  );
}

export default function Demo({ dbState, fetchState }) {
  const [step, setStep] = useState(1);
  const [scenario, setScenario] = useState(null); // 'migrant_worker' or 'student'
  const [isLoadingScenario, setIsLoadingScenario] = useState(false);
  const [scenarioResult, setScenarioResult] = useState(null);
  
  // Form States
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [debugOtp, setDebugOtp] = useState('');
  const [reactivationSuccess, setReactivationSuccess] = useState(false);
  
  // Remittance Form States
  const [beneficiaryName, setBeneficiaryName] = useState('Sunita Devi (Wife)');
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('30291048182');
  const [remitAmount, setRemitAmount] = useState('15000');
  const [remitFrequency, setRemitFrequency] = useState('monthly');
  const [remittanceSuccess, setRemittanceSuccess] = useState(false);

  // Student Account Form States
  const [studentName, setStudentName] = useState('Priya Sharma');
  const [studentAadhaar, setStudentAadhaar] = useState('234567890123');
  const [studentLang, setStudentLang] = useState('English');
  const [studentDeposit, setStudentDeposit] = useState('1000');
  const [studentAccountSuccess, setStudentAccountSuccess] = useState(false);

  const [apiError, setApiError] = useState(null);

  // Auto-fill forms when scenario changes
  useEffect(() => {
    if (scenario === 'migrant_worker') {
      setAadhaar('1234 5678 9012');
      setBeneficiaryName('Sunita Devi (Wife)');
      setBeneficiaryAccount('30291048182');
      setRemitAmount('15000');
      setRemitFrequency('monthly');
    } else if (scenario === 'student') {
      setStudentName('Priya Sharma');
      setStudentAadhaar('234567890123');
      setStudentLang('English');
      setStudentDeposit('1000');
    }
  }, [scenario]);

  // Find notification from state
  const currentNotification = dbState?.notifications?.find(n => {
    if (scenario === 'migrant_worker') return n.userId === 'user_ramesh';
    if (scenario === 'student') return n.userId === 'user_priya';
    return false;
  });

  const handleSelectScenario = async (selected) => {
    setIsLoadingScenario(true);
    setApiError(null);
    try {
      const response = await axios.post('/api/demo/trigger-scenario', { scenario: selected });
      setScenario(selected);
      setScenarioResult(response.data);
      
      // Refresh DB state to fetch new notification/signals
      await fetchState();
      
      // Move to Step 2
      setStep(2);
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.error || 'Failed to trigger scenario');
    } finally {
      setIsLoadingScenario(false);
    }
  };

  const handleSendOtp = async () => {
    setApiError(null);
    try {
      const phone = scenarioResult.phone;
      const formattedAadhaar = aadhaar.replace(/\s/g, '');
      const response = await axios.post('/api/accounts/reactivate/initiate', {
        phone,
        aadhaar: formattedAadhaar
      });
      if (response.data.success) {
        setOtpSent(true);
        setDebugOtp(response.data.debugOtp);
        await fetchState();
      }
    } catch (err) {
      setApiError(err.response?.data?.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    setApiError(null);
    try {
      const phone = scenarioResult.phone;
      const response = await axios.post('/api/accounts/reactivate/verify', {
        phone,
        otp
      });
      if (response.data.success) {
        setReactivationSuccess(true);
        await fetchState();
      }
    } catch (err) {
      setApiError(err.response?.data?.error || 'Invalid OTP. Please check the SSE log.');
    }
  };

  const handleSetupRemittance = async (e) => {
    e.preventDefault();
    setApiError(null);
    try {
      const phone = scenarioResult.phone;
      await axios.post('/api/accounts/remittance', {
        phone,
        beneficiaryName,
        beneficiaryAccount,
        amount: parseFloat(remitAmount),
        frequency: remitFrequency
      });
      setRemittanceSuccess(true);
      await fetchState();
      
      // Move to success step
      setStep(4);
    } catch (err) {
      setApiError(err.response?.data?.error || 'Failed to schedule remittance');
    }
  };

  const handleOpenStudentAccount = async (e) => {
    e.preventDefault();
    setApiError(null);
    try {
      const phone = scenarioResult.phone;
      await axios.post('/api/accounts/open', {
        phone,
        name: studentName,
        aadhaar: studentAadhaar,
        preferredLanguage: studentLang,
        initialDeposit: parseFloat(studentDeposit),
        currentCity: scenarioResult.destinationCity,
        segment: 'student'
      });
      setStudentAccountSuccess(true);
      await fetchState();
      
      // Move to success step
      setStep(4);
    } catch (err) {
      setApiError(err.response?.data?.error || 'Failed to open digital account');
    }
  };

  const handleResetDemo = async () => {
    try {
      await axios.post('/api/demo/reset');
      await fetchState();
      
      // Reset wizard state
      setStep(1);
      setScenario(null);
      setScenarioResult(null);
      setAadhaar('');
      setOtp('');
      setOtpSent(false);
      setDebugOtp('');
      setReactivationSuccess(false);
      setRemittanceSuccess(false);
      setStudentAccountSuccess(false);
      setApiError(null);
    } catch (err) {
      console.error('Reset failed', err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Step Indicators */}
      <div className="mb-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-5 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Guided Demo Flow
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Walk through the relocation onboarding triggers step-by-step.
            </p>
          </div>
          <button
            onClick={handleResetDemo}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750 dark:hover:text-white cursor-pointer transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restart Journey
          </button>
        </div>

        {/* Visual Wizard Progress Header */}
        <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-sm font-semibold">
          {[
            { s: 1, label: 'Choose Scenario' },
            { s: 2, label: 'Signal & Notification' },
            { s: 3, label: 'Onboarding Flow' },
            { s: 4, label: 'Success Summary' }
          ].map((item) => (
            <div key={item.s} className="flex-1 flex items-center gap-2">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold border transition-colors ${
                step === item.s 
                  ? 'border-sbi-blue bg-sbi-blue text-white'
                  : step > item.s
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-slate-250 text-slate-400 dark:border-slate-800'
              }`}>
                {step > item.s ? <Check className="h-3 w-3" /> : item.s}
              </span>
              <span className={`text-xs ${step === item.s ? 'text-sbi-blue dark:text-blue-400 font-bold' : step > item.s ? 'text-emerald-600 dark:text-emerald-450' : 'text-slate-450'}`}>
                {item.label}
              </span>
              {item.s < 4 && <div className="hidden md:block flex-1 h-px bg-slate-200 dark:bg-slate-800 mx-2" />}
            </div>
          ))}
        </div>
      </div>

      {apiError && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-905/30 dark:bg-rose-950/10 dark:text-rose-400">
          <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* STEP 1: Scenario Selector */}
      {step === 1 && (
        <div className="mx-auto max-w-4xl space-y-6 py-6">
          <div className="text-center">
            <h2 className="text-lg font-bold text-slate-905 dark:text-white">Trigger relocation scenario</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select a pre-seeded target customer profile and simulate their physical relocation event.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Card 1: Migrant Worker */}
            <button
              onClick={() => handleSelectScenario('migrant_worker')}
              disabled={isLoadingScenario}
              className="flex flex-col items-start text-left rounded-lg border border-slate-200 hover:border-sbi-blue bg-white p-6 shadow-2xs hover:shadow-md cursor-pointer transition-all dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500 group"
            >
              <div className="rounded-lg bg-blue-50 p-3.5 text-sbi-blue dark:bg-blue-900/30 dark:text-blue-400 transition-colors">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white group-hover:text-sbi-blue dark:group-hover:text-blue-400">
                Migrant Worker Journey
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-405 leading-relaxed">
                Ramesh Kumar relocates from <strong>Patna ➡️ Bengaluru</strong>. An <strong>ATM withdrawal</strong> signal triggers relocation. 
                His account status is <strong>dormant</strong>, requiring Aadhaar SMS reactivation and automatic remittance setups.
              </p>
            </button>

            {/* Card 2: Student */}
            <button
              onClick={() => handleSelectScenario('student')}
              disabled={isLoadingScenario}
              className="flex flex-col items-start text-left rounded-lg border border-slate-200 hover:border-sbi-blue bg-white p-6 shadow-2xs hover:shadow-md cursor-pointer transition-all dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500 group"
            >
              <div className="rounded-lg bg-purple-50 p-3.5 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 transition-colors">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white group-hover:text-sbi-blue dark:group-hover:text-blue-400">
                Student Relocation Onboarding
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-405 leading-relaxed">
                Priya Sharma relocates from <strong>Ranchi ➡️ Pune</strong> for college. A <strong>SIM card roaming</strong> signal triggers location changes. 
                She has <strong>no existing account</strong>, prompting YONO to guide her in opening a digital Insta Savings Account.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* PHONE SIMULATOR FOR STEPS 2, 3, 4 */}
      {step > 1 && (
        <div className="flex justify-center py-4">
          <div className="relative w-full max-w-[370px] rounded-[40px] border-[10px] border-slate-950 bg-slate-900 shadow-2xl overflow-hidden aspect-[9/18.5] flex flex-col">
            {/* Phone Speaker Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-40 flex items-center justify-center">
              <span className="w-10 h-1 bg-slate-800 rounded-full mb-2.5" />
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between px-6 pt-6 pb-2 text-2xs font-bold text-slate-400 select-none z-30">
              <span className="font-mono">12:45 PM</span>
              <div className="flex items-center gap-1 text-slate-450">
                <Signal className="h-3 w-3" />
                <Wifi className="h-3 w-3" />
                <Battery className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Interactive screen contents */}
            <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-5 overflow-y-auto text-slate-900 dark:text-slate-100 relative flex flex-col">
              
              {/* STEP 2: SIGNAL DETECTED & PUSH BANNER */}
              {step === 2 && (
                <div className="flex flex-col h-full justify-between py-2">
                  <div className="space-y-6">
                    {/* Simulated Lockscreen Notification Banner */}
                    <div className="rounded-xl border border-slate-200 bg-white/95 p-3.5 shadow-md dark:border-slate-800 dark:bg-slate-900/95 theme-transition">
                      <div className="flex items-center justify-between text-2xs font-semibold text-slate-500 mb-2">
                        <span className="flex items-center gap-1 text-sbi-blue dark:text-blue-400">
                          <Bell className="h-3 w-3" />
                          SBI YONO
                        </span>
                        <span>now</span>
                      </div>
                      
                      {currentNotification ? (
                        <>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {currentNotification.title}
                          </h4>
                          <p className="mt-1 text-2xs text-slate-655 dark:text-slate-350 leading-relaxed font-medium">
                            {currentNotification.message}
                          </p>
                        </>
                      ) : (
                        <div className="animate-pulse py-2 space-y-1.5">
                          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                          <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                          <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                        </div>
                      )}
                    </div>

                    <div className="rounded-lg border border-slate-150 bg-white p-4 dark:border-slate-850 dark:bg-slate-900 text-xs">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1">
                        <Smartphone className="h-3.5 w-3.5 text-sbi-blue dark:text-blue-400" />
                        Relocation Logged
                      </h4>
                      <div className="space-y-1.5 font-medium text-slate-600 dark:text-slate-350">
                        <div>Customer: <span className="font-bold text-slate-900 dark:text-white">{scenarioResult?.user}</span></div>
                        <div>Signal: <span className="uppercase font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded text-3xs">{scenarioResult?.source}</span></div>
                        <div>New Location: <span className="font-bold text-sbi-blue dark:text-blue-400">{scenarioResult?.destinationCity}</span></div>
                        <div>Required Action: <span className="text-amber-600 dark:text-amber-450">{scenarioResult?.actionRequired}</span></div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(3)}
                    className="w-full inline-flex justify-center items-center rounded bg-sbi-blue hover:bg-sbi-blue-hover text-white py-2 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                  >
                    Open YONO App
                  </button>
                </div>
              )}

              {/* STEP 3: INTERACTIVE FORMS */}
              {step === 3 && (
                <div className="flex-1 flex flex-col justify-between h-full py-2">
                  
                  {/* Scenario 1: Migrant Worker (Reactivate Account + Remittance) */}
                  {scenario === 'migrant_worker' && (
                    <div className="flex-1 flex flex-col justify-between">
                      {/* Sub-step 1: Aadhaar Reactivation Form */}
                      {!reactivationSuccess ? (
                        <div className="space-y-4">
                          <div>
                            <div className="text-3xs font-bold text-sbi-blue dark:text-blue-400 uppercase tracking-wider">Step 1 of 2: KYC Reactivation</div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Reactivate Savings Account</h3>
                            <p className="text-3xs text-slate-500 leading-normal mt-0.5">Your account is currently dormant. Verify using Aadhaar to enable full banking services.</p>
                          </div>

                          <div className="space-y-3 text-xs">
                            <div>
                              <label className="block text-3xs font-semibold text-slate-500 mb-0.5">Registered Mobile</label>
                              <input
                                type="text"
                                value={scenarioResult?.phone || ''}
                                readOnly
                                className="w-full rounded border border-slate-200 bg-slate-100 px-2 py-1.5 font-mono text-slate-505 dark:border-slate-800 dark:bg-slate-900"
                              />
                            </div>

                            <div>
                              <label className="block text-3xs font-semibold text-slate-500 mb-0.5">Aadhaar Number</label>
                              <input
                                type="text"
                                value={aadhaar}
                                onChange={(e) => setAadhaar(e.target.value)}
                                className="w-full rounded border border-slate-250 bg-white px-2 py-1.5 font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-sbi-blue dark:focus:border-blue-400"
                                placeholder="1234 5678 9012"
                              />
                            </div>

                            {otpSent && (
                              <div className="space-y-1.5 animate-fadeIn">
                                <label className="block text-3xs font-bold text-slate-500">6-Digit SMS Verification OTP</label>
                                <input
                                  type="text"
                                  value={otp}
                                  onChange={(e) => setOtp(e.target.value)}
                                  className="w-full rounded border border-slate-250 bg-white px-2 py-1.5 font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none text-center tracking-widest text-sm focus:border-sbi-blue dark:focus:border-blue-400"
                                  placeholder="------"
                                  maxLength={6}
                                />
                                <p className="text-3xs font-medium text-slate-500">
                                  Demo verification code: <span className="font-bold text-sbi-blue dark:text-blue-400">{debugOtp}</span> (Check Live Terminal log).
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="pt-2">
                            {otpSent ? (
                              <button
                                onClick={handleVerifyOtp}
                                className="w-full rounded bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                              >
                                Verify & Reactivate
                              </button>
                            ) : (
                              <button
                                onClick={handleSendOtp}
                                className="w-full rounded bg-sbi-blue hover:bg-sbi-blue-hover text-white py-2 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                              >
                                Send Aadhaar OTP
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Sub-step 2: Remittance Setup Form */
                        <form onSubmit={handleSetupRemittance} className="space-y-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-3.5">
                            <div>
                              <div className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-3xs font-bold text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 uppercase tracking-wider">
                                <ShieldCheck className="h-3 w-3" /> Account Active
                              </div>
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">Set Up Automated Remittance</h3>
                              <p className="text-3xs text-slate-500 leading-normal mt-0.5">Schedule a recurring monthly transfer to support your family back in {scenarioResult?.signalResult?.previousCity || 'Patna'}.</p>
                            </div>

                            <div className="space-y-2.5 text-2xs">
                              <div>
                                <label className="block font-semibold text-slate-500 mb-0.5">Beneficiary Name</label>
                                <input
                                  type="text"
                                  value={beneficiaryName}
                                  onChange={(e) => setBeneficiaryName(e.target.value)}
                                  className="w-full rounded border border-slate-250 bg-white px-2 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-sbi-blue dark:focus:border-blue-400"
                                />
                              </div>

                              <div>
                                <label className="block font-semibold text-slate-500 mb-0.5">Beneficiary Account</label>
                                <input
                                  type="text"
                                  value={beneficiaryAccount}
                                  onChange={(e) => setBeneficiaryAccount(e.target.value)}
                                  className="w-full rounded border border-slate-250 bg-white px-2 py-1.5 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-sbi-blue dark:focus:border-blue-400"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block font-semibold text-slate-500 mb-0.5">Monthly Sum (₹)</label>
                                  <input
                                    type="number"
                                    value={remitAmount}
                                    onChange={(e) => setRemitAmount(e.target.value)}
                                    className="w-full rounded border border-slate-250 bg-white px-2 py-1.5 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-sbi-blue dark:focus:border-blue-400"
                                  />
                                </div>
                                <div>
                                  <label className="block font-semibold text-slate-500 mb-0.5">Recurrence</label>
                                  <select
                                    value={remitFrequency}
                                    onChange={(e) => setRemitFrequency(e.target.value)}
                                    className="w-full rounded border border-slate-250 bg-white px-2 py-1.5 text-2xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-sbi-blue dark:focus:border-blue-400"
                                  >
                                    <option value="monthly">Monthly (1st)</option>
                                    <option value="weekly">Weekly</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full rounded bg-sbi-blue hover:bg-sbi-blue-hover text-white py-2 text-xs font-semibold shadow-sm transition-colors mt-4 cursor-pointer"
                          >
                            Schedule Transfer
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* Scenario 2: Student Account Opening Form */}
                  {scenario === 'student' && (
                    <form onSubmit={handleOpenStudentAccount} className="space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div>
                          <div className="text-3xs font-bold text-sbi-blue dark:text-blue-400 uppercase tracking-wider">InstaOn Account Opening</div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 font-sans">Open Student Account</h3>
                          <p className="text-3xs text-slate-505 leading-normal mt-0.5">Open a paperless digital-first savings account instant in your new location {scenarioResult?.destinationCity}.</p>
                        </div>

                        <div className="space-y-2.5 text-2xs">
                          <div>
                            <label className="block font-semibold text-slate-505 mb-0.5">Full Name</label>
                            <input
                              type="text"
                              value={studentName}
                              onChange={(e) => setStudentName(e.target.value)}
                              className="w-full rounded border border-slate-250 bg-white px-2 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-505 mb-0.5">Aadhaar Number</label>
                            <input
                              type="text"
                              value={studentAadhaar}
                              onChange={(e) => setStudentAadhaar(e.target.value)}
                              className="w-full rounded border border-slate-250 bg-white px-2 py-1.5 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block font-semibold text-slate-505 mb-0.5">Preferred Language</label>
                              <select
                                value={studentLang}
                                onChange={(e) => setStudentLang(e.target.value)}
                                className="w-full rounded border border-slate-250 bg-white px-2 py-1.5 text-3xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none"
                              >
                                <option value="English">English</option>
                                <option value="Hindi">Hindi (हिंदी)</option>
                                <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block font-semibold text-slate-505 mb-0.5">Deposit (₹)</label>
                              <input
                                type="number"
                                value={studentDeposit}
                                onChange={(e) => setStudentDeposit(e.target.value)}
                                className="w-full rounded border border-slate-250 bg-white px-2 py-1.5 text-xs font-bold text-slate-905 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded bg-sbi-blue hover:bg-sbi-blue-hover text-white py-2 text-xs font-semibold shadow-sm transition-colors mt-4 cursor-pointer"
                      >
                        Open Digital Account
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* STEP 4: SUCCESS SUMMARY */}
              {step === 4 && (
                <div className="flex-1 flex flex-col justify-between h-full py-2 relative">
                  {/* Custom Confetti Animation inside phone screen */}
                  <ConfettiEffect />

                  <div className="text-center space-y-4 pt-4 z-20">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Journey Completed!</h3>
                      <p className="text-3xs text-slate-500 mt-1">Your location onboarding has been completed successfully.</p>
                    </div>

                    {/* Show active features inside YONO card */}
                    <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-850 dark:bg-slate-900 text-left space-y-3">
                      {/* Virtual Debit Card */}
                      <div className="flex items-start gap-2.5 text-2xs">
                        <CreditCard className="h-4.5 w-4.5 text-sbi-blue dark:text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">Virtual YONO Card Active</h4>
                          <p className="text-slate-505 dark:text-slate-400 mt-0.5 font-medium leading-normal">Ready for online e-commerce transactions & UPI integrations instantly.</p>
                        </div>
                      </div>

                      {/* Remittance Detail (Migrant Worker) */}
                      {scenario === 'migrant_worker' && (
                        <div className="flex items-start gap-2.5 text-2xs border-t border-slate-100 pt-2.5 dark:border-slate-800">
                          <Send className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Remittance Schedule Configured</h4>
                            <p className="text-slate-505 dark:text-slate-400 mt-0.5 font-medium leading-normal">₹15,000 scheduled monthly transfer established to Sunita Devi.</p>
                          </div>
                        </div>
                      )}

                      {/* Pre-approved Student Loan (Student) */}
                      {scenario === 'student' && (
                        <div className="flex items-start gap-2.5 text-2xs border-t border-slate-100 pt-2.5 dark:border-slate-800">
                          <BookOpen className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Pre-Approved Student Loan</h4>
                            <p className="text-slate-505 dark:text-slate-400 mt-0.5 font-medium leading-normal">Eligible for up to ₹4 Lakhs instant college fees financing.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleResetDemo}
                    className="w-full inline-flex justify-center items-center rounded bg-slate-900 hover:bg-black text-white py-2 text-xs font-semibold shadow-sm transition-colors z-20 cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-700"
                  >
                    Finish & Reset Demo
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
