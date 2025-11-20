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
  const [viewMode, setViewMode] = useState('gantt'); // 'gantt' или 'tree'

  // Загрузка данных проекта
  useEffect(() => {
    // TODO: Заменить на реальный API вызов
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
        ) : (
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