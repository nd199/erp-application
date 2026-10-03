import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { FiCalendar, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import FormField from '../components/FormField'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import {
  fetchLeaveBalances,
  createLeaveBalance,
  updateLeaveBalance,
  deleteLeaveBalance,
} from '../store/leaveBalanceThunks'
import { fetchEmployees } from '../store/employeeThunks'

const schema = Yup.object({
  employeeId: Yup.number().required('Required'),
  year: Yup.number().required('Required'),
  leaveType: Yup.string().required('Required'),
  totalEntitled: Yup.number().min(0, 'Must be 0 or more').required('Required'),
})

const LEAVE_TYPES = ['ANNUAL', 'SICK', 'CASUAL', 'UNPAID', 'MATERNITY', 'PATERNITY', 'COMPENSATORY']
const YEARS = [2026, 2025, 2024]

function LeaveBalances() {
  const dispatch = useDispatch()
  const { balances, loading } = useSelector((s) => s.leaveBalances)
  const employees = useSelector((s) => s.employees.employees)
  const [search, setSearch] = useState('')
  const [year, setYear] = useState('2025')
  const [leaveType, setLeaveType] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selected, setSelected] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => { dispatch(fetchEmployees({ page: 0, size: 100 })) }, [dispatch])

  useEffect(() => {
    const params = {}
    if (year) params.year = Number(year)
    if (leaveType) params.leaveType = leaveType
    if (employeeId) params.employeeId = Number(employeeId)
    if (search) params.search = search
    dispatch(fetchLeaveBalances(params))
  }, [dispatch, year, leaveType, employeeId, search])

  const openModal = (mode, row = null) => { setModalMode(mode); setSelected(row); setModalOpen(true) }

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      employeeId: Number(values.employeeId),
      year: Number(values.year),
      leaveType: values.leaveType,
      totalEntitled: Number(values.totalEntitled),
    }
    try {
      if (modalMode === 'create') {
        await dispatch(createLeaveBalance(payload)).unwrap()
        toast.success('Leave balance created')
      } else {
        await dispatch(updateLeaveBalance({ id: selected.id, totalEntitled: payload.totalEntitled })).unwrap()
        toast.success('Leave balance updated')
      }
      setModalOpen(false)
      if (year || leaveType || employeeId || search) {
        const params = {}
        if (year) params.year = Number(year)
        if (leaveType) params.leaveType = leaveType
        if (employeeId) params.employeeId = Number(employeeId)
        if (search) params.search = search
        dispatch(fetchLeaveBalances(params))
      }
    } catch (err) { toast.error(err.message || 'Failed') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteLeaveBalance(selected.id)).unwrap()
      toast.success('Leave balance deleted')
      setConfirmOpen(false)
    } catch (err) { toast.error(err.message || 'Failed') }
  }

  const columns = [
    { key: 'employeeName', label: 'Employee', render: (val, row) => (
      <div>
        <p className="text-white font-semibold text-sm">{val || '-'}</p>
        <p className="text-[11px] text-gray-500">{row.employeeEmail || ''}</p>
      </div>
    )},
    { key: 'year', label: 'Year' },
    { key: 'leaveType', label: 'Type', render: (val) => (
      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">{val}</span>
    )},
    { key: 'totalEntitled', label: 'Entitled' },
    { key: 'used', label: 'Used' },
    { key: 'remaining', label: 'Remaining', render: (val) => (
      <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${val > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
        {val}
      </span>
    )},
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
      <PageHeader title="Leave Balances" subtitle="Manage employee leave entitlements" icon={FiCalendar} actionLabel="Add Balance" onAction={() => openModal('create')} actionIcon={FiPlus} />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex-1 min-w-[240px] max-w-sm"><SearchBar value={search} onChange={setSearch} placeholder="Search balances..." /></div>
        <select value={year} onChange={(e) => setYear(e.target.value)} className={selectCls}>
          <option value="">All Years</option>
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className={selectCls}>
          <option value="">All Types</option>
          {LEAVE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className={selectCls}>
          <option value="">All Employees</option>
          {employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
        </select>
      </div>

      {loading && balances.length === 0 ? <LoadingSpinner /> : balances.length === 0 ? (
        <EmptyState title="No leave balances found" description="Create leave balances for your employees." />
      ) : (
        <DataTable
          columns={columns}
          data={balances}
          onRowClick={(row) => openModal('edit', row)}
          paginated
          pageSize={8}
          resetKey={`${year}-${leaveType}-${employeeId}-${search}`}
          exportable
          exportFilename="leave-balances"
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalMode === 'create' ? 'Add Leave Balance' : 'Edit Leave Balance'} subtitle={modalMode === 'create' ? 'Set leave entitlement for an employee.' : `Editing ${selected?.employeeName || ''} — ${selected?.leaveType || ''}`}>
        <Formik
          initialValues={{
            employeeId: selected?.employeeId || '',
            year: selected?.year || 2025,
            leaveType: selected?.leaveType || 'ANNUAL',
            totalEntitled: selected?.totalEntitled ?? '',
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
              <FormField name="year" label="Year" as="select" options={YEARS.map((y) => ({ value: y, label: String(y) }))} />
              <FormField name="leaveType" label="Leave Type" as="select" options={LEAVE_TYPES.map((t) => ({ value: t, label: t }))} />
              <div className="col-span-2">
                <FormField name="totalEntitled" label="Total Entitled (days)" type="number" placeholder="e.g. 12" />
              </div>
              <div className="col-span-2 flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50">{isSubmitting ? 'Saving...' : modalMode === 'create' ? 'Create' : 'Save Changes'}</button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      <ConfirmModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Leave Balance" message={`Delete ${selected?.leaveType} balance for ${selected?.employeeName} (${selected?.year})?`} />
    </div>
  )
}

export default LeaveBalances
