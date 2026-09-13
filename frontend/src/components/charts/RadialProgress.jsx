import { useState, useEffect, useRef } from 'react'

function RadialProgress({ value, total = 100, size = 120, thickness = 8, color = '#3b82f6', label, animate = true }) {
  const [progress, setProgress] = useState(animate ? 0 : 1)
  const ref = useRef(null)

  useEffect(() => {
    if (!animate) return
    let start = null
    const duration = 1200
    const step = (ts) => {
      if (!start) start = ts
      const elapsed = ts - start
      setProgress(Math.min(elapsed / duration, 1))
      if (elapsed < duration) ref.current = requestAnimationFrame(step)
    }
    ref.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(ref.current)
  }, [animate])

  const r = (size - thickness) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r
  const pct = value / total
  const eased = 1 - Math.pow(1 - progress, 3)
  const dashLen = circumference * pct * eased

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={thickness} />
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeDasharray={`${dashLen} ${circumference - dashLen}`}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-white">{Math.round(pct * 100 * eased)}%</span>
        </div>
      </div>
      {label && <span className="text-[11px] text-gray-500 font-medium">{label}</span>}
    </div>
  )
}

export default RadialProgress
