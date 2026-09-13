import { useState, useEffect, useRef } from 'react'

function DonutChart({ data, size = 200, thickness = 24, animate = true }) {
  const [progress, setProgress] = useState(animate ? 0 : 1)
  const ref = useRef(null)

  useEffect(() => {
    if (!animate) return
    let start = null
    const duration = 1000
    const step = (ts) => {
      if (!start) start = ts
      const elapsed = ts - start
      setProgress(Math.min(elapsed / duration, 1))
      if (elapsed < duration) ref.current = requestAnimationFrame(step)
    }
    ref.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(ref.current)
  }, [animate])

  const total = data.reduce((sum, d) => sum + d.value, 0)
  const r = (size - thickness) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r
  const eased = 1 - Math.pow(1 - progress, 3)

  let cumulative = 0

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} size`} className="w-full h-full -rotate-90">
        {/* Background ring */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={thickness} />

        {/* Segments */}
        {data.map((d, i) => {
          const pct = d.value / total
          const dashLen = circumference * pct * eased
          const dashOff = circumference * (cumulative / total) * eased
          cumulative += d.value

          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={thickness}
              strokeDasharray={`${dashLen} ${circumference - dashLen}`}
              strokeDashoffset={-dashOff}
              strokeLinecap="round"
              style={{ transition: 'all 0.3s ease' }}
            />
          )
        })}
      </svg>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{total}</span>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Total</span>
      </div>
    </div>
  )
}

export default DonutChart
