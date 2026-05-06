import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchUserById, deleteUser } from '../../api/userApi'
import { useToast } from '../../hooks/useToast'
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal'
import './UserView.css'

const InfoRow = ({ icon, label, value, highlight }) => (
  <div className="info-row">
    <span className="info-icon">{icon}</span>
    <div className="info-content">
      <span className="info-label">{label}</span>
      <span className={`info-value ${highlight ? 'info-value-highlight' : ''}`}>{value || '—'}</span>
    </div>
  </div>
)

const UserView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [user, setUser]             = useState(null)
  const [loading, setLoading]       = useState(true)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchUserById(id)
        setUser(res.data)
      } catch (err) {
        addToast(err.message || 'User not found', 'error')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, addToast, navigate])

  const handleDelete = async () => {
    try {
      await deleteUser(id)
      addToast('User deleted successfully', 'success')
      navigate('/')
    } catch (err) {
      addToast(err.message || 'Failed to delete user', 'error')
      setShowDelete(false)
    }
  }

  const getInitials = (u) =>
    `${u?.firstName?.[0] || ''}${u?.lastName?.[0] || ''}`.toUpperCase()

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  }) : '—'

  if (loading) {
    return (
      <div className="container">
        <div className="spinner-wrapper"><div className="spinner" /><p>Loading user details...</p></div>
      </div>
    )
  }

  if (!user) return null

  const avatarSrc = user.profileImage
    ? `http://localhost:5000/uploads/${user.profileImage}`
    : null

  return (
    <div className="user-view-page">
      <div className="container">

        {/* ── Breadcrumb ── */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <button className="breadcrumb-link" onClick={() => navigate('/')}>← Users</button>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{user.firstName} {user.lastName}</span>
        </nav>

        <div className="view-layout">

          {/* ── Profile Card ── */}
          <aside className="profile-card card">
            <div className="profile-banner" />
            <div className="profile-avatar-wrap">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={`${user.firstName}'s profile`}
                  className="profile-avatar"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                />
              ) : null}
              <div
                className="profile-avatar-placeholder"
                style={{ display: avatarSrc ? 'none' : 'flex' }}
              >
                {getInitials(user)}
              </div>
            </div>

            <div className="profile-name">{user.firstName} {user.lastName}</div>
            <div className="profile-email">{user.email}</div>

            <div className="profile-badges">
              <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                {user.status === 'Active' ? '● Active' : '○ Inactive'}
              </span>
              <span className="badge badge-warning">
                {user.gender === 'Male' ? '♂ Male' : '♀ Female'}
              </span>
            </div>

            <div className="profile-actions">
              <button
                id="edit-user-btn"
                className="btn btn-primary btn-full"
                onClick={() => navigate(`/users/${id}/edit`)}
              >
                ✏️ Edit Profile
              </button>
              <button
                id="delete-user-btn"
                className="btn btn-danger btn-full"
                onClick={() => setShowDelete(true)}
              >
                🗑 Delete User
              </button>
              <button
                className="btn btn-secondary btn-full"
                onClick={() => navigate('/')}
              >
                ← Back to List
              </button>
            </div>
          </aside>

          {/* ── Details Panel ── */}
          <main className="details-panel">

            {/* Contact Info */}
            <div className="card detail-section">
              <h2 className="detail-section-title">
                <span className="section-icon">📋</span> Personal Information
              </h2>
              <div className="info-grid">
                <InfoRow icon="👤" label="First Name"  value={user.firstName} />
                <InfoRow icon="👤" label="Last Name"   value={user.lastName} />
                <InfoRow icon="📧" label="Email"       value={user.email} highlight />
                <InfoRow icon="📱" label="Mobile"      value={user.mobile} />
                <InfoRow icon="⚧"  label="Gender"      value={user.gender} />
                <InfoRow icon="📍" label="Location"    value={user.location} />
              </div>
            </div>

            {/* Account Info */}
            <div className="card detail-section">
              <h2 className="detail-section-title">
                <span className="section-icon">🔐</span> Account Details
              </h2>
              <div className="info-grid">
                <InfoRow
                  icon="✅"
                  label="Account Status"
                  value={user.status}
                />
                <InfoRow
                  icon="🗓"
                  label="Member Since"
                  value={formatDate(user.createdAt)}
                />
                <InfoRow
                  icon="🔄"
                  label="Last Updated"
                  value={formatDate(user.updatedAt)}
                />
                <InfoRow
                  icon="🔑"
                  label="User ID"
                  value={user._id}
                />
              </div>
            </div>

            {/* Activity Card */}
            <div className="activity-strip card">
              <div className="activity-item">
                <span className="activity-val">{user.status}</span>
                <span className="activity-key">Status</span>
              </div>
              <div className="activity-divider" />
              <div className="activity-item">
                <span className="activity-val">{user.gender?.[0] || '—'}</span>
                <span className="activity-key">Gender</span>
              </div>
              <div className="activity-divider" />
              <div className="activity-item">
                <span className="activity-val">{user.location || 'N/A'}</span>
                <span className="activity-key">Location</span>
              </div>
              <div className="activity-divider" />
              <div className="activity-item">
                <span className="activity-val">{formatDate(user.createdAt)}</span>
                <span className="activity-key">Joined</span>
              </div>
            </div>
          </main>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDelete}
        title="Delete User"
        message={`Permanently delete "${user.firstName} ${user.lastName}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  )
}

export default UserView
