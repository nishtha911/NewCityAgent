import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import DashboardPage from './pages/DashboardPage'
import DemoPage from './pages/DemoPage'
import CustomerPage from './pages/CustomerPage'
import SignalsPage from './pages/SignalsPage'
import { DemoProvider } from './context/DemoContext'
import { ToastProvider } from './context/ToastContext'

export default function App() {
  return (
    <ToastProvider>
      <DemoProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="demo" element={<DemoPage />} />
              <Route path="customer/:phone" element={<CustomerPage />} />
              <Route path="signals" element={<SignalsPage />} />
              <Route path="*" element={<DashboardPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DemoProvider>
    </ToastProvider>
  )
}
