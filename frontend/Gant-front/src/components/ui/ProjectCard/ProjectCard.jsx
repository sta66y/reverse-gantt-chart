import styles from './ProjectCard.module.css';

const ProjectCard = ({ project, onFollowProject}) => {
  const formatDate = (dateString) => {

    if(!dateString) return null;

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
      'ROLE_ADMIN': '#ff6b6b',
      'ROLE_PLANNER': '#4ecdc4',
      'ROLE_REVIEWER': '#45b7d1',
      'ROLE_STUDENT': '#96ceb4',
      'ROLE_VIEWER': '#feca57'
    };
    return roleColors[role] || '#667eea';
  };
  const getRoleString = (role) => {
    const roleStrings = {
      'ROLE_ADMIN': 'Админ',
      'ROLE_PLANNER': 'Планнер',
      'ROLE_REVIEWER': 'Ревьюер',
      'ROLE_STUDENT': 'Студент',
      'ROLE_VIEWER': 'Гость'
    };
    return roleStrings[role] || "Неизвестный";
  }

  const deadlineStatus = getDeadlineStatus(project.deadline);

  return (
    <div className={styles.card} onClick={onFollowProject}>
      <h3 className={styles.title}>{project.projectName}</h3>
      <p className={styles.description}>{project.projectDescription}</p>
      
      <div className={styles.role}>
        <span 
          className={styles.roleBadge}
          style={{ backgroundColor: getRoleColor(project.role) }}
        >
          {getRoleString(project.role)}
        </span>
      </div>
      
      <div className={styles.deadline}>
        <span className={styles.deadlineLabel}>Дедлайн:</span>
        <span className={`${styles.deadlineDate} ${styles[deadlineStatus]}`}>
          {formatDate(project.deadline) || 'Не установлен'}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;