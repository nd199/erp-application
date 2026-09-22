import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { FiTruck, FiPlus, FiTrash2, FiExternalLink } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import FormField from '../components/FormField'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { formatDateTime } from '../utils/format'
import { fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../store/supplierThunks'

const createSchema = Yup.object({
  name: Yup.string().required('Name is required').max(150, 'Max 150 characters'),
  contactPerson: Yup.string().max(100, 'Max 100 characters'),
  email: Yup.string().email('Invalid email').max(254, 'Max 254 characters'),
  phone: Yup.string().max(20, 'Max 20 characters'),
  address: Yup.string(),
  gstNumber: Yup.string().max(20, 'Max 20 characters'),
})

const PAGE_SIZE = 8

function Suppliers() {
  const dispatch = useDispatch()
  const { suppliers, loading, total } = useSelector((s) => s.suppliers)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => { setQuery(search); setPage(1) }, 350)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    const params = { page: page - 1, size: PAGE_SIZE }
    if (query) params.search = query
    dispatch(fetchSuppliers(params))
  }, [dispatch, query, page])

  const openDetail = (row) => { setSelected(row); setDetailOpen(true) }

  const openCreate = () => {
    setSelected(null)
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setSelected(row)
    setModalOpen(true)
  }

  const handleCreateUpdate = async (values, { setSubmitting }) => {
    try {
      if (selected?.id) {
        await dispatch(updateSupplier({ id: selected.id, ...values })).unwrap()
        toast.success('Supplier updated')
      } else {
        await dispatch(createSupplier(values)).unwrap()
        toast.success('Supplier created')
      }
      setModalOpen(false)
    } catch (err) { toast.error(err.message || 'Failed') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteSupplier(selected.id)).unwrap()
      toast.success('Supplier deleted')
      setConfirmOpen(false)
      if (suppliers.length === 1 && page > 1) setPage((p) => p - 1)
    } catch (err) { toast.error(err.message || 'Failed') }
  }

  const columns = [
    {
      key: 'id', label: 'Supplier', render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/15 to-purple-500/10 border border-white/[0.06] flex items-center justify-center shrink-0">
            <FiTruck className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{row.name}</p>
            <p className="text-[11px] text-gray-500">{row.contactPerson || 'No contact'}</p>
          </div>
        </div>
      ),
    },
    { key: 'email', label: 'Email', render: (val) => <span className="text-gray-300 text-sm">{val || '-'}</span> },
    { key: 'phone', label: 'Phone', render: (val) => <span className="text-gray-300 text-sm">{val || '-'}</span> },
    { key: 'gstNumber', label: 'GST', render: (val) => <span className="text-gray-300 text-sm font-mono">{val || '-'}</span> },
    {
      key: 'active', label: 'Status', render: (val) => (
        <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider border ${val ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{val ? 'Active' : 'Inactive'}</span>
      ),
    },
    {
      key: 'id', label: '', render: (_, row) => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button onClick={(e) => { e.stopPropagation(); openDetail(row) }} className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all cursor-pointer">
            <FiExternalLink className="w-3.5 h-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setSelected(row); setConfirmOpen(true) }} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer">
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Suppliers" subtitle="Manage your suppliers and vendors" icon={FiTruck} actionLabel="New Supplier" onAction={openCreate} actionIcon={FiPlus} />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex-1 min-w-[240px] max-w-sm"><SearchBar value={search} onChange={setSearch} placeholder="Search suppliers..." /></div>
      </div>

      {loading && suppliers.length === 0 ? <LoadingSpinner /> : total === 0 && !query ? (
        <EmptyState title="No suppliers found" description="Add your first supplier." />
      ) : (
        <DataTable
          columns={columns}
          data={suppliers}
          onRowClick={(row) => openDetail(row)}
          paginated
          pageSize={PAGE_SIZE}
          external
          page={page}
          totalPages={Math.ceil(total / PAGE_SIZE)}
          totalRecords={total}
          onPageChange={setPage}
          exportable
          exportFilename="suppliers"
        />
      )}

      {/* Create / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected?.id ? 'Edit Supplier' : 'New Supplier'} subtitle="Supplier details" size="lg">
        <Formik
          initialValues={{
            name: selected?.name || '',
            contactPerson: selected?.contactPerson || '',
            email: selected?.email || '',
            phone: selected?.phone || '',
            address: selected?.address || '',
            gstNumber: selected?.gstNumber || '',
          }}
          validationSchema={createSchema}
          onSubmit={handleCreateUpdate}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField name="name" label="Supplier Name" placeholder="e.g. TechParts India" />
                <FormField name="contactPerson" label="Contact Person" placeholder="e.g. Suresh Mehta" />
                <FormField name="email" label="Email" type="email" placeholder="email@example.com" />
                <FormField name="phone" label="Phone" placeholder="+91-98765-43210" />
                <FormField name="gstNumber" label="GST Number" placeholder="27AABCT1234F1Z5" />
                <FormField name="address" label="Address" as="textarea" placeholder="Full address" rows={2} />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 rounded-xl transition-all duration-300 shadow-lg shadow-violet-600/20 cursor-pointer disabled:opacity-50">{isSubmitting ? 'Saving...' : selected?.id ? 'Update Supplier' : 'Create Supplier'}</button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title={selected?.name || 'Supplier Details'} subtitle="Supplier information" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Contact Person</p>
                <p className="text-sm text-gray-300">{selected.contactPerson || '-'}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Status</p>
                <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider border ${selected.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{selected.active ? 'Active' : 'Inactive'}</span>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm text-gray-300">{selected.email || '-'}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                <p className="text-sm text-gray-300">{selected.phone || '-'}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">GST Number</p>
                <p className="text-sm text-gray-300 font-mono">{selected.gstNumber || '-'}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Created</p>
                <p className="text-sm text-gray-300">{formatDateTime(selected.createdAt)}</p>
              </div>
            </div>

            {selected.address && (
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Address</p>
                <p className="text-sm text-gray-300">{selected.address}</p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button onClick={() => { setDetailOpen(false); openEdit(selected) }} className="px-4 py-2.5 text-sm font-medium text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-xl hover:bg-violet-500/20 transition-all cursor-pointer">Edit</button>
              <button onClick={() => setDetailOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-all cursor-pointer">Close</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Supplier" message={`Delete supplier "${selected?.name}"? This action cannot be undone.`} />
    </div>
  )
}

export default Suppliers
