import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { FiCalendar, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import FormField from '../components/FormField'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { fetchLeaves, createLeave, updateLeave, deleteLeave, updateLeaveStatus } from '../store/leaveThunks'
import { fetchEmployees } from '../store/employeeThunks'
import { formatDate } from '../utils/format'

const schema = Yup.object({
  employeeId: Yup.number().required('Required'),
  leaveType: Yup.string().required('Required'),
  fromDate: Yup.date().required('Required'),
  toDate: Yup.date().required('Required').min(Yup.ref('fromDate'), 'Must be on or after from date'),
  days: Yup.number().min(0.5, 'Min 0.5').required('Required'),
  reason: Yup.string().max(2000, 'Too long'),
})

const PAGE_SIZE = 8
const LEAVE_TYPES = ['ANNUAL', 'SICK', 'CASUAL', 'UNPAID', 'MATERNITY', 'PATERNITY', 'COMPENSATORY']

function LeaveRequests() {
  const dispatch = useDispatch()
  const { leaves, loading, total } = useSelector((s) => s.leaves)
  const employees = useSelector((s) => s.employees.employees)
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
  const [approveOpen, setApproveOpen] = useState(false)
  const [approveAction, setApproveAction] = useState('APPROVED')
  const [approvalNotes, setApprovalNotes] = useState('')

  useEffect(() => { dispatch(fetchEmployees({ page: 0, size: 100 })) }, [dispatch])

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
    dispatch(fetchLeaves(params))
  }, [dispatch, query, page, status, employeeId, sortKey, sortDir])

  const openModal = (mode, row = null) => { setModalMode(mode); setSelected(row); setModalOpen(true) }

  const handleSubmit = async (values, { setSubmitting }) => {
    const emp = employees.find((e) => e.id === Number(values.employeeId))
    const payload = {
      ...values,
      employeeId: Number(values.employeeId),
      days: Number(values.days),
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : undefined,
    }
    try {
      if (modalMode === 'create') {
        await dispatch(createLeave(payload)).unwrap()
        toast.success('Leave request submitted')
      } else {
        await dispatch(updateLeave({ id: selected.id, ...payload })).unwrap()
        toast.success('Leave request updated')
      }
      setModalOpen(false)
    } catch (err) { toast.error(err.message || 'Failed') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteLeave(selected.id)).unwrap()
      toast.success('Leave request deleted')
      setConfirmOpen(false)
      if (leaves.length === 1 && page > 1) setPage((p) => p - 1)
    } catch (err) { toast.error(err.message || 'Failed') }
  }

  const handleApprove = async () => {
    try {
      await dispatch(updateLeaveStatus({ id: selected.id, status: approveAction, approvalNotes })).unwrap()
      toast.success(`Leave ${approveAction.toLowerCase()}`)
      setApproveOpen(false)
      setApprovalNotes('')
    } catch (err) { toast.error(err.message || 'Failed') }
  }

  const columns = [
    { key: 'employeeName', label: 'Employee', render: (val, row) => (
      <div>
        <p className="text-white font-semibold text-sm">{val || row.employee?.name || '-'}</p>
        <p className="text-[11px] text-gray-500">{row.employeeEmail || ''}</p>
      </div>
    )},
    { key: 'leaveType', label: 'Type', render: (val) => (
      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">{val}</span>
    )},
    { key: 'fromDate', label: 'From', render: formatDate },
    { key: 'toDate', label: 'To', render: formatDate },
    { key: 'days', label: 'Days' },
    { key: 'reason', label: 'Reason', render: (val) => <span className="text-gray-400 text-sm">{val || '-'}</span> },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'id', label: '', render: (_, row) => (
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {row.status === 'PENDING' && (
          <button onClick={(e) => { e.stopPropagation(); setSelected(row); setApproveAction('APPROVED'); setApproveOpen(true) }} className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200 cursor-pointer" title="Approve"><FiCheck className="w-3.5 h-3.5" /></button>
        )}
        {row.status === 'PENDING' && (
          <button onClick={(e) => { e.stopPropagation(); setSelected(row); setApproveAction('REJECTED'); setApproveOpen(true) }} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer" title="Reject"><FiX className="w-3.5 h-3.5" /></button>
        )}
        <button onClick={(e) => { e.stopPropagation(); openModal('edit', row) }} className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200 cursor-pointer"><FiEdit2 className="w-3.5 h-3.5" /></button>
        <button onClick={(e) => { e.stopPropagation(); setSelected(row); setConfirmOpen(true) }} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"><FiTrash2 className="w-3.5 h-3.5" /></button>
      </div>
    )},
  ]

  const selectCls = "bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl pl-3 pr-8 py-2.5 text-sm text-gray-300 outline-none transition-colors cursor-pointer"

  return (
    <div>
      <PageHeader title="Leave Requests" subtitle="Manage time-off requests" icon={FiCalendar} actionLabel="Request Leave" onAction={() => openModal('create')} actionIcon={FiPlus} />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex-1 min-w-[240px] max-w-sm"><SearchBar value={search} onChange={setSearch} placeholder="Search leave requests..." /></div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className={selectCls}>
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <select value={employeeId} onChange={(e) => { setEmployeeId(e.target.value); setPage(1) }} className={selectCls}>
          <option value="">All Employees</option>
          {employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
        </select>
      </div>

      {loading && leaves.length === 0 ? <LoadingSpinner /> : total === 0 && !query && !status && !employeeId ? (
        <EmptyState title="No leave requests" description="Submit your first leave request to get started." />
      ) : (
        <DataTable
          columns={columns}
          data={leaves}
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
          exportFilename="leave-requests"
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalMode === 'create' ? 'Request Leave' : 'Edit Leave Request'} subtitle={modalMode === 'create' ? 'Submit a new leave request.' : `Editing request #${selected?.id}`} size="lg">
        <Formik
          initialValues={{
            employeeId: selected?.employeeId || '',
            leaveType: selected?.leaveType || 'ANNUAL',
            fromDate: selected?.fromDate || '',
            toDate: selected?.toDate || '',
            days: selected?.days || 1,
            reason: selected?.reason || '',
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
              <FormField name="leaveType" label="Leave Type" as="select" options={LEAVE_TYPES.map((t) => ({ value: t, label: t }))} />
              <FormField name="days" label="Days" type="number" placeholder="e.g. 3" />
              <FormField name="fromDate" label="From Date" type="date" />
              <FormField name="toDate" label="To Date" type="date" />
              <div className="col-span-2">
                <FormField name="reason" label="Reason" as="textarea" placeholder="Reason for leave" />
              </div>
              <div className="col-span-2 flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50">{isSubmitting ? 'Saving...' : modalMode === 'create' ? 'Submit' : 'Save Changes'}</button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      <Modal isOpen={approveOpen} onClose={() => setApproveOpen(false)} title={approveAction === 'APPROVED' ? 'Approve Leave' : 'Reject Leave'} subtitle={`Request from ${selected?.employeeName || ''}`}>
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-gray-400">
            <p><span className="text-gray-500">Type:</span> {selected?.leaveType}</p>
            <p><span className="text-gray-500">Dates:</span> {selected?.fromDate} → {selected?.toDate} ({selected?.days} days)</p>
            <p><span className="text-gray-500">Reason:</span> {selected?.reason || '-'}</p>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Approval Notes</label>
            <textarea
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              rows={3}
              placeholder="Optional notes"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/40 transition-all resize-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setApproveOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-all cursor-pointer">Cancel</button>
            <button type="button" onClick={handleApprove} className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all cursor-pointer ${approveAction === 'APPROVED' ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400' : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400'}`}>
              {approveAction === 'APPROVED' ? 'Approve' : 'Reject'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Leave Request" message={`Delete leave request #${selected?.id} for ${selected?.employeeName}?`} />
    </div>
  )
}

export default LeaveRequests
