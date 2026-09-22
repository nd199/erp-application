import api from './axios'
import { isDevMode } from '../lib/devMode'
import { fakePurchaseOrders } from '../lib/fakeData'
import { mockList, mockCreate, mockUpdate, mockDelete } from '../lib/mockApi'

const store = [...fakePurchaseOrders]

export const purchaseOrdersAPI = {
  getAll: (params) => isDevMode() ? mockList(store, params) : api.get('/purchase-orders', { params }),
  getById: (id) => isDevMode()
    ? Promise.resolve({ data: store.find((o) => o.id === id) })
    : api.get(`/purchase-orders/${id}`),
  create: (data) => isDevMode() ? mockCreate(store, data) : api.post('/purchase-orders', data),
  updateStatus: (id, status) => isDevMode()
    ? mockUpdate(store, id, { status })
    : api.patch(`/purchase-orders/${id}/status`, null, { params: { status } }),
  update: (id, data) => isDevMode() ? mockUpdate(store, id, data) : api.patch(`/purchase-orders/${id}`, data),
  delete: (id) => isDevMode() ? mockDelete(store, id) : api.delete(`/purchase-orders/${id}`),
  search: (keyword, params) => isDevMode()
    ? mockList(store.filter((o) =>
        `${o.supplierName} ${o.notes} ${o.status}`.toLowerCase().includes(keyword.toLowerCase())
      ))
    : api.get('/purchase-orders/search', { params: { keyword, ...params } }),
  getByUser: (userId, params) => isDevMode()
    ? mockList(store.filter((o) => o.userId === userId))
    : api.get(`/purchase-orders/user/${userId}`, { params }),
  getMyOrders: (params) => isDevMode()
    ? mockList(store)
    : api.get('/purchase-orders/my-orders', { params }),
}
