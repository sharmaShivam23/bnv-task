import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchUsers, deleteUser, getCSVExportUrl } from '../../api/userApi'
import { useToast } from '../../hooks/useToast'
import Pagination from '../../components/Pagination/Pagination'
import StatusDropdown from '../../components/StatusDropdown/StatusDropdown'
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal'
import DashboardStats from '../../components/DashboardStats/DashboardStats'
import './UserList.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const UserList = () => {
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [users, setUsers]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage]             = useState(1)
  const [meta, setMeta]             = useState({ total: 0, totalPages: 1 })
  const [deleteTarget, setDeleteTarget] = useState(null)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchUsers({ page, limit: 10, search })
      setUsers(res.data || [])
      setMeta(res.meta || { total: 0, totalPages: 1 })
    } catch (err) {
      addToast(err.message || 'Failed to load users', 'error')
    } finally {
      setLoading(false)
    }
  }, [page, search, addToast])

  useEffect(() => { loadUsers() }, [loadUsers])

  const handleSearch = () => {
    setPage(1)
    setSearch(searchInput.trim())
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleStatusChange = (userId, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
    )
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      await deleteUser(deleteTarget._id)
      addToast(`User "${deleteTarget.firstName} ${deleteTarget.lastName}" deleted`, 'success')
      setDeleteTarget(null)
      loadUsers()
    } catch (err) {
      addToast(err.message || 'Failed to delete user', 'error')
      setDeleteTarget(null)
    }
  }

  const handleExportCSV = () => {
    const url = getCSVExportUrl(search)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `users-export.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    addToast('CSV export started', 'info')
  }

  const getProfileSrc = (filename) =>
    filename ? `http://localhost:5000/uploads/${filename}` : null

  const getInitials = (firstName, lastName) =>
    `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()

  const serialNo = (idx) => (page - 1) * 10 + idx + 1

  return (
    <div className="user-list-page">
      <div className="container">
        <DashboardStats />
        {/* ── Toolbar ── */}
        <div className="toolbar">
          <div className="toolbar-search">
            <input
              id="search-input"
              type="text"
              className="form-control search-input"
              placeholder="Search by name, email, mobile..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search users"
            />
            <button id="search-btn" className="btn btn-primary" onClick={handleSearch}>
              Search
            </button>
          </div>
          <div className="toolbar-actions">
            <button id="add-user-btn" className="btn btn-primary" onClick={() => navigate('/users/add')}>
              + Add User
            </button>
            <button id="export-csv-btn" className="btn btn-primary" onClick={handleExportCSV}>
              Export To CSV
            </button>
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="card table-card">
          {loading ? (
            <div className="table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Full Name</th><th>Email</th><th>Gender</th><th>Status</th><th>Profile</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map(i => (
                    <tr key={i} className="table-row">
                      <td><div className="skeleton-title" style={{width: '30px', height: '14px'}}></div></td>
                      <td><div className="skeleton-title" style={{width: '120px', height: '14px'}}></div></td>
                      <td><div className="skeleton-title" style={{width: '150px', height: '14px'}}></div></td>
                      <td><div className="skeleton-title" style={{width: '40px', height: '14px'}}></div></td>
                      <td><div className="skeleton-value" style={{width: '80px', height: '28px'}}></div></td>
                      <td><div className="skeleton-value" style={{width: '36px', height: '36px', borderRadius: '50%'}}></div></td>
                      <td><div className="skeleton-title" style={{width: '80px', height: '14px'}}></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <h3>No users found</h3>
              <p>{search ? `No results for "${search}". Try a different search.` : 'Get started by adding your first user.'}</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="users-table" aria-label="Users table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Status</th>
                    <th>Profile</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={user._id} className="table-row">
                      <td className="td-id">{serialNo(idx)}</td>
                      <td className="td-name">{user.firstName} {user.lastName}</td>
                      <td className="td-email">{user.email}</td>
                      <td className="td-gender">{user.gender === 'Male' ? 'M' : 'F'}</td>
                      <td className="td-status">
                        <StatusDropdown
                          userId={user._id}
                          currentStatus={user.status}
                          onStatusChange={handleStatusChange}
                        />
                      </td>
                      <td className="td-profile">
                        {getProfileSrc(user.profileImage) ? (
                          <img
                            src={getProfileSrc(user.profileImage)}
                            alt={`${user.firstName}'s profile`}
                            className="avatar"
                            width="36"
                            height="36"
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        ) : (
                          <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: '0.75rem' }}>
                            {getInitials(user.firstName, user.lastName)}
                          </div>
                        )}
                      </td>
                      <td className="td-action">
                        <div className="action-buttons">
                          <button
                            id={`view-btn-${user._id}`}
                            className="action-icon-btn view-btn"
                            onClick={() => navigate(`/users/${user._id}`)}
                            title="View"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          </button>
                          <button
                            id={`edit-btn-${user._id}`}
                            className="action-icon-btn edit-btn"
                            onClick={() => navigate(`/users/${user._id}/edit`)}
                            title="Edit"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </button>
                          <button
                            id={`delete-btn-${user._id}`}
                            className="action-icon-btn delete-btn"
                            onClick={() => setDeleteTarget(user)}
                            title="Delete"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Pagination ── */}
          {!loading && users.length > 0 && (
            <div className="table-footer">
              <span className="table-count">
                Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, meta.total)} of {meta.total} users
              </span>
              <Pagination
                currentPage={page}
                totalPages={meta.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Delete Confirmation ── */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.firstName} ${deleteTarget?.lastName}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

export default UserList
