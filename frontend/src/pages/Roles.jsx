import { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { FiKey, FiPlus, FiShield, FiEdit2, FiTrash2 } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import FormField from '../components/FormField'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { fetchRoles, createRole, updateRole, deleteRole, getRolePermissions, assignPermission, removePermission } from '../store/roleThunks'
import { fetchPermissions } from '../store/permissionThunks'

const schema = Yup.object({ name: Yup.string().trim().min(2, 'Min 2 characters').required('Required'), description: Yup.string() })

function Roles() {
  const dispatch = useDispatch()
  const { roles, loading } = useSelector((s) => s.roles)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selected, setSelected] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const [permOpen, setPermOpen] = useState(false)
  const [permRole, setPermRole] = useState(null)
  const [allPermissions, setAllPermissions] = useState([])
  const [selPerms, setSelPerms] = useState(new Set())
  const basePerms = useRef([])

  useEffect(() => { dispatch(fetchRoles()) }, [dispatch])

  const filtered = roles.filter((r) => `${r.name} ${r.description}`.toLowerCase().includes(search.toLowerCase()))
  const openModal = (mode, row = null) => { setModalMode(mode); setSelected(row); setModalOpen(true) }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (modalMode === 'create') { await dispatch(createRole(values)).unwrap(); toast.success('Role created') }
      else { await dispatch(updateRole({ id: selected.id, ...values })).unwrap(); toast.success('Role updated') }
      setModalOpen(false)
    } catch (err) { toast.error(err.message || 'Failed') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    try { await dispatch(deleteRole(selected.id)).unwrap(); toast.success('Role deleted'); setConfirmOpen(false) }
    catch (err) { toast.error(err.message || 'Failed') }
  }

  const openPermModal = async (role) => {
    setPermRole(role)
    try {
      const perms = await dispatch(fetchPermissions()).unwrap()
      setAllPermissions(perms)
      const current = await dispatch(getRolePermissions(role.id)).unwrap()
      const ids = current.map((p) => p.id)
      basePerms.current = ids
      setSelPerms(new Set(ids))
      setPermOpen(true)
    } catch (err) { toast.error(err.message || 'Failed') }
  }

  const togglePerm = (id) => {
    setSelPerms((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSavePerms = async () => {
    setPermSaving(true)
    const toAdd = [...selPerms].filter((id) => !basePerms.current.includes(id))
    const toRemove = basePerms.current.filter((id) => !selPerms.has(id))
    try {
      await Promise.all([
        ...toAdd.map((id) => dispatch(assignPermission({ roleId: permRole.id, permissionId: id })).unwrap()),
        ...toRemove.map((id) => dispatch(removePermission({ roleId: permRole.id, permissionId: id })).unwrap()),
      ])
      toast.success('Permissions updated')
      setPermOpen(false)
    } catch (err) { toast.error(err.message || 'Failed') }
    finally { setPermSaving(false) }
  }

  const [permSaving, setPermSaving] = useState(false)

  const toggleAll = () => {
    setSelPerms((prev) => prev.size === allPermissions.length ? new Set() : new Set(allPermissions.map((p) => p.id)))
  }

  const columns = [
    { key: 'name', label: 'Role', render: (val) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-white/[0.06] flex items-center justify-center shrink-0"><FiKey className="w-4 h-4 text-amber-400" /></div>
        <span className="text-white font-semibold text-sm">{val}</span>
      </div>
    )},
    { key: 'description', label: 'Description', render: (val) => (
      <span className="text-gray-400 text-sm">{val || '-'}</span>
    )},
    { key: 'id', label: '', render: (_, row) => (
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button onClick={(e) => { e.stopPropagation(); openPermModal(row) }} className="p-1.5 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer" title="Manage Permissions"><FiShield className="w-3.5 h-3.5" /></button>
        <button onClick={(e) => { e.stopPropagation(); openModal('edit', row) }} className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all cursor-pointer" title="Edit"><FiEdit2 className="w-3.5 h-3.5" /></button>
        <button onClick={(e) => { e.stopPropagation(); setSelected(row); setConfirmOpen(true) }} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer" title="Delete"><FiTrash2 className="w-3.5 h-3.5" /></button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Roles" subtitle="Define access levels" icon={FiKey} actionLabel="Add Role" onAction={() => openModal('create')} actionIcon={FiPlus} />
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 max-w-sm"><SearchBar value={search} onChange={setSearch} placeholder="Search roles..." /></div>
      </div>

      {loading && roles.length === 0 ? <LoadingSpinner /> : filtered.length === 0 ? <EmptyState title="No roles found" description="Create your first role." /> : (
        <DataTable columns={columns} data={filtered} onRowClick={(row) => openModal('edit', row)} paginated pageSize={8} resetKey={search} exportable exportFilename="roles" />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalMode === 'create' ? 'Add Role' : 'Edit Role'} subtitle={modalMode === 'create' ? 'Create a new access role.' : `Editing ${selected?.name}`}>
        <Formik initialValues={{ name: selected?.name || '', description: selected?.description || '' }} validationSchema={schema} onSubmit={handleSubmit} enableReinitialize>
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <FormField name="name" label="Role Name" placeholder="e.g. ADMIN" />
              <FormField name="description" label="Description" as="textarea" placeholder="What this role can do" />
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50">{isSubmitting ? 'Saving...' : modalMode === 'create' ? 'Create' : 'Save Changes'}</button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      <Modal isOpen={permOpen} onClose={() => setPermOpen(false)} title="Manage Permissions" subtitle={`Assign permissions to ${permRole?.name || ''}`}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-400">{selPerms.size} of {allPermissions.length} selected</span>
          <button type="button" onClick={toggleAll} className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer">{selPerms.size === allPermissions.length ? 'Clear all' : 'Select all'}</button>
        </div>
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
          {allPermissions.map((p) => (
            <label key={p.id} className="flex items-start gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05] cursor-pointer transition-colors">
              <input type="checkbox" checked={selPerms.has(p.id)} onChange={() => togglePerm(p.id)} className="w-4 h-4 accent-amber-500 cursor-pointer mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-mono font-semibold text-white">{p.name}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{p.description || '-'}</p>
              </div>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button type="button" onClick={() => setPermOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-all cursor-pointer">Cancel</button>
          <button type="button" onClick={handleSavePerms} disabled={permSaving} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 rounded-xl transition-all duration-300 shadow-lg shadow-amber-600/20 cursor-pointer disabled:opacity-50">{permSaving ? 'Saving...' : 'Save Permissions'}</button>
        </div>
      </Modal>

      <ConfirmModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Role" message={`Delete "${selected?.name}"? Users with this role will retain access until reassigned.`} />
    </div>
  )
}

export default Roles