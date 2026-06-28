import React, { useState, useEffect } from 'react';
import { Moon, Sun, Search, User } from 'lucide-react';

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <header style={{
      backgroundColor: 'var(--bg-topbar)',
      color: 'var(--text-inverse)',
      padding: '10px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.9rem'
    }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            height: '40px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <img src="/logo.png" alt="NewCityAgent Logo" style={{ height: '100%', objectFit: 'contain' }} />
          </div>
        </div>
        <div style={{ borderLeft: '1px solid #333', paddingLeft: '20px' }}>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{ 
              background: 'transparent', 
              color: 'var(--text-inverse)', 
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}

