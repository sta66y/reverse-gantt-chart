import { useState } from 'react';
import styles from './CommentSection.module.css';

const CommentSection = ({ task, onAddComment, onClose }) => {
  const [newComment, setNewComment] = useState('');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(task.id, newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className={styles.commentSection}>
      <div className={styles.commentHeader}>
        <h3>Комментарии к задаче: {task.title}</h3>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
      </div>

      <div className={styles.commentsList}>
        {task.comments && task.comments.length > 0 ? (
          task.comments.map(comment => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentMeta}>
                <div className={styles.commentAuthor}>
                  <span className={styles.authorEmail}>{comment.email}</span>
                  <span 
                    className={styles.authorRole}
                    style={{ backgroundColor: getRoleColor(comment.role) }}
                  >
                    {comment.role}
                  </span>
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

      <form onSubmit={handleSubmit} className={styles.commentForm}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Добавить комментарий..."
          className={styles.commentInput}
          rows="3"
        />
        <button type="submit" className={styles.submitButton}>
          Отправить
        </button>
      </form>
    </div>
  );
};

export default CommentSection;