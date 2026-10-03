import { createAsyncThunk } from '@reduxjs/toolkit'
import { orgChartAPI } from '../api/orgChart'

const fetchOrgChart = createAsyncThunk('orgChart/fetchAll', async () => {
  const { data } = await orgChartAPI.getOrgChart()
  return Array.isArray(data) ? data : data.content || []
})

export { fetchOrgChart }
