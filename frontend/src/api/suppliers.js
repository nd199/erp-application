import api from './axios'
import { isDevMode } from '../lib/devMode'
import { fakeSuppliers } from '../lib/fakeData'
import { mockList, mockCreate, mockUpdate, mockDelete } from '../lib/mockApi'

const store = [...fakeSuppliers]

export const suppliersAPI = {
  getAll: (params) => isDevMode() ? mockList(store, params) : api.get('/suppliers', { params }),
  getById: (id) => isDevMode()
    ? Promise.resolve({ data: store.find((s) => s.id === id) })
    : api.get(`/suppliers/${id}`),
  create: (data) => isDevMode() ? mockCreate(store, data) : api.post('/suppliers', data),
  update: (id, data) => isDevMode() ? mockUpdate(store, id, data) : api.patch(`/suppliers/${id}`, data),
  delete: (id) => isDevMode() ? mockDelete(store, id) : api.delete(`/suppliers/${id}`),
  search: (keyword, params) => isDevMode()
    ? mockList(store.filter((s) =>
        `${s.name} ${s.contactPerson} ${s.email}`.toLowerCase().includes(keyword.toLowerCase())
      ))
    : api.get('/suppliers/search', { params: { keyword, ...params } }),
}
