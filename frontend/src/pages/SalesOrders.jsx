import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { FiShoppingCart, FiPlus, FiTrash2, FiExternalLink } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import FormField from '../components/FormField'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { formatCurrency, formatDateTime } from '../utils/format'
import { fetchSalesOrders, createSalesOrder, updateSalesOrderStatus, deleteSalesOrder } from '../store/salesOrderThunks'
import { fetchProducts } from '../store/productThunks'

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const createSchema = Yup.object({
  notes: Yup.string().max(2000, 'Max 2000 characters'),
})

const PAGE_SIZE = 8

function SalesOrders() {
  const dispatch = useDispatch()
  const { orders, loading, total } = useSelector((s) => s.salesOrders)
  const products = useSelector((s) => s.products.products)
  const user = useSelector((s) => s.auth.user)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [orderItems, setOrderItems] = useState([{ productId: '', quantity: 1, unitPrice: '' }])

  useEffect(() => { dispatch(fetchProducts()) }, [dispatch])

  useEffect(() => {
    const t = setTimeout(() => { setQuery(search); setPage(1) }, 350)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    const params = { page: page - 1, size: PAGE_SIZE }
    if (query) params.search = query
    if (status) params.status = status
    dispatch(fetchSalesOrders(params))
  }, [dispatch, query, page, status])

  const openDetail = (row) => { setSelected(row); setDetailOpen(true) }

  const openCreate = () => {
    setSelected(null)
    setOrderItems([{ productId: '', quantity: 1, unitPrice: '' }])
    setModalOpen(true)
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateSalesOrderStatus({ id: orderId, status: newStatus })).unwrap()
      toast.success(`Order status updated to ${newStatus}`)
    } catch (err) { toast.error(err.message || 'Failed to update status') }
  }

  const handleCreateOrder = async (values, { setSubmitting }) => {
    const validItems = orderItems.filter((item) => item.productId && item.quantity > 0)
    if (validItems.length === 0) {
      toast.error('Add at least one item')
      setSubmitting(false)
      return
    }
    try {
      await dispatch(createSalesOrder({
        userId: user?.userId,
        notes: values.notes,
        items: validItems.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
          unitPrice: item.unitPrice ? Number(item.unitPrice) : null,
        })),
      })).unwrap()
      toast.success('Sales order created')
      setModalOpen(false)
    } catch (err) { toast.error(err.message || 'Failed to create order') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteSalesOrder(selected.id)).unwrap()
      toast.success('Order deleted')
      setConfirmOpen(false)
      if (orders.length === 1 && page > 1) setPage((p) => p - 1)
    } catch (err) { toast.error(err.message || 'Failed') }
  }

  const statusColor = (s) => {
    switch (s) {
      case 'PENDING': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'SHIPPED': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'DELIVERED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'CANCELLED': return 'bg-red-500/10 text-red-400 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const columns = [
    {
      key: 'id', label: 'Order', render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-500/10 border border-white/[0.06] flex items-center justify-center shrink-0">
            <FiShoppingCart className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">#{val}</p>
            <p className="text-[11px] text-gray-500">{row.userName || 'User ' + row.userId}</p>
          </div>
        </div>
      ),
    },
    { key: 'orderDate', label: 'Date', render: (val) => <span className="text-gray-300 text-sm">{formatDateTime(val)}</span> },
    { key: 'items', label: 'Items', render: (val) => <span className="text-gray-300 text-sm tabular-nums">{val?.length || 0}</span> },
    { key: 'totalAmount', label: 'Total', align: 'right', render: (val) => <span className="text-white font-semibold text-sm tabular-nums">{formatCurrency(val)}</span> },
    {
      key: 'status', label: 'Status', render: (val) => (
        <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider border ${statusColor(val)}`}>{val}</span>
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

  const selectCls = "bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl pl-3 pr-8 py-2.5 text-sm text-gray-300 outline-none transition-colors cursor-pointer"

  return (
    <div>
      <PageHeader title="Sales Orders" subtitle="Manage customer orders" icon={FiShoppingCart} actionLabel="New Order" onAction={openCreate} actionIcon={FiPlus} />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex-1 min-w-[240px] max-w-sm"><SearchBar value={search} onChange={setSearch} placeholder="Search orders..." /></div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className={selectCls}>
          <option value="">All Status</option>
          {statusOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {loading && orders.length === 0 ? <LoadingSpinner /> : total === 0 && !query && !status ? (
        <EmptyState title="No orders found" description="Create your first sales order." />
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          onRowClick={(row) => openDetail(row)}
          paginated
          pageSize={PAGE_SIZE}
          external
          page={page}
          totalPages={Math.ceil(total / PAGE_SIZE)}
          totalRecords={total}
          onPageChange={setPage}
          exportable
          exportFilename="sales-orders"
          filters={[{ key: 'status', label: 'Status', getValue: (row) => row.status, valueLabel: (v) => v }]}
        />
      )}

      {/* Create Order Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Sales Order" subtitle="Add items to create an order." size="lg">
        <Formik initialValues={{ notes: '' }} validationSchema={createSchema} onSubmit={handleCreateOrder}>
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Order Items</label>
                {orderItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <select
                        value={item.productId}
                        onChange={(e) => {
                          const next = [...orderItems]
                          next[idx].productId = e.target.value
                          const prod = products.find((p) => p.id === Number(e.target.value))
                          if (prod && !next[idx].unitPrice) next[idx].unitPrice = prod.price
                          setOrderItems(next)
                        }}
                        className="w-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-gray-300 outline-none"
                      >
                        <option value="">Select product</option>
                        {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <input type="number" min="1" value={item.quantity} onChange={(e) => { const next = [...orderItems]; next[idx].quantity = e.target.value; setOrderItems(next) }} placeholder="Qty" className="w-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-gray-300 outline-none" />
                    </div>
                    <div className="col-span-3">
                      <input type="number" min="0" value={item.unitPrice} onChange={(e) => { const next = [...orderItems]; next[idx].unitPrice = e.target.value; setOrderItems(next) }} placeholder="Unit price" className="w-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-gray-300 outline-none" />
                    </div>
                    <div className="col-span-2 flex gap-1">
                      {orderItems.length > 1 && (
                        <button type="button" onClick={() => setOrderItems(orderItems.filter((_, i) => i !== idx))} className="p-2.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer">
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => setOrderItems([...orderItems, { productId: '', quantity: 1, unitPrice: '' }])} className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                  <FiPlus className="w-3.5 h-3.5" /> Add item
                </button>
              </div>
              <FormField name="notes" label="Notes" as="textarea" placeholder="Order notes (optional)" rows={2} />
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-600/20 cursor-pointer disabled:opacity-50">{isSubmitting ? 'Creating...' : 'Create Order'}</button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title={`Order #${selected?.id || ''}`} subtitle="Order details and items" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Status</p>
                <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider border ${statusColor(selected.status)}`}>{selected.status}</span>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Total</p>
                <p className="text-lg font-bold text-white">{formatCurrency(selected.totalAmount)}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Date</p>
                <p className="text-sm text-gray-300">{formatDateTime(selected.orderDate)}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Customer</p>
                <p className="text-sm text-gray-300">{selected.userName || 'User ' + selected.userId}</p>
              </div>
            </div>

            {selected.notes && (
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Notes</p>
                <p className="text-sm text-gray-300">{selected.notes}</p>
              </div>
            )}

            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Items</p>
              <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {selected.items?.map((item, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2.5 text-sm text-white">{item.productName || 'Product #' + item.productId}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-300 text-right tabular-nums">{item.quantity}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-300 text-right tabular-nums">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-4 py-2.5 text-sm text-white text-right tabular-nums font-medium">{formatCurrency(item.lineTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {selected.status === 'PENDING' && (
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Update Status</p>
                <div className="flex gap-2">
                  <button onClick={() => { handleStatusChange(selected.id, 'SHIPPED'); setDetailOpen(false) }} className="px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-all cursor-pointer">Mark Shipped</button>
                  <button onClick={() => { handleStatusChange(selected.id, 'CANCELLED'); setDetailOpen(false) }} className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all cursor-pointer">Cancel Order</button>
                </div>
              </div>
            )}
            {selected.status === 'SHIPPED' && (
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Update Status</p>
                <button onClick={() => { handleStatusChange(selected.id, 'DELIVERED'); setDetailOpen(false) }} className="px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all cursor-pointer">Mark Delivered</button>
              </div>
            )}

            <div className="flex justify-end">
              <button onClick={() => setDetailOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-all cursor-pointer">Close</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Order" message={`Delete order #${selected?.id}? This action cannot be undone.`} />
    </div>
  )
}

export default SalesOrders
