import { useNavigate } from 'react-router-dom';
import styles from './Projects.module.css';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import ProjectCard from '../../components/ui/ProjectCard';

const Projects = () => {
  const navigate = useNavigate();

  // Тестовые данные с ролями
  const projects = [
    {
      id: 1,
      name: 'Разработка мобильного приложения',
      description: 'Создание кроссплатформенного приложения для управления задачами с синхронизацией в реальном времениasdlkjf;kdjkfjdjkfkdjfdfdfasjlksl;dlksdjfla;ksdjf;lksjdlf;sdalkj;fslkdjfl;kdjsl;akj;sldjflkjds;l asdlkj f;lkasdj ;lkfj; skdj;l fjlskdj a;lkfj lskdj ;lkjf ;lkasj;d jfldkj kl;fjs;dlk jflkjs ;ld flk',
      role: 'Менеджер',
      deadline: '2025-12-15'
    },
    {
      id: 2,
      name: 'Ребрендинг компании',
      description: 'Полное обновление визуального стиля и айдентики бренда для выхода на новые рынки',
      role: 'Дизайнер',
      deadline: '2025-11-19'
    },
    {
      id: 3,
      name: 'Внедрение CRM системы',
      description: 'Интеграция и настройка CRM для автоматизации процессов продаж и улучшения клиентского сервиса',
      role: 'Аналитик',
      deadline: '2025-10-25'
    },
    {
      id: 4,
      name: 'Запуск интернет-магазина',
      description: 'Разработка и запуск полнофункциональной платформы электронной коммерции с системой оплаты',
      role: 'Разработчик',
      deadline: '2025-12-05'
    },
    {
      id: 5,
      name: 'Оптимизация бизнес-процессов',
      description: 'Анализ и реинжиниринг ключевых бизнес-процессов для повышения эффективности работы',
      role: 'Аналитик',
      deadline: '2025-10-20'
    },
    {
      id: 6,
      name: 'Разработка корпоративного портала',
      description: 'Создание единой информационной системы для сотрудников с модулями документооборота и коммуникации',
      role: 'Владелец',
      deadline: '2025-11-15'
    },
    {
      id: 7,
      name: 'Тестирование новой платформы',
      description: 'Комплексное тестирование функциональности и производительности новой программной платформы',
      role: 'Тестировщик',
      deadline: '2024-10-18'
    },
    {
      id: 8,
      name: 'Миграция баз данных',
      description: 'Перенос данных со старой системы на новую платформу с минимальным временем простоя',
      role: 'Разработчик',
      deadline: '2024-11-28'
    }
  ];

  const handleLogout = () => {
    // TODO: Реализовать выход
    navigate('/');
  };

  const handleCreateProject = () => {
    // TODO: Реализовать создание проекта
    console.log('Создание нового проекта');
  };

  return (
    <div className={styles.projects}>
      <Header />
      
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Мои проекты</h1>
          <div className={styles.actions}>
            <Button variant="start" onClick={handleCreateProject}>
              Создать проект
            </Button>
            <button className={styles.logout} onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
        
        <div className={styles.grid}>
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{projects.length}</span>
            <span className={styles.statLabel}>Всего проектов</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {projects.filter(p => new Date(p.deadline) > new Date()).length}
            </span>
            <span className={styles.statLabel}>Активных</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {projects.filter(p => {
                const diffTime = new Date(p.deadline) - new Date();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 7 && diffDays > 0;
              }).length}
            </span>
            <span className={styles.statLabel}>Срочных</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;