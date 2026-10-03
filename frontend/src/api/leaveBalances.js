import api from './axios'
import { isDevMode } from '../lib/devMode'
import { fakeLeaveBalances } from '../lib/fakeData'
import { mockList, mockCreate, mockUpdate, mockDelete } from '../lib/mockApi'

const store = [...fakeLeaveBalances]

export const leaveBalancesAPI = {
  getAll: (params) => isDevMode() ? mockList(store, params) : api.get('/leave-balances', { params }),
  getMy: (params) => isDevMode() ? mockList(store, params) : api.get('/leave-balances/my', { params }),
  create: (data) => isDevMode() ? mockCreate(store, data) : api.post('/leave-balances', data),
  update: (id, data) => isDevMode() ? mockUpdate(store, id, data) : api.patch(`/leave-balances/${id}`, data),
  delete: (id) => isDevMode() ? mockDelete(store, id) : api.delete(`/leave-balances/${id}`),
}
