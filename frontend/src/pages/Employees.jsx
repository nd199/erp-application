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
import Avatar from '../components/Avatar'
import ImageUpload from '../components/ImageUpload'
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from '../store/employeeThunks'
import { fetchDepartments } from '../store/departmentThunks'
import { formatDate } from '../utils/format'

const schema = Yup.object({
  firstName: Yup.string().trim().required('Required'),
  lastName: Yup.string().trim().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string(),
  hireDate: Yup.date().required('Required'),
  jobTitle: Yup.string().trim().required('Required'),
  departmentId: Yup.number().required('Required'),
})

const PAGE_SIZE = 8

const sortFieldFor = (key) => (key === 'departmentName' ? 'department.name' : key)

function Employees() {
  const dispatch = useDispatch()
  const { employees, loading, total } = useSelector((s) => s.employees)
  const departments = useSelector((s) => s.departments.departments)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selected, setSelected] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => { dispatch(fetchDepartments()) }, [dispatch])

  useEffect(() => {
    const t = setTimeout(() => { setQuery(search); setPage(1) }, 350)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    const params = { page: page - 1, size: PAGE_SIZE }
    if (query) params.search = query
    if (status) params.status = status
    if (departmentId) params.departmentId = Number(departmentId)
    if (sortKey && sortDir) params.sort = `${sortFieldFor(sortKey)},${sortDir}`
    dispatch(fetchEmployees(params))
  }, [dispatch, query, page, status, departmentId, sortKey, sortDir])

  const openModal = (mode, row = null) => { setModalMode(mode); setSelected(row); setModalOpen(true) }

  const handleSubmit = async (values, { setSubmitting }) => {
    const dept = departments.find((d) => d.id === Number(values.departmentId))
    const payload = {
      ...values,
      departmentId: Number(values.departmentId),
      departmentName: dept?.name,
      department: undefined,
    }
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
    try {
      await dispatch(deleteEmployee(selected.id)).unwrap()
      toast.success('Employee deleted')
      setConfirmOpen(false)
      if (employees.length === 1 && page > 1) setPage((p) => p - 1)
    } catch (err) { toast.error(err.message || 'Failed') }
  }

  const columns = [
    { key: 'firstName', label: 'Employee', render: (_, row) => (
      <div className="flex items-center gap-3">
        <Avatar src={row.imageUrl} name={`${row.firstName} ${row.lastName}`} size="md" />
        <div>
          <p className="text-white font-semibold text-sm">{row.firstName} {row.lastName}</p>
          <p className="text-[11px] text-gray-500">{row.email}</p>
        </div>
      </div>
    )},
    { key: 'jobTitle', label: 'Position' },
    { key: 'departmentName', label: 'Department', render: (val, row) => val || row.department?.name || '-', exportValue: (row) => row.departmentName || row.department?.name || '' },
    { key: 'phone', label: 'Phone' },
    { key: 'hireDate', label: 'Joined', render: formatDate },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
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
      <PageHeader title="Employees" subtitle="Manage your workforce" icon={FiUsers} actionLabel="Add Employee" onAction={() => openModal('create')} actionIcon={FiPlus} />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex-1 min-w-[240px] max-w-sm"><SearchBar value={search} onChange={setSearch} placeholder="Search employees..." /></div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className={selectCls}>
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="LOCKED">Locked</option>
        </select>
        <select value={departmentId} onChange={(e) => { setDepartmentId(e.target.value); setPage(1) }} className={selectCls}>
          <option value="">All Departments</option>
          {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {loading && employees.length === 0 ? <LoadingSpinner /> : total === 0 && !query && !status && !departmentId ? (
        <EmptyState title="No employees found" description="Add your first employee to get started." />
      ) : (
        <DataTable
          columns={columns}
          data={employees}
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
          exportFilename="employees"
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalMode === 'create' ? 'Add Employee' : 'Edit Employee'} subtitle={modalMode === 'create' ? 'Add a new team member.' : `Editing ${selected?.firstName} ${selected?.lastName}`} size="lg">
        <Formik initialValues={{ firstName: selected?.firstName || '', lastName: selected?.lastName || '', email: selected?.email || '', phone: selected?.phone || '', hireDate: selected?.hireDate || '', jobTitle: selected?.jobTitle || '', departmentId: selected?.departmentId || selected?.department?.id || '', imageUrl: selected?.imageUrl || '' }} validationSchema={schema} onSubmit={handleSubmit} enableReinitialize>
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <ImageUpload value={values.imageUrl} onChange={(url) => setFieldValue('imageUrl', url)} name={`${values.firstName} ${values.lastName}`} />
              </div>
              <FormField name="firstName" label="First Name" placeholder="First name" />
              <FormField name="lastName" label="Last Name" placeholder="Last name" />
              <FormField name="email" label="Email" type="email" placeholder="email@example.com" />
              <FormField name="phone" label="Phone" placeholder="Phone number" />
              <FormField name="hireDate" label="Hire Date" type="date" />
              <FormField name="jobTitle" label="Job Title" placeholder="Job title" />
              <div className="col-span-2"><FormField name="departmentId" label="Department" as="select" options={departments.map((d) => ({ value: d.id, label: d.name }))} /></div>
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