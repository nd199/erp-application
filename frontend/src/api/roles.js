import api from './axios'
import { isDevMode } from '../lib/devMode'
import { fakeRoles } from '../lib/fakeData'
import { mockList, mockCreate, mockUpdate, mockDelete } from '../lib/mockApi'

const store = [...fakeRoles]

export const rolesAPI = {
  getAll: (params) => isDevMode() ? mockList(store, params) : api.get('/roles', { params }),
  getById: (id) => isDevMode()
    ? Promise.resolve({ data: store.find((r) => r.id === id) })
    : api.get(`/roles/${id}`),
  create: (data) => isDevMode() ? mockCreate(store, data) : api.post('/roles', data),
  update: (id, data) => isDevMode() ? mockUpdate(store, id, data) : api.patch(`/roles/${id}`, data),
  delete: (id) => isDevMode() ? mockDelete(store, id) : api.delete(`/roles/${id}`),
  search: (keyword, params) => isDevMode()
    ? mockList(store.filter((r) =>
        `${r.name} ${r.description}`.toLowerCase().includes(keyword.toLowerCase())
      ))
    : api.get('/roles/search', { params: { keyword, ...params } }),
  getPermissions: (roleId) => isDevMode()
    ? Promise.resolve({ data: store.find((r) => r.id === roleId)?.permissions || [] })
    : api.get(`/roles/${roleId}/permissions`),
  assignPermission: (roleId, permissionId) => isDevMode()
    ? Promise.resolve({ data: { roleId, permissionId } })
    : api.post(`/roles/${roleId}/permissions/${permissionId}`),
  removePermission: (roleId, permissionId) => isDevMode()
    ? Promise.resolve({ data: { roleId, permissionId } })
    : api.delete(`/roles/${roleId}/permissions/${permissionId}`),
  getUsers: (roleId) => isDevMode()
    ? Promise.resolve({ data: [] })
    : api.get(`/roles/${roleId}/users`),
}
