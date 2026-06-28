import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import CustomerView from './pages/CustomerView';
import DemoPage from './pages/DemoPage';
import SignalsPage from './pages/SignalsPage';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname === '/';
  const isCustomer = location.pathname === '/customer';
  const isDemo = location.pathname === '/demo';
  const isSignals = location.pathname === '/signals';

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
