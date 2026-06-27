import { useEffect, useRef, useState } from 'react'
import {
  Briefcase,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  UserPlus,
  Send,
  RefreshCcw,
  PartyPopper,
  ArrowLeft,
  Sparkles,
  Smartphone,
  Bell,
  ChevronRight,
  Wallet,
} from 'lucide-react'
import { useDemo, SCENARIOS } from '../context/DemoContext'
import { useToast } from '../context/ToastContext'
import { AccountsAPI, DemoAPI } from '../services/api'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import StepIndicator from '../components/ui/StepIndicator'
import EventLog from '../components/ui/EventLog'
import { cn } from '../utils/cn'

const STEPS = [
  { title: 'Choose Scenario' },
  { title: 'Signal Detected' },
  { title: 'Onboarding' },
  { title: 'Journey Complete' },
]

// ───────────────────────── Step 1 — Choose Scenario ─────────────────────────
function Step1({ onNext }) {
  const { state, dispatch } = useDemo()
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  const choose = (id) => dispatch({ type: 'SET_SCENARIO', payload: id })

  const trigger = async () => {
    if (!state.selectedScenario) {
      toast.warning('Pick a scenario first')
      return
    }
    setLoading(true)
    try {
      const res = await DemoAPI.triggerScenario(state.selectedScenario)
      dispatch({ type: 'SET_SCENARIO_RESULT', payload: res })
      dispatch({ type: 'SET_STEP', payload: 2 })
      toast.success(
        `${SCENARIOS[state.selectedScenario].fullName} signal ingested`,
      )
    } catch (e) {
      toast.error('Failed: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-xl font-bold">Pick a journey to demo</h3>
        <p className="text-sm text-text-muted mt-2">
          Each scenario simulates a real-world trigger and runs the full
          agentic onboarding pipeline end-to-end.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
        {Object.values(SCENARIOS).map((s) => {
          const Icon = s.icon === 'briefcase' ? Briefcase : GraduationCap
          const selected = state.selectedScenario === s.id
          return (
            <button
              key={s.id}
              onClick={() => choose(s.id)}
              className={cn(
                'text-left rounded-xl border-2 p-6 transition-all bg-surface',
                selected
                  ? 'border-primary shadow-md ring-2 ring-primary/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'h-11 w-11 rounded-lg flex items-center justify-center',
                    selected
                      ? 'bg-primary text-white'
                      : 'bg-surface-2 text-text-muted',
                  )}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-text-muted">
                    {s.segment}
                  </p>
                  <p className="text-base font-bold">{s.name}</p>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-text">{s.fullName}</p>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-text-muted">Journey</dt>
                  <dd className="font-medium flex items-center gap-1 mt-0.5">
                    {s.from} <ArrowRight size={11} /> {s.to}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-muted">Signal</dt>
                  <dd className="font-medium mt-0.5">
                    <Badge tone="blue" size="xs">
                      {s.source}
                    </Badge>
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-text-muted">Action</dt>
                  <dd className="font-medium mt-0.5">
                    {s.id === 'migrant_worker'
                      ? 'Aadhaar Reactivation'
                      : 'New Digital Account'}
                  </dd>
                </div>
              </dl>
            </button>
          )
        })}
      </div>

      <div className="flex justify-center pt-2">
        <Button
          size="xl"
          variant="primary"
          iconRight={ChevronRight}
          loading={loading}
          disabled={!state.selectedScenario}
          onClick={trigger}
        >
          Trigger Scenario
        </Button>
      </div>
    </div>
  )
}

// ───────────────────────── Step 2 — Signal Detected ─────────────────────────
function Step2({ onNext, onBack }) {
  const { state } = useDemo()
  const scenario = SCENARIOS[state.selectedScenario]
  if (!scenario) return null

  const result = state.scenarioResult
  const notification =
    result?.notification ||
    result?.signalResult?.notification ||
    result?.data?.notification ||
    null

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center">
        <Badge tone="orange" size="md">
          <Sparkles size={12} /> City Change Detected
        </Badge>
        <h3 className="text-xl font-bold mt-3">
          Agent identified a relocation signal
        </h3>
        <p className="text-sm text-text-muted mt-1">
          Cross-referencing against the customer's home branch...
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <div className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
              Origin
            </div>
            <p className="text-2xl font-bold mt-1">{scenario.from}</p>
            <p className="text-xs text-text-muted mt-1">Home branch</p>
          </div>

          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="text-xs font-mono text-primary font-bold flex items-center gap-2">
              <Badge tone="blue">{scenario.source}</Badge>
              <ArrowRight className="animate-flow-arrow text-primary" size={20} />
            </div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            <p className="text-[10px] text-text-muted mt-1">signal ingested</p>
          </div>

          <div className="flex-1 text-center">
            <div className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
              Destination
            </div>
            <p className="text-2xl font-bold mt-1 text-primary">
              {scenario.to}
            </p>
            <p className="text-xs text-text-muted mt-1">New city</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface p-5">
          <div className="flex items-center gap-2 mb-3">
            <Bell size={16} className="text-accent" />
            <h4 className="text-sm font-semibold">
              Agent's outbound notification
            </h4>
          </div>
          <div className="rounded-lg bg-surface-2 p-4 text-sm leading-relaxed border border-gray-200 dark:border-gray-700">
            {notification?.message ||
              'Detected a new city activity. Tap to continue your onboarding seamlessly.'}
          </div>
          {notification?.language && (
            <p className="text-[10px] text-text-muted mt-2 uppercase tracking-wider">
              Language: {notification.language}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface p-5">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone size={16} className="text-primary" />
            <h4 className="text-sm font-semibold">Push preview</h4>
          </div>
          <div className="mx-auto max-w-[280px] rounded-2xl border-4 border-gray-800 dark:border-gray-900 bg-gray-900 text-white p-4 shadow-xl">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center text-[10px] font-extrabold">
                SBI
              </div>
              <p className="text-xs font-semibold">SBI YONO</p>
              <p className="text-[10px] text-gray-400 ml-auto">now</p>
            </div>
            <p className="mt-2 text-xs leading-relaxed">
              {notification?.message ||
                'Hi! We noticed you moved to a new city. Tap to reactivate your account.'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" icon={ArrowLeft} onClick={onBack}>
          Back
        </Button>
        <Button size="lg" variant="primary" iconRight={ChevronRight} onClick={onNext}>
          Proceed to Onboarding
        </Button>
      </div>
    </div>
  )
}

// ───────────────────────── Step 3 — Onboarding Flow ─────────────────────────
function Step3({ onNext, onBack }) {
  const { state } = useDemo()
  if (state.selectedScenario === 'migrant_worker') return <MigrantFlow onNext={onNext} onBack={onBack} />
  if (state.selectedScenario === 'student') return <StudentFlow onNext={onNext} onBack={onBack} />
  return null
}

function MigrantFlow({ onNext, onBack }) {
  const { state, dispatch } = useDemo()
  const toast = useToast()
  const scenario = SCENARIOS.migrant_worker
  const [aadhaar, setAadhaar] = useState('4567 8901 2345')
  const [otp, setOtp] = useState('')
  const [remitForm, setRemitForm] = useState({
    beneficiaryName: 'Sunita Devi',
    beneficiaryAccount: '8765432109',
    amount: '5000',
    frequency: 'Monthly',
  })
  const [busy, setBusy] = useState(false)
  const [showOtpInput, setShowOtpInput] = useState(false)

  useEffect(() => {
    let mounted = true
    AccountsAPI.get(scenario.phone)
      .then((data) => {
        if (mounted) dispatch({ type: 'SET_ACCOUNT_STATUS', payload: data })
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [dispatch, scenario.phone])

  const initiate = async () => {
    setBusy(true)
    try {
      const res = await AccountsAPI.reactivateInitiate({
        phone: scenario.phone,
        aadhaar: aadhaar.replace(/\s/g, ''),
      })
      dispatch({ type: 'SET_REACTIVATION_STATUS', payload: 'initiated' })
      dispatch({ type: 'SET_OTP_SENT', payload: true })
      setShowOtpInput(true)
      toast.success(res.message || 'OTP sent to your registered number')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBusy(false)
    }
  }

  const verify = async () => {
    if (!otp) {
      toast.warning('Enter the OTP')
      return
    }
    setBusy(true)
    try {
      const res = await AccountsAPI.reactivateVerify({
        phone: scenario.phone,
        otp,
      })
      dispatch({ type: 'SET_REACTIVATION_STATUS', payload: 'verified' })
      toast.success('Account reactivated!')
      onNext()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBusy(false)
    }
  }

  const submitRemit = async () => {
    setBusy(true)
    try {
      const res = await AccountsAPI.createRemittance({
        phone: scenario.phone,
        ...remitForm,
        amount: Number(remitForm.amount),
      })
      dispatch({ type: 'SET_REMITTANCE', payload: res })
      toast.success('Remittance schedule created')
      onNext()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBusy(false)
    }
  }

  if (state.reactivationStatus === 'verified') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center animate-checkmark">
            <CheckCircle2 className="text-accent" size={28} />
          </div>
          <h3 className="text-xl font-bold mt-3">Account Reactivated!</h3>
          <p className="text-sm text-text-muted mt-1">
            Let's set up a recurring remittance back home.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface p-6 space-y-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Send size={16} className="text-accent" /> Remittance Setup
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Beneficiary Name">
              <input
                value={remitForm.beneficiaryName}
                onChange={(e) =>
                  setRemitForm({ ...remitForm, beneficiaryName: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="Beneficiary Account">
              <input
                value={remitForm.beneficiaryAccount}
                onChange={(e) =>
                  setRemitForm({
                    ...remitForm,
                    beneficiaryAccount: e.target.value,
                  })
                }
                className="input"
              />
            </Field>
            <Field label="Amount (₹)">
              <input
                type="number"
                value={remitForm.amount}
                onChange={(e) =>
                  setRemitForm({ ...remitForm, amount: e.target.value })
                }
                className="input"
              />
            </Field>
            <Field label="Frequency">
              <select
                value={remitForm.frequency}
                onChange={(e) =>
                  setRemitForm({ ...remitForm, frequency: e.target.value })
                }
                className="input"
              >
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Bi-weekly</option>
              </select>
            </Field>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} icon={ArrowLeft}>
            Back
          </Button>
          <Button
            variant="success"
            size="lg"
            iconRight={ChevronRight}
            loading={busy}
            onClick={submitRemit}
          >
            Set Up Remittance
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Wallet size={16} className="text-primary" /> Account Status
          </h4>
          <Badge tone="orange">DORMANT</Badge>
        </div>
        {state.accountStatus ? (
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <dt className="text-[10px] uppercase text-text-muted tracking-wider font-semibold">
                Name
              </dt>
              <dd className="font-medium mt-0.5">
                {state.accountStatus.user?.name || scenario.fullName}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase text-text-muted tracking-wider font-semibold">
                Phone
              </dt>
              <dd className="font-mono text-xs mt-0.5">{scenario.phone}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase text-text-muted tracking-wider font-semibold">
                Last City
              </dt>
              <dd className="font-medium mt-0.5">
                {state.accountStatus.user?.lastCity ||
                  state.accountStatus.lastCity ||
                  'Patna'}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase text-text-muted tracking-wider font-semibold">
                Branch
              </dt>
              <dd className="font-medium mt-0.5">
                {state.accountStatus.branch || 'Patna Main'}
              </dd>
            </div>
          </dl>
        ) : (
          <LoadingSpinner label="Checking account..." />
        )}
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface p-5">
        <h4 className="text-sm font-semibold flex items-center gap-2 mb-4">
          <KeyRound size={16} className="text-violet-600" /> Aadhaar-based
          Reactivation
        </h4>
        <div className="space-y-4">
          <Field label="Aadhaar Number">
            <input
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value)}
              className="input"
              maxLength={14}
            />
          </Field>

          {!showOtpInput ? (
            <Button
              variant="primary"
              size="lg"
              icon={KeyRound}
              loading={busy}
              onClick={initiate}
              className="w-full sm:w-auto"
            >
              Send OTP
            </Button>
          ) : (
            <>
              <Field label="Enter OTP">
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  className="input"
                  inputMode="numeric"
                  maxLength={6}
                />
                <p className="text-[10px] text-text-muted mt-1">
                  Hint: backend may accept any value for demo
                </p>
              </Field>
              <Button
                variant="success"
                size="lg"
                iconRight={ChevronRight}
                loading={busy}
                onClick={verify}
              >
                Verify OTP
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} icon={ArrowLeft}>
          Back
        </Button>
      </div>
    </div>
  )
}

function StudentFlow({ onNext, onBack }) {
  const { state, dispatch } = useDemo()
  const toast = useToast()
  const scenario = SCENARIOS.student
  const [form, setForm] = useState({
    name: scenario.fullName,
    phone: scenario.phone,
    aadhaar: '7890 1234 5678',
    preferredLanguage: 'Hindi',
    initialDeposit: '1000',
    currentCity: scenario.to,
    segment: 'Student',
  })
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let mounted = true
    AccountsAPI.get(scenario.phone)
      .then((data) => {
        if (mounted) dispatch({ type: 'SET_ACCOUNT_STATUS', payload: data })
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [dispatch, scenario.phone])

  const submit = async () => {
    setBusy(true)
    try {
      const res = await AccountsAPI.open({
        ...form,
        aadhaar: form.aadhaar.replace(/\s/g, ''),
        initialDeposit: Number(form.initialDeposit),
      })
      dispatch({ type: 'SET_NEW_ACCOUNT', payload: res })
      toast.success('Account opened!')
      onNext()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBusy(false)
    }
  }

  if (state.newAccountData) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center animate-checkmark">
          <CheckCircle2 className="text-accent" size={32} />
        </div>
        <h3 className="text-2xl font-bold">Account Created!</h3>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface p-6 text-left space-y-2">
          <Row label="Account #" value={state.newAccountData.accountNumber || '—'} mono />
          <Row label="IFSC" value={state.newAccountData.ifsc || 'SBIN0000001'} mono />
          <Row
            label="Holder"
            value={state.newAccountData.user?.name || form.name}
          />
          <Row label="Branch" value={state.newAccountData.branch || `${form.currentCity} Branch`} />
          <Row
            label="Opening Balance"
            value={`₹${Number(form.initialDeposit).toLocaleString('en-IN')}`}
          />
        </div>
        <Button size="lg" variant="primary" iconRight={ChevronRight} onClick={onNext}>
          Finish Demo
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface p-5">
        <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
          <Wallet size={16} className="text-primary" /> Account Status
        </h4>
        <p className="text-sm text-text-muted">
          No existing account on file for{' '}
          <span className="font-mono">{scenario.phone}</span>. Let's open a new
          Insta Savings Account.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface p-5">
        <h4 className="text-sm font-semibold flex items-center gap-2 mb-4">
          <UserPlus size={16} className="text-blue-600" /> Open New Account
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Phone">
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Aadhaar">
            <input
              value={form.aadhaar}
              onChange={(e) => setForm({ ...form, aadhaar: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Preferred Language">
            <select
              value={form.preferredLanguage}
              onChange={(e) =>
                setForm({ ...form, preferredLanguage: e.target.value })
              }
              className="input"
            >
              <option>Hindi</option>
              <option>Marathi</option>
              <option>English</option>
              <option>Tamil</option>
              <option>Bengali</option>
              <option>Telugu</option>
            </select>
          </Field>
          <Field label="Initial Deposit (₹)">
            <input
              type="number"
              value={form.initialDeposit}
              onChange={(e) =>
                setForm({ ...form, initialDeposit: e.target.value })
              }
              className="input"
            />
          </Field>
          <Field label="Current City">
            <input
              value={form.currentCity}
              onChange={(e) => setForm({ ...form, currentCity: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Segment">
            <input value={form.segment} disabled className="input" />
          </Field>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} icon={ArrowLeft}>
            Back
          </Button>
          <Button
            variant="primary"
            size="lg"
            iconRight={ChevronRight}
            loading={busy}
            onClick={submit}
          >
            Open Account
          </Button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider font-semibold text-text-muted">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

function Row({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs uppercase tracking-wider text-text-muted">
        {label}
      </span>
      <span className={mono ? 'font-mono text-sm' : 'text-sm font-medium'}>
        {value}
      </span>
    </div>
  )
}

// ───────────────────────── Step 4 — Journey Complete ─────────────────────────
function Step4() {
  const { state, reset } = useDemo()
  const toast = useToast()
  const scenario = SCENARIOS[state.selectedScenario]

  useEffect(() => {
    fireConfetti()
  }, [])

  const handleReset = async () => {
    try {
      await DemoAPI.reset()
      reset()
      toast.success('Demo state reset')
    } catch (e) {
      toast.error(e.message)
    }
  }

  const isMigrant = state.selectedScenario === 'migrant_worker'

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-center">
      <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center animate-checkmark shadow-lg">
        <PartyPopper className="text-white" size={36} />
      </div>
      <div>
        <h3 className="text-3xl font-extrabold tracking-tight">
          Journey Complete!
        </h3>
        <p className="text-sm text-text-muted mt-2">
          The NewCityAgent pipeline onboarded {scenario?.fullName} end-to-end.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface p-6 text-left space-y-4">
        <Row label="Customer" value={scenario?.fullName} />
        <Row label="City" value={scenario?.to} />
        <Row
          label="Outcome"
          value={
            isMigrant
              ? 'Account Reactivated + Remittance Schedule Created'
              : 'New Insta Savings Account Opened'
          }
        />
        {state.remittanceData && (
          <Row
            label="Remittance"
            value={`${state.remittanceData.frequency} · ₹${state.remittanceData.amount}`}
          />
        )}
        {state.newAccountData?.accountNumber && (
          <Row
            label="New Account #"
            value={state.newAccountData.accountNumber}
            mono
          />
        )}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <Stat label="Steps Completed" value="4 / 4" />
          <Stat label="Avg Time / Step" value="~6s" />
        </div>
      </div>

      <Button
        size="xl"
        variant="primary"
        icon={RefreshCcw}
        onClick={handleReset}
      >
        Reset & Run Another
      </Button>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
        {label}
      </div>
      <div className="text-lg font-bold tabular-nums">{value}</div>
    </div>
  )
}

function fireConfetti() {
  if (typeof window === 'undefined') return
  const colors = ['#1a56db', '#0e9f6e', '#d97706', '#a855f7', '#e02424']
  const layer = document.createElement('div')
  layer.style.cssText =
    'position:fixed;inset:0;pointer-events:none;z-index:60;overflow:hidden'
  for (let i = 0; i < 80; i++) {
    const p = document.createElement('div')
    const size = 6 + Math.random() * 6
    p.style.cssText = `
      position:absolute;
      top:-20px;
      left:${Math.random() * 100}%;
      width:${size}px;height:${size * 0.4}px;
      background:${colors[i % colors.length]};
      transform:rotate(${Math.random() * 360}deg);
      animation: confetti-fall ${1.6 + Math.random() * 1.4}s cubic-bezier(.2,.7,.3,1) ${Math.random() * 0.3}s forwards;
      opacity: 0.95;
    `
    layer.appendChild(p)
  }
  document.body.appendChild(layer)
  if (!document.getElementById('confetti-style')) {
    const s = document.createElement('style')
    s.id = 'confetti-style'
    s.textContent = `@keyframes confetti-fall {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
    }`
    document.head.appendChild(s)
  }
  setTimeout(() => layer.remove(), 4000)
}

// ───────────────────────── Main DemoPage ─────────────────────────
function useMaxReached(current) {
  const [max, setMax] = useState(current)
  const lastSeen = useRef(current)
  if (current > lastSeen.current) {
    lastSeen.current = current
    if (max < current) setMax(current)
  }
  return max
}

export default function DemoPage() {
  const { state, dispatch } = useDemo()
  const current = state.currentStep

  const maxReached = useMaxReached(current)

  const goNext = () =>
    dispatch({ type: 'SET_STEP', payload: Math.min(4, current + 1) })
  const goBack = () =>
    dispatch({ type: 'SET_STEP', payload: Math.max(1, current - 1) })
  const jumpTo = (n) => dispatch({ type: 'SET_STEP', payload: n })

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Live Demo</h2>
        <p className="text-sm text-text-muted mt-1">
          A guided walkthrough of the NewCityAgent onboarding pipeline.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface p-5 sm:p-6">
        <StepIndicator
          steps={STEPS}
          current={current}
          maxReached={maxReached}
          onJump={jumpTo}
        />
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-surface p-5 sm:p-8 min-h-[480px]">
        {current === 1 && <Step1 onNext={goNext} />}
        {current === 2 && <Step2 onNext={goNext} onBack={goBack} />}
        {current === 3 && <Step3 onNext={goNext} onBack={goBack} />}
        {current === 4 && <Step4 />}
      </div>

      <EventLog compact />
    </div>
  )
}
