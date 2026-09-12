import api from './axios'

export const permissionsAPI = {
  getAll: (params) => api.get('/permissions', { params }),
  getById: (id) => api.get(`/permissions/${id}`),
  create: (data) => api.post('/permissions', data),
  update: (id, data) => api.patch(`/permissions/${id}`, data),
  delete: (id) => api.delete(`/permissions/${id}`),
  search: (keyword, params) => api.get('/permissions/search', { params: { keyword, ...params } }),
}
