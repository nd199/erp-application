import api from './axios'
import { isDevMode } from '../lib/devMode'
import { fakeProducts } from '../lib/fakeData'
import { mockList, mockCreate, mockUpdate, mockDelete } from '../lib/mockApi'

const store = [...fakeProducts]

export const productsAPI = {
  getAll: (params) => isDevMode() ? mockList(store, params) : api.get('/products', { params }),
  getById: (id) => isDevMode()
    ? Promise.resolve({ data: store.find((p) => p.id === id) })
    : api.get(`/products/${id}`),
  create: (data) => isDevMode() ? mockCreate(store, data) : api.post('/products', data),
  update: (id, data) => isDevMode() ? mockUpdate(store, id, data) : api.patch(`/products/${id}`, data),
  delete: (id) => isDevMode() ? mockDelete(store, id) : api.delete(`/products/${id}`),
  search: (keyword, params) => isDevMode()
    ? mockList(store.filter((p) =>
        `${p.name} ${p.sku} ${p.description}`.toLowerCase().includes(keyword.toLowerCase())
      ))
    : api.get('/products/search', { params: { keyword, ...params } }),
}