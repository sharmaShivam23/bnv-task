import { useEffect, useRef } from 'react'
import './ConfirmModal.css'

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', confirmVariant = 'danger' }) => {
  const cancelRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      cancelRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon modal-icon-danger">
          <span>!</span>
        </div>
        <h3 id="modal-title" className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button ref={cancelRef} className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className={`btn btn-${confirmVariant}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
