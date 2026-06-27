import { useEffect, useState } from 'react'

export function useCountUp(target = 0, duration = 800) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let raf
    const start = performance.now()
    const from = 0
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(from + (target - from) * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}
