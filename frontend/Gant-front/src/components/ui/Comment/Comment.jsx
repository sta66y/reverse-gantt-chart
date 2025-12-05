import styles from './Comment.module.css';

const Comment = ({ comment }) => {
  // Форматируем дату комментария
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Получаем цвет для роли (используем ту же функцию, что и в ProjectCard)
  const getRoleColor = (role) => {
    const roleColors = {
      'Менеджер': '#ff6b6b',
      'Разработчик': '#4ecdc4',
      'Дизайнер': '#45b7d1',
      'Аналитик': '#96ceb4',
      'Тестировщик': '#feca57',
      'Владелец': '#ee5a24',
      'Админ': '#9b59b6'
    };
    return roleColors[role] || '#667eea';
  };

  return (
    <div className={styles.comment}>
      <div className={styles.commentHeader}>
        <div className={styles.userInfo}>
          <span className={styles.userEmail}>{comment.email}</span>
          <span 
            className={styles.userRole}
            style={{ backgroundColor: getRoleColor(comment.role) }}
          >
            {comment.role}
          </span>
        </div>
        <span className={styles.commentDate}>
          {formatDate(comment.createdAt)}
        </span>
      </div>
      <div className={styles.commentText}>
        {comment.text}
      </div>
    </div>
  );
};

export default Comment;