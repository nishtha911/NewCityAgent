import { createContext, useContext, useReducer, useCallback } from 'react'

const DemoContext = createContext(null)

const initialState = {
  selectedScenario: null, // 'migrant_worker' | 'student' | null
  currentStep: 1,
  scenarioResult: null,
  accountStatus: null,
  reactivationStatus: 'idle', // idle | initiated | verified
  otpSent: false,
  newAccountData: null,
  remittanceData: null,
  flowLog: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SCENARIO':
      return { ...state, selectedScenario: action.payload }
    case 'SET_STEP':
      return { ...state, currentStep: action.payload }
    case 'SET_SCENARIO_RESULT':
      return { ...state, scenarioResult: action.payload }
    case 'SET_ACCOUNT_STATUS':
      return { ...state, accountStatus: action.payload }
    case 'SET_REACTIVATION_STATUS':
      return { ...state, reactivationStatus: action.payload }
    case 'SET_OTP_SENT':
      return { ...state, otpSent: action.payload }
    case 'SET_NEW_ACCOUNT':
      return { ...state, newAccountData: action.payload }
    case 'SET_REMITTANCE':
      return { ...state, remittanceData: action.payload }
    case 'LOG':
      return { ...state, flowLog: [...state.flowLog, action.payload] }
    case 'RESET':
      return { ...initialState }
    default:
      return state
  }
}

export function DemoProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  return (
    <DemoContext.Provider value={{ state, dispatch, reset }}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used inside DemoProvider')
  return ctx
}

export const SCENARIOS = {
  migrant_worker: {
    id: 'migrant_worker',
    name: 'Migrant Worker',
    fullName: 'Ramesh Kumar',
    phone: '9876543210',
    from: 'Patna',
    to: 'Bengaluru',
    source: 'ATM',
    segment: 'Worker',
    icon: 'briefcase',
  },
  student: {
    id: 'student',
    name: 'Student',
    fullName: 'Priya Sharma',
    phone: '9876543211',
    from: 'Ranchi',
    to: 'Pune',
    source: 'SIM',
    segment: 'Student',
    icon: 'graduation-cap',
  },
}
