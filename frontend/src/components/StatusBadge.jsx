const config = {
  ACTIVE: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400', border: 'border-emerald-500/20', label: 'Active' },
  INACTIVE: { bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400', border: 'border-gray-500/20', label: 'Inactive' },
  LOCKED: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400', border: 'border-red-500/20', label: 'Locked' },
  PENDING: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400', border: 'border-amber-500/20', label: 'Pending' },
  APPROVED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400', border: 'border-emerald-500/20', label: 'Approved' },
  REJECTED: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400', border: 'border-red-500/20', label: 'Rejected' },
  CANCELLED: { bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400', border: 'border-gray-500/20', label: 'Cancelled' },
  PRESENT: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400', border: 'border-emerald-500/20', label: 'Present' },
  ABSENT: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400', border: 'border-red-500/20', label: 'Absent' },
  HALF_DAY: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400', border: 'border-amber-500/20', label: 'Half Day' },
  ON_LEAVE: { bg: 'bg-violet-500/10', text: 'text-violet-400', dot: 'bg-violet-400', border: 'border-violet-500/20', label: 'On Leave' },
  WORK_FROM_HOME: { bg: 'bg-sky-500/10', text: 'text-sky-400', dot: 'bg-sky-400', border: 'border-sky-500/20', label: 'WFH' },
  HOLIDAY: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', dot: 'bg-indigo-400', border: 'border-indigo-500/20', label: 'Holiday' },
  DRAFT: { bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400', border: 'border-gray-500/20', label: 'Draft' },
  PROCESSING: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400', border: 'border-amber-500/20', label: 'Processing' },
  COMPLETED: { bg: 'bg-sky-500/10', text: 'text-sky-400', dot: 'bg-sky-400', border: 'border-sky-500/20', label: 'Completed' },
  PAID: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400', border: 'border-emerald-500/20', label: 'Paid' },
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
