import { createAsyncThunk } from '@reduxjs/toolkit'
import { payrollAPI } from '../api/payroll'

const fetchPayrollRuns = createAsyncThunk(
  'payroll/fetchAll',
  async (params) => {
    const { data } = await payrollAPI.getAll(params)
    if (Array.isArray(data)) {
      const { page = 0, size = data.length, search = '', status = '', year = '' } = params || {}
      let rows = [...data]
      if (search) {
        const q = search.toLowerCase()
        rows = rows.filter((p) =>
          `${p.periodLabel} ${p.status} ${p.notes}`.toLowerCase().includes(q)
        )
      }
      if (status) rows = rows.filter((p) => p.status === status)
      if (year) rows = rows.filter((p) => p.periodYear === Number(year))
      return { rows: rows.slice(page * size, page * size + size), total: rows.length }
    }
    return { rows: data.content, total: data.totalElements }
  }
)

const fetchPayrollRunById = createAsyncThunk('payroll/fetchById', async (id) => {
  const { data } = await payrollAPI.getById(id)
  return data
})

const createPayrollRun = createAsyncThunk('payroll/create', async (payload) => {
  const { data } = await payrollAPI.create(payload)
  return data
})

const updatePayrollRun = createAsyncThunk('payroll/update', async ({ id, ...payload }) => {
  const { data } = await payrollAPI.update(id, payload)
  return data
})

const deletePayrollRun = createAsyncThunk('payroll/delete', async (id) => {
  await payrollAPI.delete(id)
  return id
})

const processPayrollRun = createAsyncThunk('payroll/process', async (id) => {
  const { data } = await payrollAPI.process(id)
  return data
})

const markPayrollRunPaid = createAsyncThunk('payroll/markPaid', async (id) => {
  const { data } = await payrollAPI.markPaid(id)
  return data
})

const searchPayrollRun = createAsyncThunk('payroll/search', async ({ keyword, params }) => {
  const { data } = await payrollAPI.search(keyword, params)
  return data.content || data
})

export {
  fetchPayrollRuns,
  fetchPayrollRunById,
  createPayrollRun,
  updatePayrollRun,
  deletePayrollRun,
  processPayrollRun,
  markPayrollRunPaid,
  searchPayrollRun,
}
