// pages/Project/Project.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GanttChart from '../../components/ui/GanttChart';
import TaskTree from '../../components/ui/TaskTree';
import TaskModal from '../../components/ui/TaskModal';
import CommentsModal from '../../components/ui/CommentsModal'
import styles from './Project.module.css';

const Project = () => {
  const apiAddress = import.meta.env.VITE_API_ADDRESS;
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectDeadline, setProjectDeadline] = useState(null);
  const [projectCreatedDate, setProjectCreatedDate] = useState(null);
  const [projectUpdatedDate, setProjectUpdatedDate] = useState(null);
  const [projectOwnerEmail, setProjectOwnerEmail] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('gantt'); // 'gantt', 'tree', 'users'
  
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false); // НОВОЕ состояние
  const [taskForComments, setTaskForComments] = useState(null); // Задача для комментариев

  // Тестовые данные пользователей проекта
  const projectUsers = [
    { id: 1, email: 'project.manager@company.com', role: 'Менеджер' },
    { id: 2, email: 'frontend.dev@company.com', role: 'Разработчик' },
    { id: 3, email: 'backend.dev@company.com', role: 'Разработчик' },
    { id: 4, email: 'designer.anna@company.com', role: 'Дизайнер' },
    { id: 5, email: 'analyst.maria@company.com', role: 'Аналитик' },
    { id: 6, email: 'qa.sergey@company.com', role: 'Тестировщик' },
    { id: 7, email: 'stakeholder@company.com', role: 'Владелец' },
    { id: 8, email: 'devops@company.com', role: 'Разработчик' },
  ];

  useEffect(() => {
    const mockTasks = generateMockTasks();
    getProjectInfo();
    setTasks(mockTasks);
  }, []);

  const getProjectInfo = async () => {
    const response = await fetch(apiAddress + 'project/info' + "?projectId=" + projectId, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      const data = await response.json();
      setProjectName(data.projectName);
      setProjectDescription(data.projectDescription);
      setProjectDeadline(data.deadline);
      setProjectCreatedDate(data.createdAt);
      setProjectUpdatedDate(data.updatedAt);
      setProjectOwnerEmail(data.projectOwnerEmail);
    } else {
      setProjectName("unknown");
      console.log("Не удалось получить название проекта");
    }
  };
  const deleteProject = async () => {
    const response = await fetch(apiAddress + 'project/action/delete' + "?projectId=" + projectId, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      console.log("Текущий проект успешно удален")
    } else {
      console.log("Не удалось удалить проект");
    }
  }

  const handleDeleteProject = async () => {
    console.log('Удаление проекта:', projectId);
    if (window.confirm(`Удалить проект "${projectName}"?`)) {
      await deleteProject();
      handleBackToProjects();
    }
  };

  const handleBackToProjects = () => {
    navigate('/projects');
  };

  const handleShowProjectInfo = () => {
    setIsProjectInfoOpen(true);
  };

  const handleCloseProjectInfo = () => {
    setIsProjectInfoOpen(false);
  };


  const handleShowComments = (task) => {
    setTaskForComments(task);
    setIsCommentsModalOpen(true);
  };

  // Функция для добавления комментария
  const handleAddComment = (taskId, commentText) => {
    const newComment = {
      id: Date.now().toString(),
      email: 'current.user@company.com', // Текущий пользователь
      role: 'Разработчик', // Роль пользователя
      text: commentText,
      createdAt: new Date().toISOString()
    };

    // Обновляем задачу с новым комментарием
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          comments: [...(task.comments || []), newComment]
        };
      }
      // Также ищем в детях
      const updateChildren = (tasksArray) => {
        return tasksArray.map(t => {
          if (t.id === taskId) {
            return {
              ...t,
              comments: [...(t.comments || []), newComment]
            };
          }
          if (t.children) {
            return {
              ...t,
              children: updateChildren(t.children)
            };
          }
          return t;
        });
      };
      
      if (task.children) {
        return {
          ...task,
          children: updateChildren(task.children)
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    
    // Обновляем также taskForComments если он открыт
    if (taskForComments && taskForComments.id === taskId) {
      setTaskForComments(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newComment]
      }));
    }
  };
  

  const handleAddTask = (parentId = null) => {
    setSelectedTask({ parentId });
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (taskData.id) {
      setTasks(prev => updateTaskInTree(prev, taskData));
    } else {
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        children: []
      };
      
      if (taskData.parentId) {
        setTasks(prev => addTaskToParent(prev, taskData.parentId, newTask));
      } else {
        setTasks(prev => [...prev, newTask]);
      }
    }
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => deleteTaskFromTree(prev, taskId));
  };

  const updateTaskInTree = (tasks, updatedTask) => {
    return tasks.map(task => {
      if (task.id === updatedTask.id) {
        return { ...task, ...updatedTask };
      }
      if (task.children) {
        return { ...task, children: updateTaskInTree(task.children, updatedTask) };
      }
      return task;
    });
  };

  const addTaskToParent = (tasks, parentId, newTask) => {
    return tasks.map(task => {
      if (task.id === parentId) {
        return { ...task, children: [...(task.children || []), newTask] };
      }
      if (task.children) {
        return { ...task, children: addTaskToParent(task.children, parentId, newTask) };
      }
      return task;
    });
  };

  const deleteTaskFromTree = (tasks, taskId) => {
    return tasks.filter(task => {
      if (task.id === taskId) {
        if (task.children && task.children.length > 0) {
          alert('Нельзя удалить задачу с подзадачами!');
          return true;
        }
        return false;
      }
      if (task.children) {
        task.children = deleteTaskFromTree(task.children, taskId);
      }
      return true;
    });
  };

  const getRoleColor = (role) => {
    const roleColors = {
      'Менеджер': '#ff6b6b',
      'Разработчик': '#4ecdc4',
      'Дизайнер': '#45b7d1',
      'Аналитик': '#96ceb4',
      'Тестировщик': '#feca57',
      'Владелец': '#ee5a24'
    };
    return roleColors[role] || '#667eea';
  };

  const getRoleStats = () => {
    const stats = {};
    projectUsers.forEach(user => {
      stats[user.role] = (stats[user.role] || 0) + 1;
    });
    return stats;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указана';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const roleStats = getRoleStats();

  return (
    <div className={styles.project}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          {/* НОВАЯ кнопка выхода из проекта */}
          <button 
            className={styles.exitButton}
            onClick={handleDeleteProject}
            title="Удалить проект"
          >
            Удалить проект
          </button>

          <button 
            className={styles.backButton}
            onClick={handleBackToProjects}
            title="Вернуться к проектам"
          >
            ← Назад к проектам
          </button>
          <h1>{projectName || "Загрузка..."}</h1>
        </div>
        
        <div className={styles.headerRight}>
          <button 
            className={styles.infoButton}
            onClick={handleShowProjectInfo}
            title="Информация о проекте"
          >
            ℹ️ О проекте
          </button>
          
          <div className={styles.controls}>
            <button 
              className={styles.addButton}
              onClick={() => handleAddTask()}
            >
              + Добавить задачу
            </button>
            <div className={styles.viewToggle}>
              <button 
                className={viewMode === 'gantt' ? styles.active : ''}
                onClick={() => setViewMode('gantt')}
              >
                Диаграмма Ганта
              </button>
              <button 
                className={viewMode === 'tree' ? styles.active : ''}
                onClick={() => setViewMode('tree')}
              >
                Дерево задач
              </button>
              <button 
                className={viewMode === 'users' ? styles.active : ''}
                onClick={() => setViewMode('users')}
              >
                Участники
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {viewMode === 'gantt' ? (
          <GanttChart 
            tasks={tasks}
            onTaskSelect={setSelectedTask}
            onTaskEdit={(task) => {
              setSelectedTask(task);
              setIsModalOpen(true);
            }}
            onAddSubtask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onShowComments={handleShowComments}
          />
        ) : viewMode === 'tree' ? (
          <TaskTree 
            tasks={tasks}
            onTaskSelect={setSelectedTask}
            onTaskEdit={(task) => {
              setSelectedTask(task);
              setIsModalOpen(true);
            }}
            onAddSubtask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onShowComments={handleShowComments}
          />
        ) : (
          <div className={styles.usersView}>
            <div className={styles.statsSection}>
              <h3>Статистика по ролям</h3>
              <div className={styles.statsGrid}>
                {Object.entries(roleStats).map(([role, count]) => (
                  <div key={role} className={styles.statCard}>
                    <div 
                      className={styles.statColor}
                      style={{ backgroundColor: getRoleColor(role) }}
                    />
                    <div className={styles.statInfo}>
                      <span className={styles.statRole}>{role}</span>
                      <span className={styles.statCount}>{count} чел.</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.usersList}>
              <h3>Все участники проекта</h3>
              <div className={styles.usersTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableCell}>Email</div>
                  <div className={styles.tableCell}>Роль</div>
                  <div className={styles.tableCell}>Действия</div>
                </div>
                {projectUsers.map(user => (
                  <div key={user.id} className={styles.tableRow}>
                    <div className={styles.tableCell}>
                      <span className={styles.userEmail}>{user.email}</span>
                    </div>
                    <div className={styles.tableCell}>
                      <span 
                        className={styles.userRole}
                        style={{ backgroundColor: getRoleColor(user.role) }}
                      >
                        {user.role}
                      </span>
                    </div>
                    <div className={styles.tableCell}>
                      <div className={styles.userActions}>
                        <button className={styles.actionButton}>Написать</button>
                        <button className={styles.actionButton}>Профиль</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Модальное окно комментариев */}
      {isCommentsModalOpen && taskForComments && (
        <CommentsModal
          task={taskForComments}
          onClose={() => {
            setIsCommentsModalOpen(false);
            setTaskForComments(null);
          }}
          onAddComment={handleAddComment}
        />
      )}

      {isProjectInfoOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseProjectInfo}>
          <div className={styles.projectModal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Информация о проекте</h2>
              <button className={styles.closeButton} onClick={handleCloseProjectInfo}>
                ✕
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Название:</span>
                <span className={styles.infoValue}>
                  {projectName || "Разработка мобильного приложения"}
                </span>
              </div>
              
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Описание:</span>
                <div className={styles.infoDescription}>
                  {projectDescription || 
                    "Создание кроссплатформенного приложения для управления задачами с синхронизацией в реальном времени. " +
                    "Проект включает разработку frontend и backend частей, интеграцию с внешними API и создание системы уведомлений."}
                </div>
              </div>
              
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Дедлайн:</span>
                <span className={styles.infoValue}>
                  {projectDeadline ? formatDate(projectDeadline) : "Не установлен"}
                </span>
              </div>
              
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Email владельца:</span>
                <span className={styles.infoValue}>
                  {projectOwnerEmail || "Не установлен"}
                </span>
              </div>
              
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Дата создания:</span>
                <span className={styles.infoValue}>
                  {projectCreatedDate ? formatDate(projectCreatedDate) : "Нет редактирований"}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Дата редакт. :</span>
                <span className={styles.infoValue}>
                  {formatDate(projectUpdatedDate)}
                </span>
              </div>
              
              
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                className={styles.closeModalButton}
                onClick={handleCloseProjectInfo}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования задачи (БЕЗ комментариев) */}
      {isModalOpen && (
        <TaskModal
          task={selectedTask}
          onSave={handleSaveTask}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

const generateMockTasks = () => [
  {
    id: '1',
    title: 'Разработка нового функционала',
    description: 'Основная задача проекта',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'In process',
    reviewerStatus: 'Rejected',
    children: [
      {
        id: '2',
        title: 'Проектирование архитектуры',
        description: 'Создание технического задания',
        startDate: '2024-01-01',
        endDate: '2024-01-07',
        status: 'Planned',
        reviewerStatus: 'Accepted',
        children: [
          {
            id: '3',
            title: 'Анализ требований',
            description: 'Сбор и анализ требований заказчика',
            startDate: '2024-01-01',
            endDate: '2024-01-03',
            status: 'Completed',
            reviewerStatus: 'Accepted'
          }
        ]
      },
      {
        id: '4',
        title: 'Фронтенд разработка',
        description: 'Разработка пользовательского интерфейса',
        startDate: '2024-01-08',
        endDate: '2024-01-20',
        status: 'In process',
        reviewerStatus: 'None'
      },
      {
        id: '5',
        title: 'Задача с проблемами',
        description: 'Задача требующая внимания',
        startDate: '2024-01-10',
        endDate: '2024-01-15',
        status: 'Delayed',
        reviewerStatus: 'Rejected'
      }
    ]
  }
];

export default Project;