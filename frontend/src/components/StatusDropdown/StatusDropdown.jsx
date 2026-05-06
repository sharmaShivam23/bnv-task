import { useState, useRef, useEffect } from 'react'
import { updateUserStatus } from '../../api/userApi'
import { useToast } from '../../hooks/useToast'
import './StatusDropdown.css'

const StatusDropdown = ({ userId, currentStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)
  const { addToast } = useToast()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = async (status) => {
    if (status === currentStatus) { setIsOpen(false); return }
    setLoading(true)
    setIsOpen(false)
    try {
      await updateUserStatus(userId, status)
      onStatusChange(userId, status)
      addToast(`Status updated to ${status}`, 'success')
    } catch (err) {
      addToast(err.message || 'Failed to update status', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="status-dropdown" ref={dropdownRef}>
      <button
        className={`status-trigger status-${currentStatus.toLowerCase()}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {loading ? '…' : currentStatus}
        <span className="status-caret">▾</span>
      </button>

      {isOpen && (
        <ul className="status-menu" role="listbox">
          {['Active', 'Inactive'].map((s) => (
            <li
              key={s}
              className={`status-option ${s === currentStatus ? 'status-option-selected' : ''}`}
              onClick={() => handleSelect(s)}
              role="option"
              aria-selected={s === currentStatus}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default StatusDropdown
