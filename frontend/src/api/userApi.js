import axios from 'axios'


// const API_BASE =  "http://localhost:5000/api"

const API_BASE = 'https://bnv-task-awjw.onrender.com/api' || 'http://localhost:5000/api'
const api = axios.create({
  baseURL: API_BASE,
})


api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

// ─── Users API ───────────────────────────────────────────────────────────────

/** Fetch paginated & searchable user list */
export const fetchUsers = (params = {}) =>
  api.get('/users', { params }).then((r) => r.data)

/** Fetch user stats */
export const fetchUserStats = () =>
  api.get('/users/stats').then((r) => r.data)

/** Fetch single user by ID */
export const fetchUserById = (id) =>
  api.get(`/users/${id}`).then((r) => r.data)

/** Search users */
export const searchUsers = (q) =>
  api.get('/users/search', { params: { q } }).then((r) => r.data)

/** Create a new user (multipart/form-data for image upload) */
export const createUser = (formData) =>
  api.post('/users', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data)

/** Update an existing user */
export const updateUser = (id, formData) =>
  api.put(`/users/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data)

/** Delete a user */
export const deleteUser = (id) =>
  api.delete(`/users/${id}`).then((r) => r.data)

/** Toggle user status inline */
export const updateUserStatus = (id, status) =>
  api.patch(`/users/${id}/status`, { status }).then((r) => r.data)

/** Download CSV — returns a blob URL trigger */
export const getCSVExportUrl = (search = '') => {
  const params = search ? `?search=${encodeURIComponent(search)}` : ''
  return `${API_BASE}/users/export/csv${params}`
}
