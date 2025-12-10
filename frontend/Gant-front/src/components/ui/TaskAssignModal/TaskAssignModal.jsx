// components/ui/TaskAssignModal/TaskAssignModal.jsx
import React, { useState, useEffect } from 'react';
import styles from './TaskAssignModal.module.css';

const TaskAssignModal = ({ task, projectId, apiAddress, onClose, onAssignChange }) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [task.id, projectId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Загружаем всех пользователей проекта
      const usersResponse = await fetch(
        `${apiAddress}membership/getAll?projectId=${projectId}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (usersResponse.ok) {
        const allUsers = await usersResponse.json();
        
        // 2. Загружаем пользователей, уже назначенных на задачу
        // TODO: Добавить endpoint для получения назначенных пользователей
        // const assignedResponse = await fetch(...);
        
        // Временная логика - покажем всех пользователей проекта
        setAvailableUsers(allUsers);
        
        // Если у задачи есть taskMakers, используем их
        if (task.taskMakers && task.taskMakers.length > 0) {
          setAssignedUsers(task.taskMakers);
        }
      } else {
        throw new Error('Не удалось загрузить пользователей');
      }
    } catch (err) {
      setError(err.message || 'Ошибка загрузки данных');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignToMe = async () => {
    setIsAssigning(true);
    setError('');
    
    try {
      // TODO: Заменить на ваш endpoint для назначения задачи себе
      const response = await fetch(
        `${apiAddress}projectComponent/assignToMe?projectId=${projectId}&componentId=${task.id}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const result = await response.json();
        onAssignChange(result);
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Ошибка назначения задачи');
      }
    } catch (err) {
      setError('Ошибка соединения при назначении задачи');
      console.error(err);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleAssignToUser = async (user) => {
    setIsAssigning(true);
    setError('');
    
    try {
      // TODO: Заменить на ваш endpoint для назначения задачи пользователю
      const response = await fetch(
        `${apiAddress}projectComponent/assignToUser`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: parseInt(projectId),
            componentId: parseInt(task.id),
            userId: user.id || user.userId,
            email: user.email
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        onAssignChange(result);
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Ошибка назначения задачи');
      }
    } catch (err) {
      setError('Ошибка соединения при назначении задачи');
      console.error(err);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassignUser = async (user) => {
    setIsAssigning(true);
    setError('');
    
    try {
      // TODO: Заменить на ваш endpoint для снятия назначения
      const response = await fetch(
        `${apiAddress}projectComponent/unassignUser`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: parseInt(projectId),
            componentId: parseInt(task.id),
            userId: user.id || user.userId,
            email: user.email
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        onAssignChange(result);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Ошибка снятия назначения');
      }
    } catch (err) {
      setError('Ошибка соединения при снятии назначения');
      console.error(err);
    } finally {
      setIsAssigning(false);
    }
  };

  const formatUserRole = (role) => {
    const roleMap = {
      'ROLE_ADMIN': 'Админ',
      'ROLE_PLANNER': 'Планнер',
      'ROLE_REVIEWER': 'Ревьюер',
      'ROLE_STUDENT': 'Студент',
      'ROLE_VIEWER': 'Гость',
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role) => {
    const roleColors = {
      ROLE_ADMIN: '#ff6b6b',
      ROLE_PLANNER: '#4ecdc4',
      ROLE_REVIEWER: '#45b7d1',
      ROLE_STUDENT: '#96ceb4',
      ROLE_VIEWER: '#feca57',
    };
    return roleColors[role] || '#667eea';
  };

  // Функция для получения отфильтрованных пользователей (не назначенных)
  const getFilteredUsers = () => {
    const assignedEmails = new Set(assignedUsers.map(u => u.email));
    return availableUsers.filter(user => !assignedEmails.has(user.email));
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Назначение задачи</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.taskInfo}>
            <h3>{task.title}</h3>
            <p className={styles.taskDescription}>{task.description}</p>
          </div>

          {error && (
            <div className={styles.errorMessage}>{error}</div>
          )}

          {isLoading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : (
            <>
              {/* Кнопка "Взять задачу себе" */}
              <div className={styles.assignToMeSection}>
                <h4>Назначить себе</h4>
                <button
                  className={styles.assignToMeButton}
                  onClick={handleAssignToMe}
                  disabled={isAssigning}
                >
                  {isAssigning ? 'Назначение...' : '👤 Взять задачу себе'}
                </button>
                <p className={styles.helperText}>
                  Нажмите, чтобы взять эту задачу на себя
                </p>
              </div>

              {/* Назначенные пользователи */}
              <div className={styles.assignedSection}>
                <h4>Назначенные пользователи</h4>
                {assignedUsers.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>Задача не назначена никому</p>
                  </div>
                ) : (
                  <div className={styles.usersList}>
                    {assignedUsers.map((user, index) => (
                      <div key={user.email || user.id || index} className={styles.userItem}>
                        <div className={styles.userInfo}>
                          <div className={styles.userAvatar}>
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className={styles.userDetails}>
                            <span className={styles.userEmail}>{user.email}</span>
                            <span 
                              className={styles.userRole}
                              style={{ backgroundColor: getRoleColor(user.userRole || user.role) }}
                            >
                              {formatUserRole(user.userRole || user.role)}
                            </span>
                          </div>
                        </div>
                        <div className={styles.userActions}>
                          <button
                            className={styles.unassignButton}
                            onClick={() => handleUnassignUser(user)}
                            disabled={isAssigning}
                            title="Снять назначение"
                          >
                            ❌
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Доступные пользователи для назначения */}
              <div className={styles.availableSection}>
                <h4>Назначить другому пользователю</h4>
                {getFilteredUsers().length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>Все пользователи уже назначены</p>
                  </div>
                ) : (
                  <div className={styles.usersList}>
                    {getFilteredUsers().map((user, index) => (
                      <div key={user.email || user.id || index} className={styles.userItem}>
                        <div className={styles.userInfo}>
                          <div className={styles.userAvatar}>
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className={styles.userDetails}>
                            <span className={styles.userEmail}>{user.email}</span>
                            <span 
                              className={styles.userRole}
                              style={{ backgroundColor: getRoleColor(user.userRole || user.role) }}
                            >
                              {formatUserRole(user.userRole || user.role)}
                            </span>
                          </div>
                        </div>
                        <div className={styles.userActions}>
                          <button
                            className={styles.assignButton}
                            onClick={() => handleAssignToUser(user)}
                            disabled={isAssigning}
                            title="Назначить задачу"
                          >
                            ➕ Назначить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Статистика */}
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Всего пользователей:</span>
                  <span className={styles.statValue}>{availableUsers.length}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Назначено:</span>
                  <span className={styles.statValue}>{assignedUsers.length}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Доступно:</span>
                  <span className={styles.statValue}>{getFilteredUsers().length}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button 
            className={styles.closeModalButton}
            onClick={onClose}
            disabled={isAssigning}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskAssignModal;