import { useState, useEffect, useRef } from 'react'

function BarChart({ data, width = 600, height = 250, color = '#3b82f6', barKey = 'count', labelKey = 'month', showGrid = true, animate = true }) {
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

  const padding = { top: 20, right: 20, bottom: 35, left: 45 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const values = data.map((d) => d[barKey])
  const maxVal = Math.max(...values) * 1.15

  const barW = (chartW / data.length) * 0.55
  const gap = (chartW / data.length) * 0.45
  const eased = 1 - Math.pow(1 - progress, 3)

  const yTicks = 5
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => (i / yTicks) * maxVal)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <defs>
        <linearGradient id={`bar-grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {showGrid && yTickValues.map((v, i) => {
        const y = padding.top + chartH - (v / maxVal) * chartH
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={padding.left + chartW} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <text x={padding.left - 8} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.25)" fontSize="10" fontFamily="system-ui">
              {Math.round(v)}
            </text>
          </g>
        )
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const x = padding.left + i * (chartW / data.length) + gap / 2
        const barH = (d[barKey] / maxVal) * chartH * eased
        const y = padding.top + chartH - barH

        return (
          <g key={i}>
            {/* Bar glow */}
            <rect x={x - 2} y={y - 2} width={barW + 4} height={barH + 4} rx="6" fill={color} opacity={0.08 * eased} />
            {/* Bar */}
            <rect x={x} y={y} width={barW} height={barH} rx="4" fill={`url(#bar-grad-${color})`} />
            {/* Value label */}
            {eased > 0.8 && (
              <text x={x + barW / 2} y={y - 8} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="system-ui" opacity={(eased - 0.8) * 5}>
                {d[barKey]}
              </text>
            )}
            {/* X label */}
            <text x={x + barW / 2} y={padding.top + chartH + 20} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="system-ui">
              {d[labelKey]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default BarChart
