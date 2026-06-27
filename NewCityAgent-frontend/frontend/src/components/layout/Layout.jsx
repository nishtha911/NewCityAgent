import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useSSE } from '../../hooks/useSSE'

export default function Layout() {
  const { connected } = useSSE('/api/demo/events')
  return (
    <div className="flex h-full bg-bg text-text">
      <Sidebar connected={connected} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
