import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { FiUser, FiPlus, FiEdit2, FiLock, FiUnlock, FiCheckCircle, FiXCircle } from 'react-icons/fi'
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
import { fetchUsers, createUser, updateUser, deleteUser, activateUser, deactivateUser, lockUser, unlockUser } from '../store/userThunks'

const schema = Yup.object({ username: Yup.string().trim().required('Required'), email: Yup.string().email('Invalid email').required('Required'), phone: Yup.string().required('Required'), address: Yup.string().required('Required') })

function Users() {
  const dispatch = useDispatch()
  const { users, loading } = useSelector((s) => s.users)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selected, setSelected] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [confirmMsg, setConfirmMsg] = useState('')

  useEffect(() => { dispatch(fetchUsers()) }, [dispatch])

  const filtered = users.filter((u) => `${u.username} ${u.email}`.toLowerCase().includes(search.toLowerCase()))
  const openModal = (mode, row = null) => { setModalMode(mode); setSelected(row); setModalOpen(true) }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (modalMode === 'create') { await dispatch(createUser(values)).unwrap(); toast.success('User created') }
      else { await dispatch(updateUser({ id: selected.id, ...values })).unwrap(); toast.success('User updated') }
      setModalOpen(false)
    } catch (err) { toast.error(err.message || 'Failed') }
    finally { setSubmitting(false) }
  }

  const handleAction = async (action, msg) => {
    try { await dispatch(action(selected.id)).unwrap(); toast.success('User updated'); setConfirmOpen(false) }
    catch (err) { toast.error(err.message || 'Failed') }
  }

  const columns = [
    { key: 'username', label: 'User', render: (val, row) => (
      <div className="flex items-center gap-3">
        <Avatar src={row.imageUrl} name={val} size="md" />
        <div>
          <p className="text-white font-semibold text-sm">{val}</p>
          <p className="text-[11px] text-gray-500">{row.email}</p>
        </div>
      </div>
    )},
    { key: 'phone', label: 'Phone' },
    { key: 'roles', label: 'Roles', render: (val) => (
      <div className="flex gap-1 flex-wrap">{val?.map((role) => (<span key={role.id} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{role.name}</span>))}</div>
    )},
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'id', label: '', render: (_, row) => (
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button onClick={(e) => { e.stopPropagation(); openModal('edit', row) }} className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all cursor-pointer" title="Edit"><FiEdit2 className="w-3.5 h-3.5" /></button>
        <button onClick={(e) => { e.stopPropagation(); setSelected(row); setConfirmAction(() => () => handleAction(row.status === 'ACTIVE' ? deactivateUser : activateUser)); setConfirmMsg(` ${row.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} "${row.username}"?`); setConfirmOpen(true) }} className="p-1.5 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer" title="Toggle status">
          {row.status === 'ACTIVE' ? <FiXCircle className="w-3.5 h-3.5" /> : <FiCheckCircle className="w-3.5 h-3.5" />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); setSelected(row); setConfirmAction(() => () => handleAction(row.status === 'LOCKED' ? unlockUser : lockUser)); setConfirmMsg(` ${row.status === 'LOCKED' ? 'Unlock' : 'Lock'} "${row.username}"?`); setConfirmOpen(true) }} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer" title="Toggle lock">
          {row.status === 'LOCKED' ? <FiUnlock className="w-3.5 h-3.5" /> : <FiLock className="w-3.5 h-3.5" />}
        </button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Users" subtitle="Manage user accounts" icon={FiUser} actionLabel="Add User" onAction={() => openModal('create')} actionIcon={FiPlus} />
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 max-w-sm"><SearchBar value={search} onChange={setSearch} placeholder="Search users..." /></div>
      </div>

      {loading && users.length === 0 ? <LoadingSpinner /> : filtered.length === 0 ? <EmptyState title="No users found" description="Create your first user account." /> : (
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(row) => openModal('edit', row)}
          paginated
          pageSize={8}
          resetKey={search}
          exportable
          exportFilename="users"
          filters={[
            { key: 'status', label: 'Status', valueLabel: (v) => v?.toLowerCase().replace(/^./, (c) => c.toUpperCase()) },
            { key: 'role', label: 'Role', getValue: (row) => row.roles?.[0]?.name },
          ]}
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalMode === 'create' ? 'Add User' : 'Edit User'}>
        <Formik initialValues={{ username: selected?.username || '', email: selected?.email || '', phone: selected?.phone || '', address: selected?.address || '' }} validationSchema={schema} onSubmit={handleSubmit} enableReinitialize>
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <FormField name="username" label="Username" placeholder="e.g. john.doe" />
              <FormField name="email" label="Email" type="email" placeholder="email@example.com" />
              <FormField name="phone" label="Phone" placeholder="Phone number" />
              <FormField name="address" label="Address" as="textarea" placeholder="Full address" />
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50">{isSubmitting ? 'Saving...' : modalMode === 'create' ? 'Create' : 'Save Changes'}</button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      <ConfirmModal isOpen={confirmOpen} onClose={() => { setConfirmOpen(false); setConfirmAction(null) }} onConfirm={async () => { await confirmAction?.(); setConfirmOpen(false) }} title="Confirm Action" message={confirmMsg} confirmLabel="Confirm" />
    </div>
  )
}

export default Users
