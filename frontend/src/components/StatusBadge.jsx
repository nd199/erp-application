const config = {
  ACTIVE: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400', border: 'border-emerald-500/20', label: 'Active' },
  INACTIVE: { bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400', border: 'border-gray-500/20', label: 'Inactive' },
  LOCKED: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400', border: 'border-red-500/20', label: 'Locked' },
}

function StatusBadge({ status }) {
  const style = config[status] || config.INACTIVE

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${style.bg} ${style.text} border ${style.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot} animate-glow-pulse`} />
      {style.label}
    </span>
  )
}

export default StatusBadge
