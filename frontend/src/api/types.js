import api from './axios'
import { isDevMode } from '../lib/devMode'
import { fakeTypes } from '../lib/fakeData'
import { mockList, mockCreate, mockUpdate, mockDelete } from '../lib/mockApi'

const store = [...fakeTypes]

export const typesAPI = {
  getAll: (params) => isDevMode() ? mockList(store, params) : api.get('/product-types', { params }),
  getById: (id) => isDevMode()
    ? Promise.resolve({ data: store.find((t) => t.id === id) })
    : api.get(`/product-types/${id}`),
  create: (data) => isDevMode() ? mockCreate(store, data) : api.post('/product-types', data),
  update: (id, data) => isDevMode() ? mockUpdate(store, id, data) : api.patch(`/product-types/${id}`, data),
  delete: (id) => isDevMode() ? mockDelete(store, id) : api.delete(`/product-types/${id}`),
  search: (keyword, params) => isDevMode()
    ? mockList(store.filter((t) => `${t.name} ${t.description}`.toLowerCase().includes(keyword.toLowerCase())))
    : api.get('/product-types/search', { params: { keyword, ...params } }),
}
