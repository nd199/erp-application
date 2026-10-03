import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { FiCalendar, FiPlus } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { fetchMyLeaves } from '../store/leaveBalanceThunks'
import { createLeave } from '../store/leaveThunks'
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

function SummaryChip({ label, count, color }) {
  return (
    <div className={`px-4 py-3 rounded-xl border bg-white/[0.03] ${color}`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
      <p className="text-xl font-bold mt-0.5">{count}</p>
    </div>
  )
}

function MyLeave() {
  const dispatch = useDispatch()
  const { myLeaves, myLeavesTotal, loading } = useSelector((s) => s.leaveBalances)
  const employees = useSelector((s) => s.employees.employees)
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => { dispatch(fetchMyLeaves({ page: page - 1, size: PAGE_SIZE })) }, [dispatch, page])

  const counts = {
    pending: myLeaves.filter((l) => l.status === 'PENDING').length,
    approved: myLeaves.filter((l) => l.status === 'APPROVED').length,
    rejected: myLeaves.filter((l) => l.status === 'REJECTED').length,
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    const emp = employees.find((e) => e.id === Number(values.employeeId))
    const payload = {
      ...values,
      employeeId: Number(values.employeeId),
      days: Number(values.days),
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : undefined,
    }
    try {
      await dispatch(createLeave(payload)).unwrap()
      toast.success('Leave request submitted')
      setModalOpen(false)
      dispatch(fetchMyLeaves({ page: page - 1, size: PAGE_SIZE }))
    } catch (err) { toast.error(err.message || 'Failed') }
    finally { setSubmitting(false) }
  }

  const columns = [
    { key: 'leaveType', label: 'Type', render: (val) => (
      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">{val}</span>
    )},
    { key: 'fromDate', label: 'From', render: formatDate },
    { key: 'toDate', label: 'To', render: formatDate },
    { key: 'days', label: 'Days' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'reason', label: 'Reason', render: (val) => <span className="text-gray-400 text-sm">{val || '-'}</span> },
  ]

  return (
    <div>
      <PageHeader title="My Leave" subtitle="Your personal leave requests" icon={FiCalendar} actionLabel="Request Leave" onAction={() => setModalOpen(true)} actionIcon={FiPlus} />

      <div className="grid grid-cols-3 gap-4 mb-6 max-w-md">
        <SummaryChip label="Pending" count={counts.pending} color="border-amber-500/20 text-amber-400" />
        <SummaryChip label="Approved" count={counts.approved} color="border-emerald-500/20 text-emerald-400" />
        <SummaryChip label="Rejected" count={counts.rejected} color="border-red-500/20 text-red-400" />
      </div>

      {loading && myLeaves.length === 0 ? <LoadingSpinner /> : myLeaves.length === 0 ? (
        <EmptyState title="No leave requests" description="You have not submitted any leave requests yet." />
      ) : (
        <DataTable
          columns={columns}
          data={myLeaves}
          paginated
          pageSize={PAGE_SIZE}
          external
          page={page}
          totalPages={Math.max(1, Math.ceil(myLeavesTotal / PAGE_SIZE))}
          totalRecords={myLeavesTotal}
          onPageChange={setPage}
          exportable
          exportFilename="my-leave"
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Request Leave" subtitle="Submit a new leave request." size="lg">
        <Formik
          initialValues={{
            employeeId: employees[0]?.id || '',
            leaveType: 'ANNUAL',
            fromDate: '',
            toDate: '',
            days: 1,
            reason: '',
          }}
          validationSchema={schema}
          onSubmit={handleSubmit}
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
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Submit'}</button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  )
}

export default MyLeave
