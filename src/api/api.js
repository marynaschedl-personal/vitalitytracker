import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Daily Reports
export const dailyReportApi = {
  getAll: () => api.get('/daily-reports'),
  getByDate: (date) => api.get(`/daily-reports/${date}`),
  create: (data) => api.post('/daily-reports', data),
  update: (id, data) => api.put(`/daily-reports/${id}`, data),
  delete: (id) => api.delete(`/daily-reports/${id}`)
}

// Food Items
export const foodItemApi = {
  getAll: () => api.get('/food-items'),
  getById: (id) => api.get(`/food-items/${id}`),
  create: (data) => api.post('/food-items', data),
  update: (id, data) => api.put(`/food-items/${id}`, data),
  delete: (id) => api.delete(`/food-items/${id}`)
}

// Measurements
export const measurementApi = {
  getAll: () => api.get('/measurements'),
  getById: (id) => api.get(`/measurements/${id}`),
  create: (data) => api.post('/measurements', data),
  update: (id, data) => api.put(`/measurements/${id}`, data),
  delete: (id) => api.delete(`/measurements/${id}`)
}

export default api
