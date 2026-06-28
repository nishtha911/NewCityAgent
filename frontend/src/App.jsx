import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import CustomerView from './pages/CustomerView';

function App() {
  return (
    <Router>
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
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>NewCityAgent <span style={{ fontWeight: 'normal', opacity: 0.8 }}>| Hackathon Demo</span></h1>
          <p style={{ marginTop: '5px', opacity: 0.9 }}>Agentic Banking Solution for Migrant Workers and Students</p>
        </div>
        
        <main style={{ flexGrow: 1, backgroundColor: 'var(--bg-primary)' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customer" element={<CustomerView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
