import { useEffect, useRef } from 'react'
import { useToast } from '../../hooks/useToast'
import './Toast.css'

const ICONS = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
}

const ToastItem = ({ toast, onRemove }) => {
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => onRemove(toast.id), toast.duration || 3500)
    return () => clearTimeout(timerRef.current)
  }, [toast, onRemove])

  return (
    <div className={`toast-item toast-${toast.type}`} role="alert">
      <span className="toast-icon">{ICONS[toast.type] || ICONS.info}</span>
      <span className="toast-message">{toast.message}</span>
      <button
        className="toast-close"
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  )
}

const Toast = () => {
  const { toasts, removeToast } = useToast()

  if (!toasts.length) return null

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

export default Toast
