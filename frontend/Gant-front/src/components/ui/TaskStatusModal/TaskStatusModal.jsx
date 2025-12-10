// components/ui/TaskStatusModal/TaskStatusModal.jsx
import React, { useState } from 'react';
import styles from './TaskStatusModal.module.css';

const TaskStatusModal = ({ task, onClose, onStatusChange, apiAddress, projectId }) => {
  const [selectedStatus, setSelectedStatus] = useState(task?.status || 'Planned');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    { value: 'Planned', label: 'Запланировано', icon: '📅', color: '#6c757d' },
    { value: 'In process', label: 'В процессе', icon: '⚙️', color: '#ffc107' },
    { value: 'Completed', label: 'Завершено', icon: '✅', color: '#28a745' },
    { value: 'Delayed', label: 'Отложено', icon: '⏸️', color: '#dc3545' }
  ];

  const handleSubmit = async () => {
    if (!task?.id || !selectedStatus) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${apiAddress}studentTaskStatus/setTaskStatus?projectId=${projectId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: parseInt(task.id),
          status: selectedStatus
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        onStatusChange(result);
        onClose();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Ошибка изменения статуса');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Изменение статуса задачи</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.taskInfo}>
            <h3>{task?.title}</h3>
            <p className={styles.taskDescription}>{task?.description}</p>
          </div>
          
          <div className={styles.currentStatus}>
            <h4>Текущий статус:</h4>
            <div className={styles.statusBadge} style={{ 
              backgroundColor: statusOptions.find(s => s.value === task?.status)?.color || '#6c757d' 
            }}>
              {statusOptions.find(s => s.value === task?.status)?.icon} 
              {statusOptions.find(s => s.value === task?.status)?.label}
            </div>
          </div>
          
          <div className={styles.statusOptions}>
            <h4>Выберите новый статус:</h4>
            <div className={styles.optionsGrid}>
              {statusOptions.map(status => (
                <button
                  key={status.value}
                  className={`${styles.statusOption} ${selectedStatus === status.value ? styles.selected : ''}`}
                  onClick={() => setSelectedStatus(status.value)}
                  style={{ borderColor: status.color }}
                >
                  <span className={styles.statusIcon}>{status.icon}</span>
                  <span className={styles.statusLabel}>{status.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Отмена
          </button>
          <button 
            className={styles.saveButton}
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedStatus || selectedStatus === task?.status}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskStatusModal;