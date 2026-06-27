import { useEffect, useState, useCallback, useRef } from 'react'
import { DemoAPI } from '../services/api'

export function useDemoState(intervalMs = 0) {
  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const tickRef = useRef(0)

  const refresh = useCallback(async () => {
    try {
      const data = await DemoAPI.state()
      setState(data)
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    if (!intervalMs) return
    const id = setInterval(() => {
      tickRef.current += 1
      refresh()
    }, intervalMs)
    return () => clearInterval(id)
  }, [refresh, intervalMs])

  return { state, loading, error, refresh }
}
