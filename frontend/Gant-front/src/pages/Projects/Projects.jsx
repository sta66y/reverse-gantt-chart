import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './Projects.module.css';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import ProjectCard from '../../components/ui/ProjectCard';
import { useNotification } from '../../contexts/NotificationContext';

const Projects = () => {
  const apiAddress = import.meta.env.VITE_API_ADDRESS;
  const [error, setError] = useState('');
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    projectName: '',
    projectDescription: '',
    deadline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalErrors, setModalErrors] = useState({});

  const { showError } = useNotification();

  const navigate = useNavigate();

  useEffect(() => {
    getProjectMemberships();
  }, []);

  const getProjectMemberships = async () => {
    try {
      const response = await fetch(apiAddress + 'membership', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        const formattedProjects = data.map(item => ({
          projectId: item.projectId || item.id,
          projectName: item.projectName || item.name,
          projectDescription: item.projectDescription || item.description,
          role: item.role || item.userRole,
          deadline: item.deadline || item.endDate
        }));

        console.log("Получены проекты:")
        console.log(formattedProjects)
        
        setProjects(formattedProjects);
        setError('');
      } else {
        setError("Не удалось получить проекты");
      }
    } catch (err) {
      setError("Ошибка соединения");
      console.error(err);
    }
  };

  const handleLoginIntoProject = async (projectId) => {
    const response = await fetch(apiAddress + 'loginIntoProject/' + projectId, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      navigate('/project/' + projectId);
    } else {
      setError("Не удалось зайти в проект: " + (await response.json()).message);
    }
  };

  const handleCreateProjectClick = () => {
    setIsModalOpen(true);
    setModalErrors({});
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewProjectData({ projectName: '', projectDescription: '', deadline: '' });
    setModalErrors({});
  };

  const validateProjectForm = () => {
    const errors = {};
    
    if (!newProjectData.projectName.trim()) {
      errors.projectName = 'Название обязательно';
    }
    
    if (newProjectData.projectName.trim().length < 3) {
      errors.projectName = 'Название должно быть не менее 3 символов';
    }

    if(!newProjectData.projectDescription.trim()) {
      errors.projectDescription = 'Описание обязательно'
    }

    if(!newProjectData.deadline) {
      errors.deadline = "Дедлайн обязателен"
    }
    
    if (newProjectData.deadline) {
      const deadlineDate = new Date(newProjectData.deadline);
      const today = new Date();
      
      if (deadlineDate < today) {
        errors.deadline = 'Дедлайн не может быть в прошлом';
      }
    }
    
    setModalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateProject = async () => {
    if (!validateProjectForm()) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("Отправка на сервер...")
      console.log(newProjectData)
      const response = await fetch(apiAddress + 'project/create', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: newProjectData.projectName,
          description: newProjectData.projectDescription,
          deadline: newProjectData.deadline
        })
      });
      
      
      if (response.ok) {
        const data = await response.json();

        console.log("Ответ: ")
        console.log(data)
        
        // Обновляем список проектов
        await getProjectMemberships();
        
        // Закрываем модалку и сбрасываем форму
        handleModalClose();
        
        // Показываем успешное сообщение
        setError('');
        
      } else {
        const errorData = await response.json();
        setModalErrors({ api: errorData.message || 'Ошибка создания проекта' });
      }
    } catch (err) {
      setModalErrors({ api: 'Ошибка соединения' });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProjectData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку при вводе
    if (modalErrors[name]) {
      setModalErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogout = async () => {
    const response = await fetch(apiAddress + 'auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    
    navigate('/');
  };

  return (
    <div className={styles.projects}>
      <Header />
      
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Мои проекты</h1>
          <div className={styles.actions}>
            <Button variant="start" onClick={handleCreateProjectClick}>
              Создать проект
            </Button>
            <button className={styles.logout} onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
        
        <div className={styles.grid}>
          {projects.map(project => (
            <ProjectCard 
              key={project.projectId} 
              project={project} 
              onFollowProject={() => handleLoginIntoProject(project.projectId)}
            />
          ))}
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{projects.length}</span>
            <span className={styles.statLabel}>Всего проектов</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {projects.filter(p => p.deadline && new Date(p.deadline) > new Date()).length}
            </span>
            <span className={styles.statLabel}>Активных</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {projects.filter(p => {
                if (!p.deadline) return false;
                const diffTime = new Date(p.deadline) - new Date();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 7 && diffDays > 0;
              }).length}
            </span>
            <span className={styles.statLabel}>Срочных</span>
          </div>
        </div>
      </div>

      {/* Модальное окно создания проекта */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleModalClose}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Создать новый проект</h2>
              <button className={styles.closeButton} onClick={handleModalClose}>
                ✕
              </button>
            </div>
            
            <div className={styles.modalBody}>
              {modalErrors.api && (
                <div className={styles.apiError}>
                  {modalErrors.api}
                </div>
              )}
              
              <div className={styles.formGroup}>
                <label htmlFor="projectName">Название проекта *</label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  value={newProjectData.projectName}
                  onChange={handleInputChange}
                  placeholder="Введите название проекта"
                  className={modalErrors.projectName ? styles.inputError : ''}
                />
                {modalErrors.projectName && (
                  <span className={styles.errorText}>{modalErrors.projectName}</span>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="projectDescription">Описание *</label>
                <textarea
                  id="projectDescription"
                  name="projectDescription"
                  value={newProjectData.projectDescription}
                  onChange={handleInputChange}
                  placeholder="Опишите проект"
                  rows="4"
                />
                {modalErrors.projectDescription && (
                  <span className={styles.errorText}>{modalErrors.projectDescription}</span>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="projectDeadline">Дедлайн</label>
                <input
                  type="date"
                  id="projectDeadline"
                  name="deadline"
                  value={newProjectData.deadline}
                  onChange={handleInputChange}
                  className={modalErrors.deadline ? styles.inputError : ''}
                />
                {modalErrors.deadline && (
                  <span className={styles.errorText}>{modalErrors.deadline}</span>
                )}
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelButton}
                onClick={handleModalClose}
                disabled={isSubmitting}
              >
                Отмена
              </button>
              <button 
                className={styles.createButton}
                onClick={handleCreateProject}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Создание...' : 'Создать проект'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;