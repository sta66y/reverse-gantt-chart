import { useState, useEffect } from "react";
import styles from "./TaskModal.module.css";

const TaskModal = ({ task, onSave, onClose, projectDeadline}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    status: "Planned",
    reviewerStatus: "None",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
  if (task) {
    // Извлекаем время из существующих дат
    let startTime = "";
    let endTime = "";
    
    // Если есть startDate в формате с временем
    if (task.startDate && task.startDate.includes('T')) {
      const timePart = task.startDate.split('T')[1];
      // Берем только часы:минуты (первые 5 символов)
      startTime = timePart.substring(0, 5);
    }
    
    // Если есть endDate в формате с временем
    if (task.endDate && task.endDate.includes('T')) {
      const timePart = task.endDate.split('T')[1];
      endTime = timePart.substring(0, 5);
    }
    
    setFormData({
      title: task.title || "",
      description: task.description || "",
      startDate: task.startDate ? task.startDate.split('T')[0] : "",
      endDate: task.endDate ? task.endDate.split('T')[0] : "",
      startTime: startTime,
      endTime: endTime,
      status: task.status || "Planned",
      reviewerStatus: task.reviewerStatus || "None",
    });
  } else {
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5); // HH:mm
    
    setFormData({
      title: "",
      description: "",
      startDate: now.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
      startTime: currentTime,
      endTime: currentTime,
      status: "Planned",
      reviewerStatus: "None",
    });
  }
}, [task]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Название обязательно";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Дата начала обязательна";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Дата окончания обязательна";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const current = new Date();
      const projectDeadlineDate = new Date(projectDeadline);

      if (end < start) {
        newErrors.endDate = "Дата окончания не может быть раньше даты начала";
      }
      else if (start < current) {
        newErrors.startDate = "Дата начала не может быть раньше текущей"
      }
      else if(projectDeadlineDate < end) {
        newErrors.endDate = "Дата окончания не может быть позже дедлайна проекта"
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
        ...formData,
        startTime: formData.startTime + ":00",
        endTime: formData.endTime + ":00",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{task?.id ? "Редактировать задачу" : "Новая задача"}</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Название задачи:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={errors.title ? styles.error : ""}
            />
            {errors.title && (
              <span className={styles.errorText}>{errors.title}</span>
            )}
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
                className={errors.startDate ? styles.error : ""}
              />
              {errors.startDate && (
                <span className={styles.errorText}>{errors.startDate}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Дата окончания:</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className={errors.endDate ? styles.error : ""}
              />
              {errors.endDate && (
                <span className={styles.errorText}>{errors.endDate}</span>
              )}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Время начала: </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className={errors.startTime ? styles.error : ""}
              />
              {errors.startTime && (
                <span className={styles.errorText}>{errors.startTime}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Время окончания:</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className={errors.endTime ? styles.error : ""}
              />
              {errors.endTime && (
                <span className={styles.errorText}>{errors.endTime}</span>
              )}
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
