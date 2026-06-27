import { useEffect, useRef, useState, useCallback } from 'react'

const BASE = import.meta.env.VITE_API_BASE_URL || ''

export function useSSE(path = '/api/demo/events') {
  const [events, setEvents] = useState([])
  const [connected, setConnected] = useState(false)
  const sourceRef = useRef(null)

  const connect = useCallback(() => {
    if (sourceRef.current) return
    const url = BASE ? `${BASE}${path}` : path
    const es = new EventSource(url)
    sourceRef.current = es

    es.onopen = () => setConnected(true)
    es.onerror = () => setConnected(false)

    es.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data)
        setEvents((prev) => {
          const next = [...prev, data]
          return next.slice(-100)
        })
      } catch (e) {
        // ignore non-json
      }
    }
  }, [path])

  const disconnect = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.close()
      sourceRef.current = null
      setConnected(false)
    }
  }, [])

  const clear = useCallback(() => setEvents([]), [])

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [connect, disconnect])

  return { events, connected, clear, reconnect: connect }
}
