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
            width: '32px',
            height: '32px',
            backgroundColor: '#444',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            color: '#fff',
            overflow: 'hidden'
          }}>
            {/* TODO: Add logo image here in /public folder e.g. <img src="/logo.png" alt="logo" style={{width: '100%'}}/> */}
            LOGO
          </div>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>NewCity<span style={{ color: 'var(--highlight-cyan)' }}>Agent</span></span>
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

