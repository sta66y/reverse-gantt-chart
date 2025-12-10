// components/ui/TaskAssignModal/TaskAssignModal.jsx
import React, { useState, useEffect } from 'react';
import styles from './TaskAssignModal.module.css';

const TaskAssignModal = ({ task, projectId, apiAddress, onClose, onAssignChange }) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState('');
  const [includeSubtasks, setIncludeSubtasks] = useState(false);

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
        setAvailableUsers(allUsers);
        
        // 2. Используем taskMakers из пропса task
        if (task.taskMakers && task.taskMakers.length > 0) {
          // Преобразуем TaskMakerResponseDto в формат для UI
          const formattedAssignedUsers = task.taskMakers.map(taskMaker => ({
            id: taskMaker.id,
            taskId: taskMaker.taskId,
            email: taskMaker.taskMakerInfo?.email,
            userRole: taskMaker.taskMakerInfo?.userRole,
            taskMakerInfo: taskMaker.taskMakerInfo
          }));
          setAssignedUsers(formattedAssignedUsers);
        } else {
          setAssignedUsers([]);
        }
      } else {
        throw new Error('Не удалось загрузить пользователей проекта');
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
    console.log(`${apiAddress}taskMakers/take?taskId=${task.id}&subtasks=false&projectId=${projectId}`)
    try {
      const response = await fetch(
        `${apiAddress}taskMakers/take?taskId=${task.id}&subtasks=false&projectId=${projectId}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const result = await response.json();
        await loadData(); // Перезагружаем данные
        onAssignChange(result);
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Ошибка назначения задачи себе');
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
        console.log(`${apiAddress}taskMakers/setMaker?email=${user.email}&taskId=${task.id}&subtasks=false`)
      const response = await fetch(
        `${apiAddress}taskMakers/setMaker?email=${user.email}&taskId=${task.id}&subtasks=false&projectId=${projectId}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const result = await response.json();
        await loadData(); // Перезагружаем данные
        onAssignChange(result);
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Ошибка назначения задачи пользователю');
      }
    } catch (err) {
      setError('Ошибка соединения при назначении задачи');
      console.error(err);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassignUser = async (taskMaker) => {
    if (!window.confirm(`Вы уверены, что хотите снять пользователя ${taskMaker.email} с этой задачи?`)) {
      return;
    }

    setIsAssigning(true);
    setError('');
    
    try {
      const response = await fetch(
        `${apiAddress}taskMakers?taskMakerId=${taskMaker.id}&projectId=${projectId}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        // Обновляем локальный список после успешного удаления
        setAssignedUsers(prev => prev.filter(u => u.id !== taskMaker.id));
        onAssignChange({ success: true });
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

  const handleUnassignAll = async () => {
    if (!window.confirm('Вы уверены, что хотите снять всех назначенных пользователей с этой задачи?')) {
      return;
    }

    setIsAssigning(true);
    setError('');
    
    try {
      // Удаляем каждого назначенного пользователя по отдельности
      const deletePromises = assignedUsers.map(user => 
        fetch(`${apiAddress}taskMakers?taskMakerId=${user.id}&projectId=${projectId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const results = await Promise.all(deletePromises);
      const allSuccess = results.every(response => response.ok);

      if (allSuccess) {
        setAssignedUsers([]);
        onAssignChange({ success: true });
      } else {
        setError('Не удалось снять всех пользователей');
      }
    } catch (err) {
      setError('Ошибка соединения');
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

  // Определяем, назначена ли задача текущему пользователю
  const isAssignedToCurrentUser = () => {
    // Получаем email текущего пользователя
    // Предполагаем, что email пользователя хранится в localStorage или можно получить из контекста
    const currentUserEmail = localStorage.getItem('userEmail') || '';
    return assignedUsers.some(user => user.email === currentUserEmail);
  };

  // Получаем текущего пользователя из assignedUsers
  const getCurrentUserAssignment = () => {
    const currentUserEmail = localStorage.getItem('userEmail') || '';
    return assignedUsers.find(user => user.email === currentUserEmail);
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
            
            <div className={styles.taskMeta}>
              <span className={styles.taskId}>ID: {task.id}</span>
              {task.creator && (
                <span className={styles.taskCreator}>
                  Создатель: {task.creator.email}
                </span>
              )}
            </div>

            {/* Опция для включения подзадач
            {task.children && task.children.length > 0 && (
              <div className={styles.subtasksOption}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={includeSubtasks}
                    onChange={(e) => setIncludeSubtasks(e.target.checked)}
                    disabled={isAssigning}
                  />
                  <span className={styles.checkboxText}>
                    Включить подзадачи ({task.children.length})
                  </span>
                </label>
                <p className={styles.helperText}>
                  При назначении задачи будут также назначены все подзадачи
                </p>
              </div>
            )} */}
          </div>

          {error && (
            <div className={styles.errorMessage}>{error}</div>
          )}

          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Загрузка пользователей...</p>
            </div>
          ) : (
            <>
              {/* Кнопка "Взять задачу себе" */}
              <div className={styles.assignToMeSection}>
                <h4>Назначить себе</h4>
                {isAssignedToCurrentUser() ? (
                  <div className={styles.alreadyAssigned}>
                    <div className={styles.assignedStatus}>
                      <span className={styles.checkmark}>✓</span>
                      <div className={styles.assignedInfo}>
                        <span className={styles.assignedText}>Задача назначена вам</span>
                        <span className={styles.assignedId}>ID назначения: {getCurrentUserAssignment()?.id}</span>
                      </div>
                    </div>
                    <button
                      className={styles.unassignSelfButton}
                      onClick={() => {
                        const currentUser = getCurrentUserAssignment();
                        if (currentUser) handleUnassignUser(currentUser);
                      }}
                      disabled={isAssigning}
                    >
                      {isAssigning ? 'Удаление...' : '❌ Отказаться'}
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      className={styles.assignToMeButton}
                      onClick={handleAssignToMe}
                      disabled={isAssigning}
                    >
                      {isAssigning ? 'Назначение...' : '👤 Взять задачу себе'}
                    </button>
                    <p className={styles.helperText}>
                      Нажмите, чтобы взять эту задачу на себя
                      {includeSubtasks && task.children && task.children.length > 0 && 
                        ` (включая ${task.children.length} подзадач)`}
                    </p>
                  </>
                )}
              </div>

              {/* Назначенные пользователи */}
              <div className={styles.assignedSection}>
                <div className={styles.sectionHeader}>
                  <h4>Назначенные пользователи ({assignedUsers.length})</h4>
                  {assignedUsers.length > 0 && (
                    <button
                      className={styles.unassignAllButton}
                      onClick={handleUnassignAll}
                      disabled={isAssigning}
                      title="Снять всех пользователей"
                    >
                      ❌ Снять всех
                    </button>
                  )}
                </div>
                {assignedUsers.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>Задача не назначена никому</p>
                  </div>
                ) : (
                  <div className={styles.usersList}>
                    {assignedUsers.map((user) => (
                      <div key={`${user.id}-${user.email}`} className={styles.userItem}>
                        <div className={styles.userInfo}>
                          <div className={styles.userAvatar}>
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className={styles.userDetails}>
                            <span className={styles.userEmail}>{user.email}</span>
                            <span 
                              className={styles.userRole}
                              style={{ backgroundColor: getRoleColor(user.userRole) }}
                            >
                              {formatUserRole(user.userRole)}
                            </span>
                            {user.id && (
                              <span className={styles.taskMakerId}>ID: {user.id}</span>
                            )}
                          </div>
                        </div>
                        <div className={styles.userActions}>
                          <button
                            className={styles.unassignButton}
                            onClick={() => handleUnassignUser(user)}
                            disabled={isAssigning}
                            title="Снять назначение"
                          >
                            ❌ Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Доступные пользователи для назначения */}
              <div className={styles.availableSection}>
                <h4>Назначить другому пользователю ({getFilteredUsers().length})</h4>
                {getFilteredUsers().length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>Все пользователи уже назначены на эту задачу</p>
                  </div>
                ) : (
                  <div className={styles.usersList}>
                    {getFilteredUsers().map((user, index) => (
                      <div key={`${user.email}-${index}`} className={styles.userItem}>
                        <div className={styles.userInfo}>
                          <div className={styles.userAvatar}>
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className={styles.userDetails}>
                            <span className={styles.userEmail}>{user.email}</span>
                            <span 
                              className={styles.userRole}
                              style={{ backgroundColor: getRoleColor(user.userRole) }}
                            >
                              {formatUserRole(user.userRole)}
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
                  <span className={styles.statLabel}>Всего в проекте:</span>
                  <span className={styles.statValue}>{availableUsers.length}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Назначено:</span>
                  <span className={styles.statValue}>{assignedUsers.length}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Свободно:</span>
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