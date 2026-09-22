import api from './axios'
import { isDevMode } from '../lib/devMode'
import { fakeOrders } from '../lib/fakeData'
import { mockList, mockCreate, mockUpdate, mockDelete } from '../lib/mockApi'

const store = [...fakeOrders]

export const salesOrdersAPI = {
  getAll: (params) => isDevMode() ? mockList(store, params) : api.get('/orders', { params }),
  getById: (id) => isDevMode()
    ? Promise.resolve({ data: store.find((o) => o.id === id) })
    : api.get(`/orders/${id}`),
  create: (data) => isDevMode() ? mockCreate(store, data) : api.post('/orders', data),
  updateStatus: (id, status) => isDevMode()
    ? mockUpdate(store, id, { status })
    : api.patch(`/orders/${id}/status`, null, { params: { status } }),
  update: (id, data) => isDevMode() ? mockUpdate(store, id, data) : api.patch(`/orders/${id}`, data),
  delete: (id) => isDevMode() ? mockDelete(store, id) : api.delete(`/orders/${id}`),
  search: (keyword, params) => isDevMode()
    ? mockList(store.filter((o) =>
        `${o.userName} ${o.notes} ${o.status}`.toLowerCase().includes(keyword.toLowerCase())
      ))
    : api.get('/orders/search', { params: { keyword, ...params } }),
  getByUser: (userId, params) => isDevMode()
    ? mockList(store.filter((o) => o.userId === userId))
    : api.get(`/orders/user/${userId}`, { params }),
  getMyOrders: (params) => isDevMode()
    ? mockList(store)
    : api.get('/orders/my-orders', { params }),
}
