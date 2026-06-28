import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sun, Moon, RefreshCw, Landmark } from 'lucide-react';

export default function Navbar({ isDark, toggleTheme, isSseConnected, onReset }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 theme-transition">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Info */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sbi-blue text-white shadow-sm">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              NewCityAgent
            </span>
            <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
              SBI Relocation & Onboarding Hub
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden space-x-1 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-100 text-sbi-blue dark:bg-slate-800 dark:text-blue-450'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/demo"
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-100 text-sbi-blue dark:bg-slate-800 dark:text-blue-450'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`
            }
          >
            Guided Demo Flow
          </NavLink>
          <NavLink
            to="/signals"
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-100 text-sbi-blue dark:bg-slate-800 dark:text-blue-450'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`
            }
          >
            Signal Injection
          </NavLink>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* SSE Connection Status */}
          <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <span
              className={`h-2 w-2 rounded-full ${
                isSseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span>{isSseConnected ? 'Live' : 'Disconnected'}</span>
          </div>

          {/* Reset Demo State Button */}
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750 dark:hover:text-white"
            title="Reset Database"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750 dark:hover:text-white"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation bar */}
      <div className="flex border-t border-slate-100 px-4 py-2 md:hidden dark:border-slate-800 justify-around">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-xs font-semibold px-2 py-1 rounded ${
              isActive ? 'text-sbi-blue dark:text-blue-450 font-bold' : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/demo"
          className={({ isActive }) =>
            `text-xs font-semibold px-2 py-1 rounded ${
              isActive ? 'text-sbi-blue dark:text-blue-450 font-bold' : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          Demo Flow
        </NavLink>
        <NavLink
          to="/signals"
          className={({ isActive }) =>
            `text-xs font-semibold px-2 py-1 rounded ${
              isActive ? 'text-sbi-blue dark:text-blue-450 font-bold' : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          Signals
        </NavLink>
      </div>
    </header>
  );
}
