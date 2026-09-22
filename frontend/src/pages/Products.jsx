import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { FiBox, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import FormField from '../components/FormField'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'
import { formatCurrency } from '../utils/format'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../store/productThunks'
import { fetchCategories } from '../store/categoryThunks'
import { fetchTypes } from '../store/typeThunks'

const schema = Yup.object({
  name: Yup.string().trim().min(2, 'Min 2 characters').required('Required'),
  sku: Yup.string().trim().min(3, 'Min 3 characters').required('Required'),
  description: Yup.string().trim().required('Required'),
  imageUrl: Yup.string().url('Must be a valid URL'),
  price: Yup.number().min(0, 'Cannot be negative').required('Required'),
  quantity: Yup.number().integer('Whole number').min(0, 'Cannot be negative').required('Required'),
})

function Products() {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((s) => s.products)
  const categories = useSelector((s) => s.categories.categories)
  const types = useSelector((s) => s.types.types)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selected, setSelected] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => { dispatch(fetchProducts()); dispatch(fetchCategories({ size: 100 })); dispatch(fetchTypes({ size: 100 })) }, [dispatch])

  const filtered = products.filter((p) => `${p.name} ${p.sku} ${p.description} ${p.categoryName || ''} ${p.typeName || ''}`.toLowerCase().includes(search.toLowerCase()))
  const openModal = (mode, row = null) => { setModalMode(mode); setSelected(row); setModalOpen(true) }

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = { ...values, active: values.active === 'true' || values.active === true, categoryId: values.categoryId ? Number(values.categoryId) : null, typeId: values.typeId ? Number(values.typeId) : null }
    try {
      if (modalMode === 'create') { await dispatch(createProduct(payload)).unwrap(); toast.success('Product created') }
      else { await dispatch(updateProduct({ id: selected.id, ...payload })).unwrap(); toast.success('Product updated') }
      setModalOpen(false)
    } catch (err) { toast.error(err.message || 'Failed') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    try { await dispatch(deleteProduct(selected.id)).unwrap(); toast.success('Product deleted'); setConfirmOpen(false) }
    catch (err) { toast.error(err.message || 'Failed') }
  }

  const columns = [
    { key: 'name', label: 'Product', render: (val, row) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-500/10 border border-white/[0.06] flex items-center justify-center overflow-hidden shrink-0">
          {row.imageUrl ? <img src={row.imageUrl} alt={val} className="w-full h-full object-cover" /> : <FiBox className="w-4 h-4 text-cyan-400" />}
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{val}</p>
          <p className="text-[11px] text-gray-500">{row.sku}</p>
        </div>
      </div>
    )},
    { key: 'categoryName', label: 'Category', render: (val) => <span className="text-gray-300 text-sm">{val || '-'}</span> },
    { key: 'typeName', label: 'Type', render: (val) => <span className="text-gray-300 text-sm">{val || '-'}</span> },
    { key: 'price', label: 'Price', align: 'right', render: (val) => <span className="text-gray-300 text-sm tabular-nums">{formatCurrency(val)}</span> },
    { key: 'quantity', label: 'Stock', align: 'right', render: (val) => (
      <span className={`text-sm tabular-nums font-medium ${val === 0 ? 'text-red-400' : val < 10 ? 'text-amber-400' : 'text-gray-300'}`}>{val}</span>
    )},
    { key: 'active', label: 'Status', render: (val) => <StatusBadge status={val ? 'ACTIVE' : 'INACTIVE'} /> },
    { key: 'id', label: '', render: (_, row) => (
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button onClick={(e) => { e.stopPropagation(); openModal('edit', row) }} className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all cursor-pointer"><FiEdit2 className="w-3.5 h-3.5" /></button>
        <button onClick={(e) => { e.stopPropagation(); setSelected(row); setConfirmOpen(true) }} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"><FiTrash2 className="w-3.5 h-3.5" /></button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Products" subtitle="Manage your inventory catalog" icon={FiBox} actionLabel="Add Product" onAction={() => openModal('create')} actionIcon={FiPlus} />
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 max-w-sm"><SearchBar value={search} onChange={setSearch} placeholder="Search products..." /></div>
      </div>

      {loading && products.length === 0 ? <LoadingSpinner /> : filtered.length === 0 ? <EmptyState title="No products found" description="Create your first product." /> : (
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(row) => openModal('edit', row)}
          paginated
          pageSize={8}
          resetKey={search}
          exportable
          exportFilename="products"
          filters={[
            { key: 'active', label: 'Status', getValue: (row) => row.active, valueLabel: (v) => (v ? 'Active' : 'Inactive') },
            { key: 'categoryName', label: 'Category', getValue: (row) => row.categoryName, valueLabel: (v) => v },
          ]}
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalMode === 'create' ? 'Add Product' : 'Edit Product'} subtitle={modalMode === 'create' ? 'Create a new product.' : `Editing ${selected?.name}`} size="lg">
        <Formik
          initialValues={{
            name: selected?.name || '',
            sku: selected?.sku || '',
            description: selected?.description || '',
            imageUrl: selected?.imageUrl || '',
            price: selected?.price ?? '',
            quantity: selected?.quantity ?? '',
            active: selected ? String(selected.active) : 'true',
            categoryId: selected?.categoryId ?? '',
            typeId: selected?.typeId ?? '',
          }}
          validationSchema={schema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField name="name" label="Product Name" placeholder="e.g. Wireless Mouse" />
                <FormField name="sku" label="SKU" placeholder="e.g. MS-1001" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Category</label>
                  <FormField name="categoryId" as="select" options={[{ value: '', label: 'None' }, ...categories.map((c) => ({ value: String(c.id), label: c.name }))]} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Type</label>
                  <FormField name="typeId" as="select" options={[{ value: '', label: 'None' }, ...types.map((t) => ({ value: String(t.id), label: t.name }))]} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField name="price" label="Price" type="number" placeholder="0.00" />
                <FormField name="quantity" label="Stock Quantity" type="number" placeholder="0" />
                <FormField name="active" label="Status" as="select" options={[{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }]} />
              </div>
              <FormField name="imageUrl" label="Image URL" placeholder="https://..." />
              <FormField name="description" label="Description" as="textarea" placeholder="Product details" rows={3} />
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-600/20 cursor-pointer disabled:opacity-50">{isSubmitting ? 'Saving...' : modalMode === 'create' ? 'Create' : 'Save Changes'}</button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      <ConfirmModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Product" message={`Delete "${selected?.name}"? This cannot be undone.`} />
    </div>
  )
}

export default Products
