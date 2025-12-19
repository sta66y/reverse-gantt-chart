// components/ui/ReviewerStatusModal/ReviewerStatusModal.jsx
import React, { useState } from 'react';
import styles from './ReviewerStatusModal.module.css';
import { useNotification } from "../../../contexts/NotificationContext";

const ReviewerStatusModal = ({ task, onClose, onStatusChange, apiAddress, projectId }) => {
  const [selectedStatus, setSelectedStatus] = useState(task?.reviewerStatus || 'None');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showError } = useNotification();

  const statusOptions = [
    { value: 'None', label: 'Не проверялась', icon: '👁️', color: '#6c757d' },
    { value: 'Accepted', label: 'Принята', icon: '👍', color: '#28a745' },
    { value: 'Rejected', label: 'Отклонена', icon: '👎', color: '#dc3545' }
  ];

  const handleSubmit = async () => {
    if (!task?.id || !selectedStatus) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${apiAddress}reviewerTaskStatus/setTaskStatus?projectId=${projectId}`, {
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
      } else if(response.status == 403) {
        showError({
          message: "Изменение статуса проверки запрещено!",
          code: response.status
        })
      } else {
        const errorData = await response.json();
        showError({
          message: 'Ошибка изменения статуса проверки',
          code: response.status
        })
      }
    } catch (err) {
      showError({
          message: 'Ошибка сети',
          code: "NETWORK_ERROR"
        })
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Изменение статуса проверки</h2>
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
            <h4>Текущий статус проверки:</h4>
            <div className={styles.statusBadge} style={{ 
              backgroundColor: statusOptions.find(s => s.value === task?.reviewerStatus)?.color || '#6c757d' 
            }}>
              {statusOptions.find(s => s.value === task?.reviewerStatus)?.icon} 
              {statusOptions.find(s => s.value === task?.reviewerStatus)?.label}
            </div>
          </div>
          
          <div className={styles.statusOptions}>
            <h4>Выберите новый статус проверки:</h4>
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
            disabled={isSubmitting || !selectedStatus || selectedStatus === task?.reviewerStatus}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewerStatusModal;