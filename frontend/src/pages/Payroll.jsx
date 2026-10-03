import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, FieldArray, useFormikContext } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { FiDollarSign, FiPlus, FiEdit2, FiTrash2, FiPlay, FiCheckCircle, FiEye } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import FormField from '../components/FormField'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { fetchPayrollRuns, createPayrollRun, updatePayrollRun, deletePayrollRun, processPayrollRun, markPayrollRunPaid } from '../store/payrollThunks'
import { fetchEmployees } from '../store/employeeThunks'
import { formatCurrency } from '../utils/format'

const itemSchema = Yup.object({
  employeeId: Yup.number().required('Required'),
  basicSalary: Yup.number().min(0).required('Required'),
  allowances: Yup.number().min(0),
  deductions: Yup.number().min(0),
  tax: Yup.number().min(0),
})

const schema = Yup.object({
  periodMonth: Yup.number().min(1).max(12).required('Required'),
  periodYear: Yup.number().min(2000).required('Required'),
  notes: Yup.string().max(2000),
  items: Yup.array().of(itemSchema).min(1, 'At least one item required'),
})

const PAGE_SIZE = 8
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const NOW = new Date()
const DEFAULT_MONTH = NOW.getMonth() + 1
const DEFAULT_YEAR = NOW.getFullYear()

const inputCls = "w-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl px-3 py-2 text-sm text-gray-200 outline-none focus:border-blue-500/40"

function PayrollItemsEditor({ employees }) {
  const { values, setFieldValue } = useFormikContext()

  return (
    <FieldArray name="items">
      {({ push, remove }) => (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-300">Payroll Items</p>
            <button
              type="button"
              onClick={() => push({ employeeId: '', basicSalary: 0, allowances: 0, deductions: 0, tax: 0, notes: '' })}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-all cursor-pointer"
            >
              <FiPlus className="w-3 h-3" /> Add Item
            </button>
          </div>

          {values.items.map((item, idx) => {
            const net =
              (Number(item.basicSalary) || 0) +
              (Number(item.allowances) || 0) -
              (Number(item.deductions) || 0) -
              (Number(item.tax) || 0)

            return (
              <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-4">
                    <label className="text-[11px] text-gray-500 mb-1 block">Employee</label>
                    <select
                      className={inputCls}
                      value={item.employeeId}
                      onChange={(e) => setFieldValue(`items.${idx}.employeeId`, e.target.value)}
                    >
                      <option value="">Select employee</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[11px] text-gray-500 mb-1 block">Basic</label>
                    <input
                      type="number"
                      className={inputCls}
                      value={item.basicSalary}
                      onChange={(e) => setFieldValue(`items.${idx}.basicSalary`, e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[11px] text-gray-500 mb-1 block">Allowances</label>
                    <input
                      type="number"
                      className={inputCls}
                      value={item.allowances}
                      onChange={(e) => setFieldValue(`items.${idx}.allowances`, e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[11px] text-gray-500 mb-1 block">Deductions</label>
                    <input
                      type="number"
                      className={inputCls}
                      value={item.deductions}
                      onChange={(e) => setFieldValue(`items.${idx}.deductions`, e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[11px] text-gray-500 mb-1 block">Tax</label>
                    <input
                      type="number"
                      className={inputCls}
                      value={item.tax}
                      onChange={(e) => setFieldValue(`items.${idx}.tax`, e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500">Net:</span>
                    <span className={`text-sm font-semibold ${net < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {formatCurrency(net)}
                    </span>
                  </div>
                  {values.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </FieldArray>
  )
}

function Payroll() {
  const dispatch = useDispatch()
  const { runs, loading, total } = useSelector((s) => s.payroll)
  const employees = useSelector((s) => s.employees.employees)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selected, setSelected] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)

  useEffect(() => { dispatch(fetchEmployees({ page: 0, size: 100 })) }, [dispatch])

  useEffect(() => {
    const t = setTimeout(() => { setQuery(search); setPage(1) }, 350)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    const params = { page: page - 1, size: PAGE_SIZE }
    if (query) params.search = query
    if (status) params.status = status
    if (sortKey && sortDir) params.sort = `${sortKey},${sortDir}`
    dispatch(fetchPayrollRuns(params))
  }, [dispatch, query, page, status, sortKey, sortDir])

  const openModal = (mode, row = null) => { setModalMode(mode); setSelected(row); setModalOpen(true) }

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      periodMonth: Number(values.periodMonth),
      periodYear: Number(values.periodYear),
      notes: values.notes,
      items: values.items.map((it) => ({
        employeeId: Number(it.employeeId),
        basicSalary: Number(it.basicSalary) || 0,
        allowances: Number(it.allowances) || 0,
        deductions: Number(it.deductions) || 0,
        tax: Number(it.tax) || 0,
        notes: it.notes,
      })),
    }
    try {
      if (modalMode === 'create') {
        await dispatch(createPayrollRun(payload)).unwrap()
        toast.success('Payroll run created')
      } else {
        await dispatch(updatePayrollRun({ id: selected.id, ...payload })).unwrap()
        toast.success('Payroll run updated')
      }
      setModalOpen(false)
    } catch (err) { toast.error(err.message || 'Failed') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    try {
      await dispatch(deletePayrollRun(selected.id)).unwrap()
      toast.success('Payroll run deleted')
      setConfirmOpen(false)
      if (runs.length === 1 && page > 1) setPage((p) => p - 1)
    } catch (err) { toast.error(err.message || 'Failed') }
  }

  const handleProcess = async (row) => {
    try {
      await dispatch(processPayrollRun(row.id)).unwrap()
      toast.success('Payroll run processed')
    } catch (err) { toast.error(err.message || 'Failed') }
  }

  const handleMarkPaid = async (row) => {
    try {
      await dispatch(markPayrollRunPaid(row.id)).unwrap()
      toast.success('Payroll run marked as paid')
    } catch (err) { toast.error(err.message || 'Failed') }
  }

  const columns = [
    { key: 'periodLabel', label: 'Period', render: (val) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 border border-white/[0.06] flex items-center justify-center shrink-0"><FiDollarSign className="w-4 h-4 text-emerald-400" /></div>
        <span className="text-white font-semibold text-sm">{val}</span>
      </div>
    )},
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'totalGross', label: 'Gross', render: (val) => <span className="text-gray-300 text-sm">{formatCurrency(val)}</span> },
    { key: 'totalDeductions', label: 'Deductions', render: (val) => <span className="text-red-400 text-sm">{formatCurrency(val)}</span> },
    { key: 'totalNet', label: 'Net Pay', render: (val) => <span className="text-emerald-400 font-semibold text-sm">{formatCurrency(val)}</span> },
    { key: 'processedByName', label: 'Processed By', render: (val) => val || '-' },
    { key: 'id', label: '', render: (_, row) => (
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button onClick={(e) => { e.stopPropagation(); setSelected(row); setDetailOpen(true) }} className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200 cursor-pointer" title="View details"><FiEye className="w-3.5 h-3.5" /></button>
        {row.status === 'DRAFT' && (
          <button onClick={(e) => { e.stopPropagation(); openModal('edit', row) }} className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200 cursor-pointer"><FiEdit2 className="w-3.5 h-3.5" /></button>
        )}
        {row.status === 'DRAFT' && (
          <button onClick={(e) => { e.stopPropagation(); handleProcess(row) }} className="p-1.5 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all duration-200 cursor-pointer" title="Process"><FiPlay className="w-3.5 h-3.5" /></button>
        )}
        {row.status === 'COMPLETED' && (
          <button onClick={(e) => { e.stopPropagation(); handleMarkPaid(row) }} className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200 cursor-pointer" title="Mark paid"><FiCheckCircle className="w-3.5 h-3.5" /></button>
        )}
        {row.status !== 'PAID' && (
          <button onClick={(e) => { e.stopPropagation(); setSelected(row); setConfirmOpen(true) }} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"><FiTrash2 className="w-3.5 h-3.5" /></button>
        )}
      </div>
    )},
  ]

  const selectCls = "bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl pl-3 pr-8 py-2.5 text-sm text-gray-300 outline-none transition-colors cursor-pointer"

  return (
    <div>
      <PageHeader title="Payroll" subtitle="Manage payroll runs" icon={FiDollarSign} actionLabel="New Payroll Run" onAction={() => openModal('create')} actionIcon={FiPlus} />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex-1 min-w-[240px] max-w-sm"><SearchBar value={search} onChange={setSearch} placeholder="Search payroll runs..." /></div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className={selectCls}>
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
          <option value="PAID">Paid</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {loading && runs.length === 0 ? <LoadingSpinner /> : total === 0 && !query && !status ? (
        <EmptyState title="No payroll runs" description="Create your first payroll run." />
      ) : (
        <DataTable
          columns={columns}
          data={runs}
          onRowClick={(row) => { setSelected(row); setDetailOpen(true) }}
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
          exportFilename="payroll-runs"
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalMode === 'create' ? 'New Payroll Run' : 'Edit Payroll Run'} subtitle={modalMode === 'create' ? 'Define period and salary components.' : `Editing ${selected?.periodLabel}`} size="xl">
        <Formik
          initialValues={{
            periodMonth: selected?.periodMonth || DEFAULT_MONTH,
            periodYear: selected?.periodYear || DEFAULT_YEAR,
            notes: selected?.notes || '',
            items: selected?.items?.length
              ? selected.items.map((it) => ({
                  employeeId: it.employeeId,
                  basicSalary: it.basicSalary,
                  allowances: it.allowances,
                  deductions: it.deductions,
                  tax: it.tax,
                  notes: it.notes || '',
                }))
              : [{ employeeId: '', basicSalary: 0, allowances: 0, deductions: 0, tax: 0, notes: '' }],
          }}
          validationSchema={schema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, errors }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <FormField name="periodMonth" label="Month" as="select" options={MONTHS.map((m, i) => ({ value: i + 1, label: m }))} />
                <FormField name="periodYear" label="Year" type="number" placeholder="2025" />
                <FormField name="notes" label="Notes" placeholder="Optional notes" />
              </div>

              <PayrollItemsEditor employees={employees} />
              {typeof errors.items === 'string' && <p className="text-xs text-red-400">{errors.items}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50">{isSubmitting ? 'Saving...' : modalMode === 'create' ? 'Create Run' : 'Save Changes'}</button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title={selected?.periodLabel || 'Payroll Run'} subtitle={`Status: ${selected?.status}`} size="xl">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Gross</p>
                <p className="text-white font-semibold">{formatCurrency(selected.totalGross)}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Deductions</p>
                <p className="text-red-400 font-semibold">{formatCurrency(selected.totalDeductions)}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Net</p>
                <p className="text-emerald-400 font-semibold">{formatCurrency(selected.totalNet)}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-gray-500 border-b border-white/[0.06]">
                    <th className="py-2 pr-3">Employee</th>
                    <th className="py-2 pr-3">Basic</th>
                    <th className="py-2 pr-3">Allowances</th>
                    <th className="py-2 pr-3">Deductions</th>
                    <th className="py-2 pr-3">Tax</th>
                    <th className="py-2">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {(selected.items || []).map((it) => (
                    <tr key={it.id} className="border-b border-white/[0.04]">
                      <td className="py-2.5 pr-3 text-white">{it.employeeName}</td>
                      <td className="py-2.5 pr-3 text-gray-300">{formatCurrency(it.basicSalary)}</td>
                      <td className="py-2.5 pr-3 text-gray-300">{formatCurrency(it.allowances)}</td>
                      <td className="py-2.5 pr-3 text-red-400">{formatCurrency(it.deductions)}</td>
                      <td className="py-2.5 pr-3 text-red-400">{formatCurrency(it.tax)}</td>
                      <td className="py-2.5 text-emerald-400 font-semibold">{formatCurrency(it.netPay)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Payroll Run" message={`Delete payroll run ${selected?.periodLabel}?`} />
    </div>
  )
}

export default Payroll
