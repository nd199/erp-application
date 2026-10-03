import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { FiClock, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import FormField from '../components/FormField'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { fetchAttendance, createAttendance, updateAttendance, deleteAttendance } from '../store/attendanceThunks'
import { fetchEmployees } from '../store/employeeThunks'
import { fetchMyAttendanceSummary } from '../store/attendanceSummaryThunks'
import { formatDate } from '../utils/format'

const schema = Yup.object({
  employeeId: Yup.number().required('Required'),
  workDate: Yup.date().required('Required'),
  checkIn: Yup.string(),
  checkOut: Yup.string(),
  status: Yup.string().required('Required'),
  notes: Yup.string().max(2000, 'Too long'),
})

const PAGE_SIZE = 8
const STATUSES = ['PRESENT', 'ABSENT', 'HALF_DAY', 'ON_LEAVE', 'WORK_FROM_HOME', 'HOLIDAY']

function Attendance() {
  const dispatch = useDispatch()
  const { records, loading, total } = useSelector((s) => s.attendance)
  const employees = useSelector((s) => s.employees.employees)
  const mySummary = useSelector((s) => s.attendanceSummary.mySummary)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selected, setSelected] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => { dispatch(fetchEmployees({ page: 0, size: 100 })) }, [dispatch])

  useEffect(() => {
    const now = new Date()
    dispatch(fetchMyAttendanceSummary({ year: now.getFullYear(), month: now.getMonth() + 1 }))
  }, [dispatch])

  useEffect(() => {
    const t = setTimeout(() => { setQuery(search); setPage(1) }, 350)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    const params = { page: page - 1, size: PAGE_SIZE }
    if (query) params.search = query
    if (status) params.status = status
    if (employeeId) params.employeeId = Number(employeeId)
    if (sortKey && sortDir) params.sort = `${sortKey},${sortDir}`
    dispatch(fetchAttendance(params))
  }, [dispatch, query, page, status, employeeId, sortKey, sortDir])

  const openModal = (mode, row = null) => { setModalMode(mode); setSelected(row); setModalOpen(true) }

  const toTime = (val) => {
    if (!val) return ''
    if (val.length === 5) return val
    return val.slice(0, 5)
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    const emp = employees.find((e) => e.id === Number(values.employeeId))
    const payload = {
      ...values,
      employeeId: Number(values.employeeId),
      checkIn: values.checkIn || null,
      checkOut: values.checkOut || null,
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : undefined,
    }
    try {
      if (modalMode === 'create') {
        await dispatch(createAttendance(payload)).unwrap()
        toast.success('Attendance marked')
      } else {
        await dispatch(updateAttendance({ id: selected.id, ...payload })).unwrap()
        toast.success('Attendance updated')
      }
      setModalOpen(false)
    } catch (err) { toast.error(err.message || 'Failed') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteAttendance(selected.id)).unwrap()
      toast.success('Attendance record deleted')
      setConfirmOpen(false)
      if (records.length === 1 && page > 1) setPage((p) => p - 1)
    } catch (err) { toast.error(err.message || 'Failed') }
  }

  const columns = [
    { key: 'employeeName', label: 'Employee', render: (val, row) => (
      <div>
        <p className="text-white font-semibold text-sm">{val || '-'}</p>
        <p className="text-[11px] text-gray-500">{row.employeeEmail || ''}</p>
      </div>
    )},
    { key: 'workDate', label: 'Date', render: formatDate },
    { key: 'checkIn', label: 'Check In', render: (val) => val || '-' },
    { key: 'checkOut', label: 'Check Out', render: (val) => val || '-' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'notes', label: 'Notes', render: (val) => <span className="text-gray-400 text-sm">{val || '-'}</span> },
    { key: 'id', label: '', render: (_, row) => (
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button onClick={(e) => { e.stopPropagation(); openModal('edit', row) }} className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200 cursor-pointer"><FiEdit2 className="w-3.5 h-3.5" /></button>
        <button onClick={(e) => { e.stopPropagation(); setSelected(row); setConfirmOpen(true) }} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"><FiTrash2 className="w-3.5 h-3.5" /></button>
      </div>
    )},
  ]

  const selectCls = "bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl pl-3 pr-8 py-2.5 text-sm text-gray-300 outline-none transition-colors cursor-pointer"

  return (
    <div>
      <PageHeader title="Attendance" subtitle="Track daily attendance" icon={FiClock} actionLabel="Mark Attendance" onAction={() => openModal('create')} actionIcon={FiPlus} />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Present</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{mySummary?.present ?? 0}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Absent</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{mySummary?.absent ?? 0}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">On Leave</p>
          <p className="text-2xl font-bold text-violet-400 mt-1">{mySummary?.onLeave ?? 0}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">WFH</p>
          <p className="text-2xl font-bold text-sky-400 mt-1">{mySummary?.workFromHome ?? 0}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Half Day</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{mySummary?.halfDay ?? 0}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex-1 min-w-[240px] max-w-sm"><SearchBar value={search} onChange={setSearch} placeholder="Search attendance..." /></div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className={selectCls}>
          <option value="">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
        <select value={employeeId} onChange={(e) => { setEmployeeId(e.target.value); setPage(1) }} className={selectCls}>
          <option value="">All Employees</option>
          {employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
        </select>
      </div>

      {loading && records.length === 0 ? <LoadingSpinner /> : total === 0 && !query && !status && !employeeId ? (
        <EmptyState title="No attendance records" description="Mark attendance to start tracking." />
      ) : (
        <DataTable
          columns={columns}
          data={records}
          onRowClick={(row) => openModal('edit', row)}
          paginated
          pageSize={PAGE_SIZE}
          external
          page={page}
          totalPages={Math.ceil(total / PAGE_SIZE)}
          totalRecords={total}
          onPageChange={setPage}
          sortKey={sortKey}
          sortDir={sortDir}
          onSortChange={(key, dir) => { setSortKey(dir === null ? null : key); setSortDir(dir === null ? 'asc' : dir); setPage(1) }}
          exportable
          exportFilename="attendance"
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalMode === 'create' ? 'Mark Attendance' : 'Edit Attendance'} subtitle={modalMode === 'create' ? 'Record attendance for an employee.' : `Editing record #${selected?.id}`} size="lg">
        <Formik
          initialValues={{
            employeeId: selected?.employeeId || '',
            workDate: selected?.workDate || '',
            checkIn: toTime(selected?.checkIn),
            checkOut: toTime(selected?.checkOut),
            status: selected?.status || 'PRESENT',
            notes: selected?.notes || '',
          }}
          validationSchema={schema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <FormField name="employeeId" label="Employee" as="select" options={employees.map((e) => ({ value: e.id, label: `${e.firstName} ${e.lastName}` }))} />
              </div>
              <FormField name="workDate" label="Work Date" type="date" />
              <FormField name="status" label="Status" as="select" options={STATUSES.map((s) => ({ value: s, label: s.replace(/_/g, ' ') }))} />
              <FormField name="checkIn" label="Check In" type="time" />
              <FormField name="checkOut" label="Check Out" type="time" />
              <div className="col-span-2">
                <FormField name="notes" label="Notes" as="textarea" placeholder="Optional notes" />
              </div>
              <div className="col-span-2 flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50">{isSubmitting ? 'Saving...' : modalMode === 'create' ? 'Mark' : 'Save Changes'}</button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      <ConfirmModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Attendance Record" message={`Delete attendance record for ${selected?.employeeName} on ${selected?.workDate}?`} />
    </div>
  )
}

export default Attendance
