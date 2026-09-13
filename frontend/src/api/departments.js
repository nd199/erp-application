import api from './axios'
import { isDevMode } from '../lib/devMode'
import { fakeDepartments } from '../lib/fakeData'
import { mockList, mockCreate, mockUpdate, mockDelete } from '../lib/mockApi'

const store = [...fakeDepartments]

export const departmentsAPI = {
  getAll: (params) => isDevMode() ? mockList(store, params) : api.get('/departments', { params }),
  getById: (id) => isDevMode()
    ? Promise.resolve({ data: store.find((d) => d.id === id) })
    : api.get(`/departments/${id}`),
  create: (data) => isDevMode() ? mockCreate(store, data) : api.post('/departments', data),
  update: (id, data) => isDevMode() ? mockUpdate(store, id, data) : api.patch(`/departments/${id}`, data),
  delete: (id) => isDevMode() ? mockDelete(store, id) : api.delete(`/departments/${id}`),
  search: (keyword, params) => isDevMode()
    ? mockList(store.filter((d) =>
        `${d.name} ${d.description}`.toLowerCase().includes(keyword.toLowerCase())
      ))
    : api.get('/departments/search', { params: { keyword, ...params } }),
}
