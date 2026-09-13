import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { FiUsers, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import FormField from '../components/FormField'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from '../store/employeeThunks'
import { fakeDepartments } from '../lib/fakeData'

const schema = Yup.object({
  firstName: Yup.string().trim().required('Required'),
  lastName: Yup.string().trim().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string(),
  hireDate: Yup.date().required('Required'),
  jobTitle: Yup.string().trim().required('Required'),
  departmentId: Yup.number().required('Required'),
})

function Employees() {
  const dispatch = useDispatch()
  const { employees, loading } = useSelector((s) => s.employees)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selected, setSelected] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [page, setPage] = useState(1)
  const perPage = 8

  useEffect(() => { dispatch(fetchEmployees()) }, [dispatch])

  const filtered = employees.filter((e) =>
    `${e.firstName} ${e.lastName} ${e.email} ${e.jobTitle}`.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  const openModal = (mode, row = null) => { setModalMode(mode); setSelected(row); setModalOpen(true) }

  const handleSubmit = async (values, { setSubmitting }) => {
    const dept = fakeDepartments.find((d) => d.id === Number(values.departmentId))
    const payload = { ...values, department: dept, departmentId: undefined }
    try {
      if (modalMode === 'create') {
        await dispatch(createEmployee(payload)).unwrap()
        toast.success('Employee created')
      } else {
        await dispatch(updateEmployee({ id: selected.id, ...payload })).unwrap()
        toast.success('Employee updated')
      }
      setModalOpen(false)
    } catch (err) { toast.error(err.message || 'Failed') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    try { await dispatch(deleteEmployee(selected.id)).unwrap(); toast.success('Employee deleted'); setConfirmOpen(false) }
    catch (err) { toast.error(err.message || 'Failed') }
  }

  const columns = [
    { key: 'firstName', label: 'Employee', render: (_, row) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/15 to-violet-500/10 border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
          <span className="text-[10px] font-bold text-blue-400">{row.firstName[0]}{row.lastName[0]}</span>
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{row.firstName} {row.lastName}</p>
          <p className="text-[11px] text-gray-500">{row.email}</p>
        </div>
      </div>
    )},
    { key: 'jobTitle', label: 'Position' },
    { key: 'department', label: 'Department', render: (val) => val?.name || '-' },
    { key: 'phone', label: 'Phone' },
    { key: 'hireDate', label: 'Joined', render: (val) => new Date(val).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'id', label: '', render: (_, row) => (
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button onClick={(e) => { e.stopPropagation(); openModal('edit', row) }} className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200 cursor-pointer"><FiEdit2 className="w-3.5 h-3.5" /></button>
        <button onClick={(e) => { e.stopPropagation(); setSelected(row); setConfirmOpen(true) }} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"><FiTrash2 className="w-3.5 h-3.5" /></button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Employees" subtitle="Manage your workforce" icon={FiUsers} actionLabel="Add Employee" onAction={() => openModal('create')} actionIcon={FiPlus} />
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 max-w-sm"><SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search employees..." /></div>
        <span className="text-[11px] text-gray-600 font-medium">{filtered.length} employees</span>
      </div>

      {loading && employees.length === 0 ? <LoadingSpinner /> : paged.length === 0 ? <EmptyState title="No employees found" description="Add your first employee to get started." /> : (
        <DataTable columns={columns} data={paged} onRowClick={(row) => openModal('edit', row)} />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalMode === 'create' ? 'Add Employee' : 'Edit Employee'} subtitle={modalMode === 'create' ? 'Add a new team member.' : `Editing ${selected?.firstName} ${selected?.lastName}`} size="lg">
        <Formik initialValues={{ firstName: selected?.firstName || '', lastName: selected?.lastName || '', email: selected?.email || '', phone: selected?.phone || '', hireDate: selected?.hireDate || '', jobTitle: selected?.jobTitle || '', departmentId: selected?.department?.id || '' }} validationSchema={schema} onSubmit={handleSubmit} enableReinitialize>
          {({ isSubmitting }) => (
            <Form className="grid grid-cols-2 gap-4">
              <FormField name="firstName" label="First Name" placeholder="First name" />
              <FormField name="lastName" label="Last Name" placeholder="Last name" />
              <FormField name="email" label="Email" type="email" placeholder="email@example.com" />
              <FormField name="phone" label="Phone" placeholder="Phone number" />
              <FormField name="hireDate" label="Hire Date" type="date" />
              <FormField name="jobTitle" label="Job Title" placeholder="Job title" />
              <div className="col-span-2"><FormField name="departmentId" label="Department" as="select" options={fakeDepartments.map((d) => ({ value: d.id, label: d.name }))} /></div>
              <div className="col-span-2 flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50">{isSubmitting ? 'Saving...' : modalMode === 'create' ? 'Create' : 'Save Changes'}</button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      <ConfirmModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Employee" message={`Are you sure you want to delete ${selected?.firstName} ${selected?.lastName}? This action cannot be undone.`} />
    </div>
  )
}

export default Employees
