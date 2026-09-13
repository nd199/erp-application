import api from './axios'
import { isDevMode } from '../lib/devMode'
import { fakeUsers } from '../lib/fakeData'
import { mockList, mockCreate, mockUpdate, mockDelete } from '../lib/mockApi'

const store = [...fakeUsers]

export const usersAPI = {
  getAll: (params) => isDevMode() ? mockList(store, params) : api.get('/users', { params }),
  getById: (id) => isDevMode()
    ? Promise.resolve({ data: store.find((u) => u.id === id) })
    : api.get(`/users/${id}`),
  create: (data) => isDevMode() ? mockCreate(store, data) : api.post('/users', data),
  update: (id, data) => isDevMode() ? mockUpdate(store, id, data) : api.patch(`/users/${id}`, data),
  delete: (id) => isDevMode() ? mockDelete(store, id) : api.delete(`/users/${id}`),
  activate: (id) => isDevMode()
    ? mockUpdate(store, id, { status: 'ACTIVE' })
    : api.patch(`/users/${id}/activate`),
  deactivate: (id) => isDevMode()
    ? mockUpdate(store, id, { status: 'INACTIVE' })
    : api.patch(`/users/${id}/deactivate`),
  lock: (id) => isDevMode()
    ? mockUpdate(store, id, { status: 'LOCKED' })
    : api.patch(`/users/${id}/lock`),
  unlock: (id) => isDevMode()
    ? mockUpdate(store, id, { status: 'ACTIVE' })
    : api.patch(`/users/${id}/unlock`),
  getRoles: (userId) => isDevMode()
    ? Promise.resolve({ data: store.find((u) => u.id === userId)?.roles || [] })
    : api.get(`/users/${userId}/roles`),
  assignRole: (userId, roleId) => isDevMode()
    ? Promise.resolve({ data: { userId, roleId } })
    : api.post(`/users/${userId}/roles/${roleId}`),
  removeRole: (userId, roleId) => isDevMode()
    ? Promise.resolve({ data: { userId, roleId } })
    : api.delete(`/users/${userId}/roles/${roleId}`),
  search: (keyword, params) => isDevMode()
    ? mockList(store.filter((u) =>
        `${u.username} ${u.email}`.toLowerCase().includes(keyword.toLowerCase())
      ))
    : api.get('/users/search', { params: { keyword, ...params } }),
}
