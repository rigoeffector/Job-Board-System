import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/common/Notification';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(({ message, type = 'info', duration = 5000, position = 'top-right' }) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type,
      duration,
      position,
      show: true
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showSuccess = useCallback((message, duration = 5000) => {
    return addNotification({ message, type: 'success', duration });
  }, [addNotification]);

  const showError = useCallback((message, duration = 7000) => {
    return addNotification({ message, type: 'error', duration });
  }, [addNotification]);

  const showWarning = useCallback((message, duration = 6000) => {
    return addNotification({ message, type: 'warning', duration });
  }, [addNotification]);

  const showInfo = useCallback((message, duration = 5000) => {
    return addNotification({ message, type: 'info', duration });
  }, [addNotification]);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Render notifications */}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          position={notification.position}
          show={notification.show}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
}; 