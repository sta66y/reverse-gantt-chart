import styles from './ProjectCard.module.css';

const ProjectCard = ({ project }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDeadlineStatus = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'overdue'; // Просрочен
    } else if (diffDays <= 7) {
      return 'urgent'; // Срочный (7 дней или меньше)
    } else {
      return 'normal'; // Нормальный
    }
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

  const deadlineStatus = getDeadlineStatus(project.deadline);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{project.name}</h3>
      <p className={styles.description}>{project.description}</p>
      
      <div className={styles.role}>
        <span 
          className={styles.roleBadge}
          style={{ backgroundColor: getRoleColor(project.role) }}
        >
          {project.role}
        </span>
      </div>
      
      <div className={styles.deadline}>
        <span className={styles.deadlineLabel}>Дедлайн:</span>
        <span className={`${styles.deadlineDate} ${styles[deadlineStatus]}`}>
          {formatDate(project.deadline)}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;