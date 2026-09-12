import api from './axios'

export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.patch(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  activate: (id) => api.patch(`/users/${id}/activate`),
  deactivate: (id) => api.patch(`/users/${id}/deactivate`),
  lock: (id) => api.patch(`/users/${id}/lock`),
  unlock: (id) => api.patch(`/users/${id}/unlock`),
  getRoles: (userId) => api.get(`/users/${userId}/roles`),
  assignRole: (userId, roleId) => api.post(`/users/${userId}/roles/${roleId}`),
  removeRole: (userId, roleId) => api.delete(`/users/${userId}/roles/${roleId}`),
  search: (keyword, params) => api.get('/users/search', { params: { keyword, ...params } }),
}
