import { useState, useEffect, useRef } from 'react'

function LineChart({ data, width = 600, height = 250, color = '#3b82f6', label = 'value', showDots = true, showGrid = true, animate = true }) {
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

  const padding = { top: 20, right: 20, bottom: 35, left: 45 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const values = data.map((d) => d[label])
  const maxVal = Math.max(...values) * 1.1
  const minVal = 0

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartW,
    y: padding.top + chartH - ((d[label] - minVal) / (maxVal - minVal)) * chartH,
    label: d.month,
    value: d[label],
  }))

  const eased = 1 - Math.pow(1 - progress, 3)
  const visibleCount = Math.floor(eased * points.length)
  const visiblePoints = points.slice(0, Math.max(visibleCount, 1))

  const pathD = visiblePoints.length > 1
    ? visiblePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    : ''

  const areaD = visiblePoints.length > 1
    ? `${pathD} L ${visiblePoints[visiblePoints.length - 1].x} ${padding.top + chartH} L ${visiblePoints[0].x} ${padding.top + chartH} Z`
    : ''

  const yTicks = 5
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => minVal + (i / yTicks) * (maxVal - minVal))

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <defs>
        <linearGradient id={`line-fill-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Grid */}
      {showGrid && yTickValues.map((v, i) => {
        const y = padding.top + chartH - ((v - minVal) / (maxVal - minVal)) * chartH
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={padding.left + chartW} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <text x={padding.left - 8} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.25)" fontSize="10" fontFamily="system-ui">
              {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : Math.round(v)}
            </text>
          </g>
        )
      })}

      {/* X labels */}
      {points.map((p, i) => (
        <text key={i} x={p.x} y={padding.top + chartH + 20} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="system-ui">
          {p.label}
        </text>
      ))}

      {/* Area fill */}
      {areaD && (
        <path d={areaD} fill={`url(#line-fill-${color})`} opacity={eased} />
      )}

      {/* Line */}
      {pathD && (
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" opacity={eased} />
      )}

      {/* Dots */}
      {showDots && visiblePoints.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#0a0a0f" stroke={color} strokeWidth="2" opacity={eased} />
          <circle cx={p.x} cy={p.y} r="1.5" fill={color} opacity={eased} />
        </g>
      ))}
    </svg>
  )
}

export default LineChart
