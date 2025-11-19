// pages/Project/components/TaskModal/TaskModal.jsx
import { useState, useEffect } from 'react';
import styles from './TaskModal.module.css';

const TaskModal = ({ task, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    progress: 0,
    priority: 'medium'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        startDate: task.startDate || '',
        endDate: task.endDate || '',
        progress: task.progress || 0,
        priority: task.priority || 'medium'
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
    
    // Очищаем ошибки при изменении
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: ''
      }));
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2>{task?.id ? 'Редактировать задачу' : 'Новая задача'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Название задачи:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
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
              <label>Прогресс (%):</label>
              <input
                type="range"
                name="progress"
                min="0"
                max="100"
                value={formData.progress}
                onChange={handleChange}
              />
              <span>{formData.progress}%</span>
            </div>

            <div className={styles.formGroup}>
              <label>Приоритет:</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
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
      </div>
    </div>
  );
};

export default TaskModal;