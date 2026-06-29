import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';
import InfoPanel from './components/layout/InfoPanel';
import Dashboard from './pages/Dashboard';
import CustomerView from './pages/CustomerView';
import DemoPage from './pages/DemoPage';
import SignalsPage from './pages/SignalsPage';

const INFO_PANEL_DATA = {
  '/': {
    instructions: [
      { text: 'Click "Migrant Worker" to simulate Ramesh Kumar using an ATM in a new city — triggers his dormant account flow.' },
      { text: 'Click "Student" to simulate Priya Sharma whose SIM card roams into a new city — triggers her new account onboarding flow.' },
      { text: 'Click "Reset State" before each fresh demo run to wipe all previous signals, notifications, and events from memory.' },
      { text: 'After triggering a scenario, switch to the Customer Simulator tab to see the AI notification on the mock device.' },
    ],
    systemLogic: "When you trigger a scenario, the backend immediately fires the location signal processor. It compares the user's current city to the incoming signal city. If a new city is detected, an LLM generates a hyper-personalised outreach message in the user's preferred language. This message is stored as a notification and the user's city record is updated in the in-memory database — all within milliseconds."
  },
  '/demo': {
    instructions: [
      { text: 'Step 1 — Select a scenario card (Migrant Worker or Student) to trigger a live location signal.' },
      { text: 'Step 2 — Watch the AI Agent detect the city change and generate a personalised notification.' },
      { text: 'Step 3 — Complete the onboarding action: enter the Aadhaar OTP (use 123456) or click to open a new account.' },
      { text: 'Step 4 — View the success confirmation and reset the demo to run again.' },
    ],
    systemLogic: "This 4-step flow mirrors the real agentic pipeline: a location signal arrives from an external source (ATM/SIM/UPI), the AI agent identifies a city change, calls the LLM to craft a hyper-personal message in the user's language, then routes them into the correct onboarding journey — dormant account reactivation or new Insta Savings Account opening via video KYC."
  },
  '/customer': {
    instructions: [
      { text: 'First trigger a scenario from the Admin Dashboard or Guided Demo tab to generate a signal.' },
      { text: 'The simulated phone will automatically display the AI-generated notification once the agent fires.' },
      { text: 'For dormant accounts — enter the Aadhaar OTP shown in the Guided Demo (or use 123456) and click "Verify & Reactivate".' },
      { text: 'For active worker accounts — fill in the beneficiary details and click "Setup Transfer" to schedule a remittance.' },
    ],
    systemLogic: "This tab polls the backend every 3 seconds for the latest state. When a new notification exists, it binds to the user who received it and renders their personalised experience inside the mock Android device. The OTP verification calls the CBS (Core Banking System) API which validates the OTP against an in-memory session cache before reactivating the account."
  },
  '/signals': {
    instructions: [
      { text: 'Enter a registered phone number (e.g. 9876543210 for Ramesh, 9876543211 for Priya).' },
      { text: 'Select a signal source: ATM (card swipe), UPI (payment), or SIM (roaming detection).' },
      { text: 'Type or select a destination city and click "Send Signal" to inject the location event.' },
      { text: 'The response panel will show if a city change was detected and the AI notification generated.' },
    ],
    systemLogic: "This tool directly calls the /api/signals endpoint, bypassing the guided demo UI. It lets you test arbitrary phone + city combinations to explore how the Location Processor identifies city changes. If the injected city differs from the user's recorded city, the backend fires the LLM to generate a contextual notification. All signals are logged and visible in the Recent Signals table below."
  }
};

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname === '/';
  const isCustomer = location.pathname === '/customer';
  const isDemo = location.pathname === '/demo';
  const isSignals = location.pathname === '/signals';

  const panelData = INFO_PANEL_DATA[location.pathname] || INFO_PANEL_DATA['/'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Navbar />
      
      {/* The Main Pink Gradient Banner */}
      <div style={{
        background: 'var(--gradient-banner)',
        padding: '20px 40px',
        color: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, fontWeight: '600' }}>Agentic Banking Solution for Migrant Workers and Students</h1>
      </div>
      
      <main style={{ flexGrow: 1, backgroundColor: 'var(--bg-primary)', position: 'relative' }}>
        <div style={{ display: isDashboard ? 'block' : 'none' }}>
          <Dashboard />
        </div>
        <div style={{ display: isDemo ? 'block' : 'none' }}>
          <DemoPage />
        </div>
        <div style={{ display: isCustomer ? 'block' : 'none' }}>
          <CustomerView />
        </div>
        <div style={{ display: isSignals ? 'block' : 'none' }}>
          <SignalsPage />
        </div>
      </main>

      {/* InfoPanel — always at the bottom of every page */}
      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '0 80px 40px' }}>
        <InfoPanel
          instructions={panelData.instructions}
          systemLogic={panelData.systemLogic}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App; // Trigger HMR
