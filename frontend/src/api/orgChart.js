import api from './axios'
import { isDevMode } from '../lib/devMode'
import { fakeOrgChart } from '../lib/fakeData'
import { mockResponse } from '../lib/mockApi'

export const orgChartAPI = {
  getOrgChart: () => isDevMode()
    ? mockResponse(fakeOrgChart)
    : api.get('/employees/org-chart'),
}
