import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ToastContext = createContext(null);
let nextToastId = 0;

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, { type = 'info', duration = 5000, action } = {}) => {
    const id = ++nextToastId;
    setToasts((current) => [...current, { id, message, type, action }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    const handleOnline = () => addToast('Network restored: connection is back online.', { type: 'success', duration: 4500 });
    const handleOffline = () => addToast('Network disconnected: offline mode active.', { type: 'error', duration: 8000 });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      addToast('Offline: network connection unavailable.', { type: 'error', duration: 8000 });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addToast]);

  const contextValue = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`} role="status">
            <div className="toast-content">
              <span>{toast.message}</span>
              {toast.action && (
                <div className="toast-consent-action">
                  <button type="button" onClick={() => {
                    toast.action.onClick();
                    removeToast(toast.id);
                  }}>
                    {toast.action.label}
                  </button>
                </div>
              )}
            </div>
            <button type="button" className="toast-close" onClick={() => removeToast(toast.id)} aria-label="Dismiss notification">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
