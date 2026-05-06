// ─── Field Validators ─────────────────────────────────────────────────────────

export const validateFirstName = (value) => {
  if (!value || !value.trim()) return 'First name is required'
  if (value.trim().length < 2) return 'First name must be at least 2 characters'
  if (value.trim().length > 50) return 'First name cannot exceed 50 characters'
  if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return 'First name can only contain letters, spaces, hyphens, or apostrophes'
  return ''
}

export const validateLastName = (value) => {
  if (!value || !value.trim()) return 'Last name is required'
  if (value.trim().length < 2) return 'Last name must be at least 2 characters'
  if (value.trim().length > 50) return 'Last name cannot exceed 50 characters'
  if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return 'Last name can only contain letters, spaces, hyphens, or apostrophes'
  return ''
}

export const validateEmail = (value) => {
  if (!value || !value.trim()) return 'Email address is required'
  if (!/^\S+@\S+\.\S+$/.test(value.trim())) return 'Please enter a valid email address'
  if (value.trim().length > 100) return 'Email cannot exceed 100 characters'
  return ''
}

export const validateMobile = (value) => {
  if (!value || !value.trim()) return 'Mobile number is required'
  if (!/^\d{10}$/.test(value.trim())) return 'Mobile must be exactly 10 digits (numbers only)'
  return ''
}

export const validateGender = (value) => {
  if (!value) return 'Please select a gender'
  if (!['Male', 'Female'].includes(value)) return 'Gender must be Male or Female'
  return ''
}

export const validateStatus = (value) => {
  if (!value) return 'Please select a status'
  if (!['Active', 'Inactive'].includes(value)) return 'Status must be Active or Inactive'
  return ''
}

export const validateLocation = (value) => {
  if (value && value.trim().length > 100) return 'Location cannot exceed 100 characters'
  return ''
}

export const validateProfileImage = (file) => {
  if (!file) return ''
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowed.includes(file.type)) return 'Only image files (jpeg, jpg, png, gif, webp) are allowed'
  if (file.size > 5 * 1024 * 1024) return 'Image file size must be less than 5MB'
  return ''
}

// ─── Full Form Validator ──────────────────────────────────────────────────────

export const validateUserForm = (fields) => {
  const errors = {}

  const firstNameErr = validateFirstName(fields.firstName)
  if (firstNameErr) errors.firstName = firstNameErr

  const lastNameErr = validateLastName(fields.lastName)
  if (lastNameErr) errors.lastName = lastNameErr

  const emailErr = validateEmail(fields.email)
  if (emailErr) errors.email = emailErr

  const mobileErr = validateMobile(fields.mobile)
  if (mobileErr) errors.mobile = mobileErr

  const genderErr = validateGender(fields.gender)
  if (genderErr) errors.gender = genderErr

  const statusErr = validateStatus(fields.status)
  if (statusErr) errors.status = statusErr

  const locationErr = validateLocation(fields.location)
  if (locationErr) errors.location = locationErr

  if (fields.profileImage) {
    const imgErr = validateProfileImage(fields.profileImage)
    if (imgErr) errors.profileImage = imgErr
  }

  return errors
}

export const hasErrors = (errors) => Object.values(errors).some((e) => e !== '')
