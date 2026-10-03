import { createSlice } from '@reduxjs/toolkit'
import { fetchOrgChart } from './orgChartThunks.js'

const pending = (state) => {
  state.loading = true
  state.error = null
}
const rejected = (state, action) => {
  state.loading = false
  state.error = action.error.message
}

const orgChartSlice = createSlice({
  name: 'orgChart',
  initialState: {
    nodes: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearOrgChartErrors: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrgChart.pending, pending)
      .addCase(fetchOrgChart.fulfilled, (state, action) => {
        state.loading = false
        state.nodes = action.payload
      })
      .addCase(fetchOrgChart.rejected, rejected)
  },
})

export const { clearOrgChartErrors } = orgChartSlice.actions
export default orgChartSlice.reducer
