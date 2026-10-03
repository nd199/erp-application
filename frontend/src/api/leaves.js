import api from './axios'
import { isDevMode } from '../lib/devMode'
import { fakeLeaveRequests } from '../lib/fakeData'
import { mockList, mockCreate, mockUpdate, mockDelete } from '../lib/mockApi'

const store = [...fakeLeaveRequests]

export const leavesAPI = {
  getAll: (params) => isDevMode() ? mockList(store, params) : api.get('/leave-requests', { params }),
  getById: (id) => isDevMode()
    ? Promise.resolve({ data: store.find((l) => l.id === id) })
    : api.get(`/leave-requests/${id}`),
  create: (data) => isDevMode() ? mockCreate(store, data) : api.post('/leave-requests', data),
  update: (id, data) => isDevMode() ? mockUpdate(store, id, data) : api.patch(`/leave-requests/${id}`, data),
  delete: (id) => isDevMode() ? mockDelete(store, id) : api.delete(`/leave-requests/${id}`),
  updateStatus: (id, data) => isDevMode()
    ? mockUpdate(store, id, data)
    : api.patch(`/leave-requests/${id}/status`, data),
  search: (keyword, params) => isDevMode()
    ? mockList(store.filter((l) =>
        `${l.employeeName} ${l.leaveType} ${l.reason}`.toLowerCase().includes(keyword.toLowerCase())
      ))
    : api.get('/leave-requests/search', { params: { keyword, ...params } }),
}
