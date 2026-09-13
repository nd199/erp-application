import { useState, useEffect, useRef } from 'react'

function AreaChart({ data, width = 600, height = 250, lines = [{ key: 'revenue', color: '#3b82f6' }, { key: 'expenses', color: '#ef4444' }], labelKey = 'month', showGrid = true, animate = true }) {
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

  const padding = { top: 20, right: 20, bottom: 35, left: 55 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const allValues = data.flatMap((d) => lines.map((l) => d[l.key]))
  const maxVal = Math.max(...allValues) * 1.1
  const eased = 1 - Math.pow(1 - progress, 3)

  const yTicks = 5
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => (i / yTicks) * maxVal)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <defs>
        {lines.map((l) => (
          <linearGradient key={l.key} id={`area-${l.color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={l.color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={l.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>

      {/* Grid */}
      {showGrid && yTickValues.map((v, i) => {
        const y = padding.top + chartH - (v / maxVal) * chartH
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
      {data.map((d, i) => {
        const x = padding.left + (i / (data.length - 1)) * chartW
        return (
          <text key={i} x={x} y={padding.top + chartH + 20} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="system-ui">
            {d[labelKey]}
          </text>
        )
      })}

      {/* Lines + areas */}
      {lines.map((l) => {
        const points = data.map((d, i) => ({
          x: padding.left + (i / (data.length - 1)) * chartW,
          y: padding.top + chartH - (d[l.key] / maxVal) * chartH,
        }))

        const visibleCount = Math.max(Math.floor(eased * points.length), 1)
        const visible = points.slice(0, visibleCount)

        const pathD = visible.length > 1
          ? visible.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
          : ''

        const areaD = pathD
          ? `${pathD} L ${visible[visible.length - 1].x} ${padding.top + chartH} L ${visible[0].x} ${padding.top + chartH} Z`
          : ''

        return (
          <g key={l.key}>
            {areaD && <path d={areaD} fill={`url(#area-${l.color})`} opacity={eased} />}
            {pathD && <path d={pathD} fill="none" stroke={l.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={eased} />}
            {visible.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="3" fill="#0a0a0f" stroke={l.color} strokeWidth="1.5" opacity={eased} />
            ))}
          </g>
        )
      })}
    </svg>
  )
}

export default AreaChart
