import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { FiShield, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import FormField from '../components/FormField'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { fetchPermissions, createPermission, updatePermission, deletePermission } from '../store/permissionThunks'

const schema = Yup.object({ name: Yup.string().trim().required('Required'), description: Yup.string() })

function Permissions() {
  const dispatch = useDispatch()
  const { permissions, loading } = useSelector((s) => s.permissions)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selected, setSelected] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => { dispatch(fetchPermissions()) }, [dispatch])

  const filtered = permissions.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase()))
  const openModal = (mode, row = null) => { setModalMode(mode); setSelected(row); setModalOpen(true) }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (modalMode === 'create') { await dispatch(createPermission(values)).unwrap(); toast.success('Permission created') }
      else { await dispatch(updatePermission({ id: selected.id, ...values })).unwrap(); toast.success('Permission updated') }
      setModalOpen(false)
    } catch (err) { toast.error(err.message || 'Failed') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    try { await dispatch(deletePermission(selected.id)).unwrap(); toast.success('Permission deleted'); setConfirmOpen(false) }
    catch (err) { toast.error(err.message || 'Failed') }
  }

  const columns = [
    { key: 'name', label: 'Permission', render: (val) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-500/10 border border-white/[0.06] flex items-center justify-center shrink-0"><FiShield className="w-4 h-4 text-cyan-400" /></div>
        <span className="text-white font-mono text-xs font-medium">{val}</span>
      </div>
    )},
    { key: 'description', label: 'Description', render: (val) => <span className="text-gray-400 text-sm">{val || '-'}</span> },
    { key: 'id', label: '', render: (_, row) => (
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button onClick={(e) => { e.stopPropagation(); openModal('edit', row) }} className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all cursor-pointer"><FiEdit2 className="w-3.5 h-3.5" /></button>
        <button onClick={(e) => { e.stopPropagation(); setSelected(row); setConfirmOpen(true) }} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"><FiTrash2 className="w-3.5 h-3.5" /></button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Permissions" subtitle="Granular access control" icon={FiShield} actionLabel="Add Permission" onAction={() => openModal('create')} actionIcon={FiPlus} />
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 max-w-sm"><SearchBar value={search} onChange={setSearch} placeholder="Search permissions..." /></div>
      </div>

      {loading && permissions.length === 0 ? <LoadingSpinner /> : filtered.length === 0 ? <EmptyState title="No permissions found" description="Create your first permission." /> : (
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(row) => openModal('edit', row)}
          paginated
          pageSize={8}
          resetKey={search}
          exportable
          exportFilename="permissions"
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalMode === 'create' ? 'Add Permission' : 'Edit Permission'}>
        <Formik initialValues={{ name: selected?.name || '', description: selected?.description || '' }} validationSchema={schema} onSubmit={handleSubmit} enableReinitialize>
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <FormField name="name" label="Permission Name" placeholder="e.g. EMPLOYEE_VIEW" />
              <FormField name="description" label="Description" as="textarea" placeholder="What this permission allows" />
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50">{isSubmitting ? 'Saving...' : modalMode === 'create' ? 'Create' : 'Save Changes'}</button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      <ConfirmModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Permission" message={`Delete "${selected?.name}"? Roles using this permission will be affected.`} />
    </div>
  )
}

export default Permissions
