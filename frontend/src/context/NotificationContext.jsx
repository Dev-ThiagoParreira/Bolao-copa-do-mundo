import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const value = useMemo(
    () => ({
      notification,
      showNotification,
      showSuccess: (message) => showNotification(message, 'success'),
      showError: (message) => showNotification(message, 'error'),
    }),
    [notification, showNotification]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notification && (
        <div className={`alert alert-${notification.type === 'error' ? 'danger' : 'success'} notification-toast`}>
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de NotificationProvider');
  }
  return context;
}
