import api from './axios'
import { isDevMode } from '../lib/devMode'
import { fakePermissions } from '../lib/fakeData'
import { mockList, mockCreate, mockUpdate, mockDelete } from '../lib/mockApi'

const store = [...fakePermissions]

export const permissionsAPI = {
  getAll: (params) => isDevMode() ? mockList(store, params) : api.get('/permissions', { params }),
  getById: (id) => isDevMode()
    ? Promise.resolve({ data: store.find((p) => p.id === id) })
    : api.get(`/permissions/${id}`),
  create: (data) => isDevMode() ? mockCreate(store, data) : api.post('/permissions', data),
  update: (id, data) => isDevMode() ? mockUpdate(store, id, data) : api.patch(`/permissions/${id}`, data),
  delete: (id) => isDevMode() ? mockDelete(store, id) : api.delete(`/permissions/${id}`),
  search: (keyword, params) => isDevMode()
    ? mockList(store.filter((p) =>
        `${p.name} ${p.description}`.toLowerCase().includes(keyword.toLowerCase())
      ))
    : api.get('/permissions/search', { params: { keyword, ...params } }),
}
