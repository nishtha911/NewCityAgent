import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export default function Header({ subtitle = 'SBI Migrant & Student Onboarding' }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="md:hidden flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-extrabold">
            N
          </div>
          <div className="text-sm font-bold">NewCityAgent</div>
        </div>
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-text">NewCityAgent</h1>
          <p className="text-xs text-text-muted">{subtitle}</p>
        </div>
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-surface text-text hover:bg-surface-2 transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  )
}
