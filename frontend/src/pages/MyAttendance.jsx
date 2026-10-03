import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiClock } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { fetchMyAttendanceSummary, fetchMyAttendance } from '../store/attendanceSummaryThunks'
import { formatDate } from '../utils/format'

const PAGE_SIZE = 8
const INITIAL_NOW = new Date()
const INITIAL_MONTH = INITIAL_NOW.getMonth() + 1
const INITIAL_YEAR = INITIAL_NOW.getFullYear()
const MONTHS = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
  { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
  { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
  { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' },
]

function KpiCard({ label, value, colorClass }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${colorClass}`}>{value ?? 0}</p>
    </div>
  )
}

function MyAttendance() {
  const dispatch = useDispatch()
  const { mySummary, myRecords, myTotal, loading } = useSelector((s) => s.attendanceSummary)
  const [month, setMonth] = useState(INITIAL_MONTH)
  const [year, setYear] = useState(INITIAL_YEAR)
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(fetchMyAttendanceSummary({ year, month }))
  }, [dispatch, year, month])

  useEffect(() => {
    const pad = (n) => String(n).padStart(2, '0')
    const fromDate = `${year}-${pad(month)}-01`
    const lastDay = new Date(year, month, 0).getDate()
    const toDate = `${year}-${pad(month)}-${pad(lastDay)}`
    dispatch(fetchMyAttendance({ fromDate, toDate, page: page - 1, size: PAGE_SIZE }))
  }, [dispatch, year, month, page])

  const columns = [
    { key: 'workDate', label: 'Date', render: formatDate },
    { key: 'checkIn', label: 'Check In', render: (val) => val || '-' },
    { key: 'checkOut', label: 'Check Out', render: (val) => val || '-' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'notes', label: 'Notes', render: (val) => <span className="text-gray-400 text-sm">{val || '-'}</span> },
  ]

  const selectCls = "bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl pl-3 pr-8 py-2.5 text-sm text-gray-300 outline-none transition-colors cursor-pointer"

  return (
    <div>
      <PageHeader title="My Attendance" subtitle="Your monthly attendance snapshot" icon={FiClock} />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className={selectCls}>
          {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={selectCls}>
          {[2026, 2025, 2024].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <KpiCard label="Present" value={mySummary?.present} colorClass="text-emerald-400" />
        <KpiCard label="Absent" value={mySummary?.absent} colorClass="text-red-400" />
        <KpiCard label="Half Day" value={mySummary?.halfDay} colorClass="text-amber-400" />
        <KpiCard label="On Leave" value={mySummary?.onLeave} colorClass="text-violet-400" />
        <KpiCard label="WFH" value={mySummary?.workFromHome} colorClass="text-sky-400" />
      </div>

      {loading && myRecords.length === 0 ? <LoadingSpinner /> : myRecords.length === 0 ? (
        <EmptyState title="No attendance records" description="No attendance marked for the selected month." />
      ) : (
        <DataTable
          columns={columns}
          data={myRecords}
          paginated
          pageSize={PAGE_SIZE}
          external
          page={page}
          totalPages={Math.max(1, Math.ceil(myTotal / PAGE_SIZE))}
          totalRecords={myTotal}
          onPageChange={setPage}
          exportable
          exportFilename="my-attendance"
        />
      )}
    </div>
  )
}

export default MyAttendance
