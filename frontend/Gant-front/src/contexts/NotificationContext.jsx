// contexts/NotificationContext.jsx
import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Автоматическое удаление через 5 секунд
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showError = (error) => {
    addNotification({
      type: 'error',
      title: `Ошибка ${error.code || ''}`,
      message: error.message || 'Произошла ошибка',
    });
  };

  return (
    <NotificationContext.Provider value={{ showError, addNotification, removeNotification }}>
      {children}
      <NotificationContainer notifications={notifications} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

// Компонент для отображения уведомлений
const NotificationContainer = ({ notifications }) => {
  const { removeNotification } = useNotification();

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 9999,
    }}>
      {notifications.map(notification => (
        <div 
          key={notification.id}
          style={{
            backgroundColor: notification.type === 'error' ? '#f8d7da' : '#d4edda',
            border: notification.type === 'error' ? '1px solid #f5c6cb' : '1px solid #c3e6cb',
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '10px',
            minWidth: '300px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ fontWeight: 'bold' }}>{notification.title}</div>
          <div>{notification.message}</div>
          <button 
            onClick={() => removeNotification(notification.id)}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};