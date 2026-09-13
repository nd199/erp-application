import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { FiKey, FiPlus, FiShield } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { fetchRoles, createRole } from '../store/roleThunks'

const schema = Yup.object({ name: Yup.string().trim().required('Required'), description: Yup.string() })

function Roles() {
  const dispatch = useDispatch()
  const { roles, loading } = useSelector((s) => s.roles)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => { dispatch(fetchRoles()) }, [dispatch])

  const filtered = roles.filter((r) => `${r.name} ${r.description}`.toLowerCase().includes(search.toLowerCase()))

  const handleSubmit = async (values, { setSubmitting }) => {
    try { await dispatch(createRole(values)).unwrap(); toast.success('Role created'); setModalOpen(false) }
    catch (err) { toast.error(err.message || 'Failed') }
    finally { setSubmitting(false) }
  }

  const columns = [
    { key: 'name', label: 'Role', render: (val) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-white/[0.06] flex items-center justify-center shrink-0"><FiKey className="w-4 h-4 text-amber-400" /></div>
        <span className="text-white font-semibold text-sm">{val}</span>
      </div>
    )},
    { key: 'description', label: 'Description', render: (val) => <span className="text-gray-400 text-sm">{val || '-'}</span> },
    { key: 'id', label: '', render: () => (
      <button onClick={(e) => { e.stopPropagation(); toast('Permissions management coming soon') }} className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" title="Manage Permissions"><FiShield className="w-3.5 h-3.5" /></button>
    )},
  ]

  return (
    <div>
      <PageHeader title="Roles" subtitle="Define access levels" icon={FiKey} actionLabel="Add Role" onAction={() => setModalOpen(true)} actionIcon={FiPlus} />
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 max-w-sm"><SearchBar value={search} onChange={setSearch} placeholder="Search roles..." /></div>
        <span className="text-[11px] text-gray-600 font-medium">{filtered.length} roles</span>
      </div>

      {loading && roles.length === 0 ? <LoadingSpinner /> : filtered.length === 0 ? <EmptyState title="No roles found" description="Create your first role." /> : (
        <DataTable columns={columns} data={filtered} />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Role" subtitle="Create a new access role.">
        <Formik initialValues={{ name: '', description: '' }} validationSchema={schema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <FormField name="name" label="Role Name" placeholder="e.g. ADMIN" />
              <FormField name="description" label="Description" as="textarea" placeholder="What this role can do" />
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50">{isSubmitting ? 'Creating...' : 'Create Role'}</button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  )
}

export default Roles
