// contexts/NotificationContext.jsx
import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Автоматическое удаление через 5 секунд (ошибки) или 3 секунды (успех)
    const timeout = notification.type === 'error' ? 5000 : 3000;
    setTimeout(() => {
      removeNotification(id);
    }, timeout);
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

  const showSuccess = (message, title = 'Успешно!') => {
    addNotification({
      type: 'success',
      title: title,
      message: message,
    });
  };

  return (
    <NotificationContext.Provider value={{ 
      showError, 
      showSuccess,
      addNotification, 
      removeNotification 
    }}>
      {children}
      <NotificationContainer notifications={notifications} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

// Компонент для отображения уведомлений
const NotificationContainer = ({ notifications }) => {
  const { removeNotification } = useNotification();

  const getNotificationStyle = (type) => {
    const baseStyle = {
      border: '1px solid',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      minWidth: '320px',
      maxWidth: '400px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      position: 'relative',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      transition: 'transform 0.3s ease, opacity 0.3s ease',
    };

    if (type === 'error') {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(248, 215, 218, 0.95)',
        borderColor: '#f5c6cb',
        color: '#721c24',
      };
    } else if (type === 'success') {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(212, 237, 218, 0.95)',
        borderColor: '#c3e6cb',
        color: '#155724',
      };
    }
    
    // Для других типов уведомлений (info, warning)
    return {
      ...baseStyle,
      backgroundColor: 'rgba(209, 236, 241, 0.95)',
      borderColor: '#b6effb',
      color: '#0c5460',
    };
  };

  const getIcon = (type) => {
    switch(type) {
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    }}>
      {notifications.map(notification => (
        <div 
          key={notification.id}
          style={{
            ...getNotificationStyle(notification.type),
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div style={{ 
              fontSize: '20px',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              {getIcon(notification.type)}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: '600', 
                fontSize: '16px',
                marginBottom: notification.message ? '4px' : 0
              }}>
                {notification.title}
              </div>
              {notification.message && (
                <div style={{ 
                  fontSize: '14px',
                  lineHeight: '1.4',
                  opacity: 0.9
                }}>
                  {notification.message}
                </div>
              )}
            </div>
            
            <button 
              onClick={() => removeNotification(notification.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                color: 'inherit',
                opacity: 0.6,
                padding: '0',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                flexShrink: 0,
                transition: 'opacity 0.2s ease',
              }}
              onMouseOver={(e) => e.target.style.opacity = '1'}
              onMouseOut={(e) => e.target.style.opacity = '0.6'}
              aria-label="Закрыть уведомление"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
      
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes fadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};