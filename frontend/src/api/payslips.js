import api from './axios'
import { isDevMode } from '../lib/devMode'
import { fakePayslips } from '../lib/fakeData'
import { mockList } from '../lib/mockApi'

const store = [...fakePayslips]

export const payslipsAPI = {
  getByRun: (runId, params) => isDevMode()
    ? mockList(store.filter((p) => p.payrollRunId === Number(runId)), params)
    : api.get(`/payroll-runs/${runId}/payslips`, { params }),
  getByRunAndEmployee: (runId, employeeId) => isDevMode()
    ? Promise.resolve({
        data: store.find((p) => p.payrollRunId === Number(runId) && p.employeeId === Number(employeeId)) || null,
      })
    : api.get(`/payroll-runs/${runId}/payslips/${employeeId}`),
  getMy: (params) => isDevMode()
    ? mockList(store, params)
    : api.get('/payslips/my', { params }),
}
