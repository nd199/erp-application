import api from './axios'
import { isDevMode } from '../lib/devMode'
import { fakeEmployees } from '../lib/fakeData'
import { mockList, mockCreate, mockUpdate, mockDelete } from '../lib/mockApi'

const store = [...fakeEmployees]

export const employeesAPI = {
  getAll: (params) => isDevMode() ? mockList(store, params) : api.get('/employees', { params }),
  getById: (id) => isDevMode()
    ? Promise.resolve({ data: store.find((e) => e.id === id) })
    : api.get(`/employees/${id}`),
  create: (data) => isDevMode() ? mockCreate(store, data) : api.post('/employees', data),
  update: (id, data) => isDevMode() ? mockUpdate(store, id, data) : api.patch(`/employees/${id}`, data),
  delete: (id) => isDevMode() ? mockDelete(store, id) : api.delete(`/employees/${id}`),
  search: (keyword, params) => isDevMode()
    ? mockList(store.filter((e) =>
        `${e.firstName} ${e.lastName} ${e.email}`.toLowerCase().includes(keyword.toLowerCase())
      ))
    : api.get('/employees/search', { params: { keyword, ...params } }),
  getByDepartment: (deptId, params) => isDevMode()
    ? mockList(store.filter((e) => e.department?.id === deptId))
    : api.get(`/employees/department/${deptId}`, { params }),
}
