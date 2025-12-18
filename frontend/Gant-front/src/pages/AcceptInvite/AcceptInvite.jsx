import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from './AcceptInvite.module.css';
import { useNotification } from "../../contexts/NotificationContext";

function AcceptInvite() {
  const apiAddress = import.meta.env.VITE_API_ADDRESS;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const token = searchParams.get("token");

  const { showError } = useNotification();
  useEffect(() => {
    checkToken();
  }, []);

  const handleAccept = async () => {
    if (!token) return;
    
    setStatus('loading');
    setMessage('Принимаем приглашение...');

    try {
      const response = await fetch(apiAddress + "invite/accept?token=" + token, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Приглашение успешно принято! Перенаправляем в проект...');
        
        // Задержка для показа сообщения об успехе
        setTimeout(() => {
          navigate("/projects");
        }, 2000);
      } else {
        setStatus('error');
        showError({
          message: "Ошибка при принятии приглашения.",
          code: response.status
        })
        setMessage('Ошибка при принятии приглашения.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Ошибка соединения с сервером.');
      console.error(error);
    }
  };

  const checkToken = () => {
    if (!token) {
      navigate("/notfound");
    }
  };

  const handleRetry = () => {
    handleAccept();
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className={styles.title}>Приглашение в проект</h1>
          <p className={styles.subtitle}>
            Вы были приглашены присоединиться к проекту. Нажмите кнопку ниже, чтобы принять приглашение.
          </p>
        </div>

        <div className={styles.tokenDisplay}>
          <span className={styles.tokenLabel}>Код приглашения</span>
          <div className={styles.tokenValue}>{token || 'Не найден'}</div>
        </div>

        {status === 'idle' && (
          <button 
            className={styles.button} 
            onClick={handleAccept}
            disabled={!token}
          >
            <span>Принять приглашение</span>
          </button>
        )}

        {status === 'loading' && (
          <button className={styles.button} disabled>
            <div className={styles.loadingSpinner}></div>
            <span>Обработка...</span>
          </button>
        )}

        {status === 'success' && (
          <button className={styles.button} disabled>
            <span className={styles.buttonIcon}>✓</span>
            <span>Приглашение принято!</span>
          </button>
        )}

        {status === 'error' && (
          <>
            <button className={styles.button} onClick={handleRetry}>
              <span>Попробовать снова</span>
            </button>
            <button 
              className={styles.button}
              onClick={() => navigate("/projects")}
              style={{ marginTop: '1rem', background: 'rgba(118, 75, 162, 0.1)', color: '#764ba2' }}
            >
              <span>Перейти к проектам</span>
            </button>
          </>
        )}

        <div className={`${styles.statusMessage} ${styles[status]}`}>
          {message}
        </div>

        <div className={styles.hint}>
          <p>✓ Приняв приглашение, вы получите доступ к проекту</p>
          <p>✓ Вы сможете найти проект в списке своих проектов</p>
        </div>
      </div>
    </div>
  );
}

export default AcceptInvite;