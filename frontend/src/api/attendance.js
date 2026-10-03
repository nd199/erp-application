import api from './axios'
import { isDevMode } from '../lib/devMode'
import { fakeAttendance } from '../lib/fakeData'
import { mockList, mockCreate, mockUpdate, mockDelete } from '../lib/mockApi'

const store = [...fakeAttendance]

export const attendanceAPI = {
  getAll: (params) => isDevMode() ? mockList(store, params) : api.get('/attendance', { params }),
  getById: (id) => isDevMode()
    ? Promise.resolve({ data: store.find((a) => a.id === id) })
    : api.get(`/attendance/${id}`),
  create: (data) => isDevMode() ? mockCreate(store, data) : api.post('/attendance', data),
  update: (id, data) => isDevMode() ? mockUpdate(store, id, data) : api.patch(`/attendance/${id}`, data),
  delete: (id) => isDevMode() ? mockDelete(store, id) : api.delete(`/attendance/${id}`),
  search: (keyword, params) => isDevMode()
    ? mockList(store.filter((a) =>
        `${a.employeeName} ${a.status}`.toLowerCase().includes(keyword.toLowerCase())
      ))
    : api.get('/attendance/search', { params: { keyword, ...params } }),
}
