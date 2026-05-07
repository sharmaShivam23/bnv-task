import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createUser, updateUser, fetchUserById } from '../../api/userApi'
import { validateUserForm, hasErrors } from '../../utils/validators'
import { useToast } from '../../hooks/useToast'
import './UserForm.css'

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '',
  mobile: '', gender: '', status: '', location: '',
}

const UserForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const isEdit = Boolean(id)

  const [fields, setFields]           = useState(EMPTY_FORM)
  const [errors, setErrors]           = useState({})
  const [touched, setTouched]         = useState({})
  const [profileFile, setProfileFile] = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)
  const [existingImage, setExistingImage]   = useState(null)
  const [submitting, setSubmitting]   = useState(false)
  const [loading, setLoading]         = useState(isEdit)
  const fileInputRef = useRef(null)

  // Load user data for edit mode
  useEffect(() => {
    if (!isEdit) return
    const load = async () => {
      try {
        const res = await fetchUserById(id)
        const u = res.data
        setFields({
          firstName: u.firstName || '',
          lastName:  u.lastName  || '',
          email:     u.email     || '',
          mobile:    u.mobile    || '',
          gender:    u.gender    || '',
          status:    u.status    || '',
          location:  u.location  || '',
        })
        if (u.profileImage) setExistingImage(u.profileImage)
      } catch (err) {
        addToast(err.message || 'Failed to load user', 'error')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isEdit, addToast, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const errs = validateUserForm({ ...fields, [name]: value })
      setErrors((prev) => ({ ...prev, [name]: errs[name] || '' }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const errs = validateUserForm({ ...fields, profileImage: profileFile })
    setErrors((prev) => ({ ...prev, [name]: errs[name] || '' }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setProfileFile(file)
    setProfilePreview(URL.createObjectURL(file))
    const errs = validateUserForm({ ...fields, profileImage: file })
    setErrors((prev) => ({ ...prev, profileImage: errs.profileImage || '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const allTouched = Object.keys(fields).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    setTouched(allTouched)
    const errs = validateUserForm({ ...fields, profileImage: profileFile })
    setErrors(errs)
    if (hasErrors(errs)) {
      addToast('Please fix the validation errors before submitting', 'warning')
      return
    }

    setSubmitting(true)
    const formData = new FormData()
    Object.entries(fields).forEach(([k, v]) => formData.append(k, v))
    if (profileFile) formData.append('profileImage', profileFile)

    try {
      if (isEdit) {
        await updateUser(id, formData)
        addToast('User updated successfully!', 'success')
      } else {
        await createUser(formData)
        addToast('User created successfully!', 'success')
      }
      navigate('/')
    } catch (err) {
      addToast(err.message || 'An error occurred. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="spinner-wrapper"><div className="spinner" /><p>Loading user data...</p></div>
      </div>
    )
  }

  const avatarSrc = profilePreview || existingImage

  return (
    <div className="user-form-page">
      <div className="container">
        <div className="form-page-header">
          <h1 className="form-page-title">
            Register Your Details
          </h1>
        </div>

        <div className="card form-card">
          {/* Avatar upload */}
          <div className="avatar-upload-section">
            <div
              className="avatar-upload-ring"
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload profile picture"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            >
              {avatarSrc ? (
                <img src={avatarSrc} alt="Profile preview" className="avatar-upload-img" />
              ) : (
                <div className="avatar-upload-placeholder">
                  <span className="avatar-upload-icon">👤</span>
                </div>
              )}
              <div className="avatar-upload-overlay">📷</div>
            </div>
            <input
              ref={fileInputRef}
              id="profile-image-input"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {errors.profileImage && <p className="form-error">{errors.profileImage}</p>}
          </div>

          <form id="user-form" onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              {/* First Name */}
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  First name <span className="required">*</span>
                </label>
                <input
                  id="firstName" name="firstName" type="text"
                  className={`form-control ${errors.firstName && touched.firstName ? 'error' : ''}`}
                  placeholder="Enter FirstName"
                  value={fields.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="given-name"
                />
                {errors.firstName && touched.firstName && (
                  <span className="form-error">⚠ {errors.firstName}</span>
                )}
              </div>

              {/* Last Name */}
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Last Name <span className="required">*</span>
                </label>
                <input
                  id="lastName" name="lastName" type="text"
                  className={`form-control ${errors.lastName && touched.lastName ? 'error' : ''}`}
                  placeholder="Enter LastName"
                  value={fields.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="family-name"
                />
                {errors.lastName && touched.lastName && (
                  <span className="form-error">⚠ {errors.lastName}</span>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email address <span className="required">*</span>
                </label>
                <input
                  id="email" name="email" type="email"
                  className={`form-control ${errors.email && touched.email ? 'error' : ''}`}
                  placeholder="Enter Email"
                  value={fields.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                />
                {errors.email && touched.email && (
                  <span className="form-error">⚠ {errors.email}</span>
                )}
              </div>

              {/* Mobile */}
              <div className="form-group">
                <label htmlFor="mobile" className="form-label">
                  Mobile <span className="required">*</span>
                </label>
                <input
                  id="mobile" name="mobile" type="tel"
                  className={`form-control ${errors.mobile && touched.mobile ? 'error' : ''}`}
                  placeholder="Enter Mobile"
                  value={fields.mobile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={10}
                  autoComplete="tel"
                />
                {errors.mobile && touched.mobile && (
                  <span className="form-error">⚠ {errors.mobile}</span>
                )}
              </div>

              {/* Gender */}
              <div className="form-group">
                <label className="form-label">
                  Select Your Gender <span className="required">*</span>
                </label>
                <div className="radio-group">
                  {['Male', 'Female'].map((g) => (
                    <label key={g} className="radio-option">
                      <input
                        type="radio" name="gender" value={g}
                        checked={fields.gender === g}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {g}
                    </label>
                  ))}
                </div>
                {errors.gender && touched.gender && (
                  <span className="form-error">⚠ {errors.gender}</span>
                )}
              </div>

              {/* Status */}
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Select Your Status <span className="required">*</span>
                </label>
                <select
                  id="status" name="status"
                  className={`form-control form-select ${errors.status && touched.status ? 'error' : ''}`}
                  value={fields.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select...</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {errors.status && touched.status && (
                  <span className="form-error">⚠ {errors.status}</span>
                )}
              </div>

              {/* Profile Image (file input) */}
              <div className="form-group">
                <label htmlFor="profile-file-visible" className="form-label">
                  Select Your Profile
                </label>
                <div className="file-input-wrapper">
                  <button
                    id="profile-file-visible"
                    type="button"
                    className="btn btn-secondary btn-sm file-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose file
                  </button>
                  <span className="file-name">
                    {profileFile ? profileFile.name : 'No file chosen'}
                  </span>
                </div>
                {errors.profileImage && (
                  <span className="form-error">⚠ {errors.profileImage}</span>
                )}
              </div>

              {/* Location */}
              <div className="form-group">
                <label htmlFor="location" className="form-label">Enter Your Location</label>
                <input
                  id="location" name="location" type="text"
                  className={`form-control ${errors.location && touched.location ? 'error' : ''}`}
                  placeholder="Enter Your Location"
                  value={fields.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.location && touched.location && (
                  <span className="form-error">⚠ {errors.location}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button
                id="submit-btn"
                type="submit"
                className="btn btn-primary btn-full btn-lg submit-btn"
                disabled={submitting}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserForm
