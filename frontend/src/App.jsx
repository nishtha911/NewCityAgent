import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Demo from './pages/Demo';
import Signals from './pages/Signals';

export default function App() {
  // Theme State
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // DB State
  const [dbState, setDbState] = useState({
    users: [],
    signals: [],
    notifications: [],
    remittances: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // SSE Events State
  const [events, setEvents] = useState([]);
  const [isSseConnected, setIsSseConnected] = useState(false);

  // Apply Theme on load/change
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Fetch Core Database State
  const fetchState = async () => {
    try {
      const response = await axios.get('/api/demo/state');
      setDbState({
        users: response.data.users || [],
        signals: response.data.signals || [],
        notifications: response.data.notifications || [],
        remittances: response.data.remittances || []
      });
      setError(null);
    } catch (err) {
      console.error('Failed to fetch DB state:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Demo State
  const resetDemo = async () => {
    try {
      await axios.post('/api/demo/reset');
      await fetchState();
    } catch (err) {
      console.error('Reset failed:', err);
    }
  };

  // Clear Local Terminal Logs
  const clearEvents = () => {
    setEvents([]);
  };

  // Initialize DB Fetch and SSE Event Stream
  useEffect(() => {
    fetchState();

    // SSE EventSource setup
    let eventSource;
    const connectSse = () => {
      // Connect to SSE log stream
      eventSource = new EventSource('/api/demo/events');

      eventSource.onopen = () => {
        setIsSseConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          // Add event to local events history
          setEvents(prev => [...prev, parsed]);

          // Refresh database states on relevant transactions/triggers
          if (
            [
              'SIGNAL_RECEIVED',
              'CITY_CHANGE',
              'NOTIFICATION_SENT',
              'REMITTANCE_SCHEDULED',
              'CBS_TRANSACTION',
              'SYSTEM_RESET',
              'ACCOUNT_REACTIVATED',
              'ACCOUNT_OPENED'
            ].includes(parsed.type)
          ) {
            fetchState();
          }
        } catch (err) {
          console.error('Failed to parse SSE payload:', err);
        }
      };

      eventSource.onerror = (err) => {
        console.error('SSE connection error:', err);
        setIsSseConnected(false);
        eventSource.close();
        
        // Reconnect after delay
        setTimeout(connectSse, 5000);
      };
    };

    connectSse();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 theme-transition">
        {/* Navigation Bar */}
        <Navbar 
          isDark={isDark} 
          toggleTheme={toggleTheme} 
          isSseConnected={isSseConnected} 
          onReset={resetDemo} 
        />

        {/* Page Content */}
        <main className="flex-1">
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  dbState={dbState} 
                  isLoading={isLoading} 
                  error={error} 
                  events={events} 
                  onClearEvents={clearEvents} 
                />
              } 
            />
            <Route 
              path="/demo" 
              element={
                <Demo 
                  dbState={dbState} 
                  fetchState={fetchState} 
                />
              } 
            />
            <Route 
              path="/signals" 
              element={
                <Signals 
                  dbState={dbState} 
                  fetchState={fetchState} 
                />
              } 
            />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-900/50 text-center theme-transition">
          <p className="text-xs text-slate-500 dark:text-slate-450">
            NewCityAgent Portal • Built using React, Vite & Tailwind CSS v4 • Powered by Antigravity
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
