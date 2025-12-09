// pages/Project/components/TaskTree/TaskTree.jsx
import { useState } from 'react';
import styles from './TaskTree.module.css';

const TaskTree = ({ tasks, onTaskSelect, onTaskEdit, onAddSubtask, onDeleteTask, onShowComments }) => {
  const [expandedTasks, setExpandedTasks] = useState(new Set());

  const toggleTask = (taskId) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const renderTask = (task, level = 0) => {
    const isExpanded = expandedTasks.has(task.id);
    const hasChildren = task.children && task.children.length > 0;
    const isLeaf = !hasChildren;

    return (
      <div key={task.id} className={styles.taskNode}>
        {/* Основная строка задачи */}
        <div 
          className={styles.taskItem}
          style={{ paddingLeft: `${level * 25 + 10}px` }}
        >
          <button 
            className={styles.expandButton}
            onClick={() => hasChildren && toggleTask(task.id)}
            disabled={!hasChildren}
          >
            {hasChildren ? (isExpanded ? '−' : '+') : '•'}
          </button>
          
          <div className={styles.taskContent}>
            <span 
              className={styles.taskTitle}
              onClick={() => onTaskSelect(task)}
            >
              {task.title}
            </span>
            
            <div className={styles.taskMeta}>
              <span className={`${styles.priority} ${styles[task.reviewerStatus]}`}>
                {task.reviewerStatus === 'Rejected' && '🔴'}
                {task.reviewerStatus === 'None' && '🟡'} 
                {task.reviewerStatus === 'Accepted' && '🟢'}
              </span>
              <span className={styles.dates}>
                {task.startDate} - {task.endDate}
              </span>
            </div>

            <div className={styles.taskActions}>
              <div 
              className={styles.commentButton}
              onClick={() => onShowComments(task)}
            >
              💬 {task.comments?.length || 0}
            </div>
              <button 
                className={styles.actionButton}
                onClick={() => onAddSubtask(task.id)}
                title="Добавить подзадачу"
              >
                +
              </button>
              <button 
                className={styles.actionButton}
                onClick={() => onTaskEdit(task)}
                title="Редактировать"
              >
                ✏️
              </button>
              <button 
                className={styles.actionButton}
                onClick={() => onDeleteTask(task.id)}
                disabled={!isLeaf}
                title={isLeaf ? "Удалить" : "Нельзя удалить задачу с подзадачами"}
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        {/* Дочерние задачи */}
        {isExpanded && hasChildren && (
          <div className={styles.children}>
            {task.children.map(child => renderTask(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.taskTree}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>Задача</div>
        <div className={styles.headerMeta}>Даты и статус ревьюера</div>
        <div className={styles.headerActions}>Действия</div>
      </div>
      
      <div className={styles.treeContent}>
        {tasks.map(task => renderTask(task))}
      </div>
    </div>
  );
};

export default TaskTree;