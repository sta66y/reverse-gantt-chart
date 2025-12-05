// pages/Project/components/TaskModal/TaskModal.jsx
import { useState, useEffect } from 'react';
import styles from './TaskModal.module.css';

const TaskModal = ({ task, onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState('details'); // 'details' или 'comments'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'Planned',
    reviewerStatus: 'None'
  });
  const [errors, setErrors] = useState({});
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        startDate: task.startDate || '',
        endDate: task.endDate || '',
        status: task.status || 'Planned',
        reviewerStatus: task.reviewerStatus || 'None'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'Planned',
        reviewerStatus: 'None'
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Название обязательно';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Дата начала обязательна';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'Дата окончания обязательна';
    }
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end < start) {
        newErrors.endDate = 'Дата окончания не может быть раньше даты начала';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        ...task,
        ...formData
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: ''
      }));
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now().toString(),
      email: 'current.user@company.com',
      role: 'Менеджер',
      text: newComment.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedTask = {
      ...task,
      comments: [...(task?.comments || []), comment]
    };

    onSave(updatedTask);
    setNewComment('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{task?.id ? 'Редактировать задачу' : 'Новая задача'}</h2>
          <div className={styles.tabs}>
            <button 
              type="button"
              className={`${styles.tab} ${activeTab === 'details' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Детали
            </button>
            <button 
              type="button"
              className={`${styles.tab} ${activeTab === 'comments' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              Комментарии ({task?.comments?.length || 0})
            </button>
          </div>
        </div>

        {activeTab === 'details' ? (
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Название задачи:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={errors.title ? styles.error : ''}
              />
              {errors.title && <span className={styles.errorText}>{errors.title}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Описание:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Дата начала:</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className={errors.startDate ? styles.error : ''}
                />
                {errors.startDate && <span className={styles.errorText}>{errors.startDate}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Дата окончания:</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className={errors.endDate ? styles.error : ''}
                />
                {errors.endDate && <span className={styles.errorText}>{errors.endDate}</span>}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Статус задачи:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Planned">Запланирована</option>
                  <option value="In process">В процессе</option>
                  <option value="Completed">Завершена</option>
                  <option value="Delayed">Отложена</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Статус проверки:</label>
                <select
                  name="reviewerStatus"
                  value={formData.reviewerStatus}
                  onChange={handleChange}
                >
                  <option value="None">Не проверялась</option>
                  <option value="Accepted">Принята</option>
                  <option value="Rejected">Отклонена</option>
                </select>
              </div>
            </div>

            <div className={styles.buttons}>
              <button type="button" onClick={onClose} className={styles.cancel}>
                Отмена
              </button>
              <button type="submit" className={styles.save}>
                Сохранить
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.commentsTab}>
            <div className={styles.commentsList}>
              {task?.comments?.length > 0 ? (
                task.comments.map(comment => (
                  <div key={comment.id} className={styles.comment}>
                    <div className={styles.commentHeader}>
                      <div className={styles.commentAuthor}>
                        <span className={styles.authorEmail}>{comment.email}</span>
                        <span className={styles.authorRole}>{comment.role}</span>
                      </div>
                      <span className={styles.commentDate}>
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className={styles.commentText}>{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className={styles.noComments}>Пока нет комментариев</p>
              )}
            </div>

            <div className={styles.addComment}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Добавить комментарий..."
                rows="3"
                className={styles.commentInput}
              />
              <button 
                type="button"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className={styles.addCommentButton}
              >
                Добавить комментарий
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModal;