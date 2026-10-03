import api from './axios'
import { isDevMode } from '../lib/devMode'
import { fakePayrollRuns } from '../lib/fakeData'
import { mockList, mockCreate, mockUpdate, mockDelete } from '../lib/mockApi'

const store = [...fakePayrollRuns]

export const payrollAPI = {
  getAll: (params) => isDevMode() ? mockList(store, params) : api.get('/payroll-runs', { params }),
  getById: (id) => isDevMode()
    ? Promise.resolve({ data: store.find((p) => p.id === id) })
    : api.get(`/payroll-runs/${id}`),
  create: (data) => isDevMode() ? mockCreate(store, data) : api.post('/payroll-runs', data),
  update: (id, data) => isDevMode() ? mockUpdate(store, id, data) : api.patch(`/payroll-runs/${id}`, data),
  delete: (id) => isDevMode() ? mockDelete(store, id) : api.delete(`/payroll-runs/${id}`),
  process: (id) => isDevMode()
    ? mockUpdate(store, id, { status: 'COMPLETED' })
    : api.patch(`/payroll-runs/${id}/process`),
  markPaid: (id) => isDevMode()
    ? mockUpdate(store, id, { status: 'PAID' })
    : api.patch(`/payroll-runs/${id}/paid`),
  search: (keyword, params) => isDevMode()
    ? mockList(store.filter((p) =>
        `${p.periodLabel} ${p.status} ${p.notes}`.toLowerCase().includes(keyword.toLowerCase())
      ))
    : api.get('/payroll-runs/search', { params: { keyword, ...params } }),
}
