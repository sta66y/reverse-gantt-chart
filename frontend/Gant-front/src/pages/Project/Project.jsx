// pages/Project/Project.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GanttChart from '../../components/ui/GanttChart';
import TaskTree from '../../components/ui/TaskTree';
import TaskModal from '../../components/ui/TaskModal';
import styles from './Project.module.css';

const Project = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('gantt'); // 'gantt', 'tree', 'users'

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

  // Загрузка данных проекта
  useEffect(() => {
    const mockTasks = generateMockTasks();
    setTasks(mockTasks);
  }, [projectId]);

  // Добавление новой задачи
  const handleAddTask = (parentId = null) => {
    setSelectedTask({ parentId });
    setIsModalOpen(true);
  };

  // Сохранение задачи
  const handleSaveTask = (taskData) => {
    if (taskData.id) {
      // Редактирование существующей задачи
      setTasks(prev => updateTaskInTree(prev, taskData));
    } else {
      // Добавление новой задачи
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

  // Удаление задачи (только если нет детей)
  const handleDeleteTask = (taskId) => {
    setTasks(prev => deleteTaskFromTree(prev, taskId));
  };

  // Вспомогательные функции для работы с деревом
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

  // Функция для получения цвета роли
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

  // Функция для подсчета пользователей по ролям
  const getRoleStats = () => {
    const stats = {};
    projectUsers.forEach(user => {
      stats[user.role] = (stats[user.role] || 0) + 1;
    });
    return stats;
  };

  const roleStats = getRoleStats();

  return (
    <div className={styles.project}>
      <header className={styles.header}>
        <h1>Проект #{projectId}</h1>
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

// Генерация тестовых данных
const generateMockTasks = () => [
  {
    id: '1',
    title: 'Разработка нового функционала',
    description: 'Основная задача проекта',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'In process',
    reviewerStatus: 'None',
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