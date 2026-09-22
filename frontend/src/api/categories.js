import api from './axios'
import { isDevMode } from '../lib/devMode'
import { fakeCategories } from '../lib/fakeData'
import { mockList, mockCreate, mockUpdate, mockDelete } from '../lib/mockApi'

const store = [...fakeCategories]

export const categoriesAPI = {
  getAll: (params) => isDevMode() ? mockList(store, params) : api.get('/product-categories', { params }),
  getById: (id) => isDevMode()
    ? Promise.resolve({ data: store.find((c) => c.id === id) })
    : api.get(`/product-categories/${id}`),
  create: (data) => isDevMode() ? mockCreate(store, data) : api.post('/product-categories', data),
  update: (id, data) => isDevMode() ? mockUpdate(store, id, data) : api.patch(`/product-categories/${id}`, data),
  delete: (id) => isDevMode() ? mockDelete(store, id) : api.delete(`/product-categories/${id}`),
  search: (keyword, params) => isDevMode()
    ? mockList(store.filter((c) => `${c.name} ${c.description}`.toLowerCase().includes(keyword.toLowerCase())))
    : api.get('/product-categories/search', { params: { keyword, ...params } }),
}
