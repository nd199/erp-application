import { createAsyncThunk } from '@reduxjs/toolkit'
import { payslipsAPI } from '../api/payslips'

const fetchPayslipsByRun = createAsyncThunk('payslips/fetchByRun', async (runId) => {
  const { data } = await payslipsAPI.getByRun(runId)
  return Array.isArray(data) ? data : data.content || []
})

const fetchPayslipDetail = createAsyncThunk(
  'payslips/fetchDetail',
  async ({ runId, employeeId }) => {
    const { data } = await payslipsAPI.getByRunAndEmployee(runId, employeeId)
    return data
  }
)

const fetchMyPayslips = createAsyncThunk('payslips/fetchMy', async (params) => {
  const { data } = await payslipsAPI.getMy(params)
  if (Array.isArray(data)) {
    const { year = '' } = params || {}
    let rows = [...data]
    if (year) rows = rows.filter((p) => p.periodYear === Number(year))
    return { rows, total: rows.length }
  }
  return { rows: data.content, total: data.totalElements }
})

export { fetchPayslipsByRun, fetchPayslipDetail, fetchMyPayslips }
