import { useState } from 'react';
import styles from './CommentsModal.module.css';

const CommentsModal = ({ task, onClose, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(task.id, newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Комментарии к задаче</h2>
          <h3 className={styles.taskTitle}>"{task?.title}"</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className={styles.modalBody}>
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
            />
            <div className={styles.formActions}>
              <button 
                type="button" 
                onClick={onClose}
                className={styles.cancelButton}
              >
                Закрыть
              </button>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={!newComment.trim()}
              >
                Добавить комментарий
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;