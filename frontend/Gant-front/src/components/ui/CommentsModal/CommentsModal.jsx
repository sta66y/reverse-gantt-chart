import { useState } from 'react';
import styles from './CommentsModal.module.css';

const CommentsModal = ({ task, onClose, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !task?.id) return;
    
    setIsSubmitting(true);
    
    try {
      await onAddComment(task.id, newComment.trim());
      setNewComment('');
    } catch (err) {
      console.error('Ошибка при добавлении комментария:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleString = (role) => {
    const roleStrings = {
      ROLE_ADMIN: "Админ",
      ROLE_PLANNER: "Планнер",
      ROLE_REVIEWER: "Ревьюер",
      ROLE_STUDENT: "Студент",
      ROLE_VIEWER: "Гость",
    };
    return roleStrings[role] || "Неизвестный";
  };

  const getRoleColor = (role) => {
    const roleColors = {
      ROLE_ADMIN: "#ff6b6b",
      ROLE_PLANNER: "#4ecdc4",
      ROLE_REVIEWER: "#45b7d1",
      ROLE_STUDENT: "#96ceb4",
      ROLE_VIEWER: "#feca57",
    };
    return roleColors[role] || "#667eea";
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Комментарии к задаче</h2>
          <h3 className={styles.taskTitle}>"{task?.title}"</h3>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.commentsList}>
            {task?.comments?.length > 0 ? (
              task.comments.map(comment => {
                // Поддерживаем оба формата: старый (mock) и новый (API)
                const commenter = comment.commenter || { 
                  email: comment.email, 
                  userRole: comment.role 
                };
                const commentText = comment.comment || comment.text;
                
                return (
                  <div key={comment.id} className={styles.comment}>
                    <div className={styles.commentHeader}>
                      <div className={styles.commentAuthor}>
                        <span className={styles.authorEmail}>
                          {commenter.email || 'Неизвестный пользователь'}
                        </span>
                        <span 
                          className={styles.authorRole}
                          style={{ backgroundColor: getRoleColor(commenter.userRole) }}
                        >
                          {getRoleString(commenter.userRole)}
                        </span>
                      </div>
                      <span className={styles.commentDate}>
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className={styles.commentText}>{commentText}</p>
                  </div>
                );
              })
            ) : (
              <div className={styles.noComments}>
                <p>Пока нет комментариев</p>
                <p>Будьте первым, кто оставит комментарий!</p>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className={styles.commentForm}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Напишите ваш комментарий..."
              rows="3"
              className={styles.commentInput}
              required
              disabled={isSubmitting}
            />
            <div className={styles.formActions}>
              <button 
                type="button" 
                onClick={onClose}
                className={styles.cancelButton}
                disabled={isSubmitting}
              >
                Закрыть
              </button>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={!newComment.trim() || isSubmitting}
              >
                {isSubmitting ? 'Отправка...' : 'Добавить комментарий'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;