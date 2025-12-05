import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';
import Header from '../../components/ui/Header/Header';

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>404</h1>
          <h2 className={styles.subtitle}>Страница не найдена</h2>
          <p className={styles.description}>
            Извините, запрашиваемая страница не существует или была перемещена.
          </p>
          <div className={styles.actions}>
            <Link to="/" className={styles.homeButton}>
              Вернуться на главную 
            </Link>
            <Link to="/projects" className={styles.projectsButton}>
              Перейти к проектам
            </Link>
          </div>
        </div>
        <div className={styles.illustration}>
          <div className={styles.ghost}>👻</div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;