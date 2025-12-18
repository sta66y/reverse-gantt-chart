// pages/ResetPassword/ResetPassword.jsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from './ResetPassword.module.css';
import { useNotification } from "../../contexts/NotificationContext";

function ResetPassword() {
  const apiAddress = import.meta.env.VITE_API_ADDRESS;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const token = searchParams.get("token");
  const { showError, showSuccess } = useNotification();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = () => {
    if (!token) {
      navigate("/notfound");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password.trim()) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Подтверждение пароля обязательно';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setStatus('loading');
    setMessage('Устанавливаем новый пароль...');

    try {
      const response = await fetch(apiAddress + "password/new-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: formData.password,
          token: token
        }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Пароль успешно изменён! Перенаправляем на страницу входа...');
        showSuccess('Пароль успешно изменён! Теперь вы можете войти с новым паролем.');
        
        // Задержка для показа сообщения об успехе
        setTimeout(() => {
          navigate("/auth");
        }, 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setStatus('error');
        showError({
          message: errorData.message || "Ошибка при изменении пароля",
          code: response.status
        });
        setMessage('Ошибка при изменении пароля');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Ошибка соединения с сервером.');
      showError({
        message: "Ошибка соединения с сервером",
        code: "NETWORK_ERROR"
      });
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRetry = () => {
    setFormData({ password: '', confirmPassword: '' });
    setErrors({});
    setStatus('idle');
    setMessage('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <svg viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
          </div>
          <h1 className={styles.title}>Новый пароль</h1>
          <p className={styles.subtitle}>
            Введите новый пароль для вашего аккаунта.
          </p>
        </div>

        <div className={styles.tokenDisplay}>
          <span className={styles.tokenLabel}>Токен сброса</span>
          <div className={styles.tokenValue}>
            {token ? `${token.substring(0, 15)}...` : 'Не найден'}
          </div>
        </div>

        {status === 'success' ? (
          <div className={styles.successContainer}>
            <button className={styles.button} disabled>
              <span className={styles.buttonIcon}>✓</span>
              <span>Пароль изменён!</span>
            </button>
            <div className={styles.redirectMessage}>
              Перенаправление на страницу входа...
            </div>
          </div>
        ) : status === 'error' ? (
          <>
            <button className={styles.button} onClick={handleRetry}>
              <span>Попробовать снова</span>
            </button>
            <button 
              className={styles.button}
              onClick={() => navigate("/")}
              style={{ marginTop: '1rem', background: 'rgba(118, 75, 162, 0.1)', color: '#764ba2' }}
            >
              <span>Перейти к входу</span>
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Новый пароль
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Введите новый пароль"
                className={`${styles.input} ${errors.password ? styles.error : ''}`}
                disabled={status === 'loading'}
                autoComplete="new-password"
              />
              {errors.password && (
                <span className={styles.errorText}>{errors.password}</span>
              )}
              <div className={styles.passwordHint}>
                Минимум 6 символов
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Подтвердите пароль
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Повторите новый пароль"
                className={`${styles.input} ${errors.confirmPassword ? styles.error : ''}`}
                disabled={status === 'loading'}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <span className={styles.errorText}>{errors.confirmPassword}</span>
              )}
            </div>

            {status === 'loading' ? (
              <button className={styles.button} disabled>
                <div className={styles.loadingSpinner}></div>
                <span>Изменение пароля...</span>
              </button>
            ) : (
              <button 
                type="submit" 
                className={styles.button}
                disabled={!formData.password || !formData.confirmPassword}
              >
                <span>Установить новый пароль</span>
              </button>
            )}
          </form>
        )}

        <div className={`${styles.statusMessage} ${styles[status]}`}>
          {message}
        </div>

        <div className={styles.hint}>
          <p>✓ Пароль должен содержать минимум 6 символов</p>
          <p>✓ После успешной смены пароля вы будете перенаправлены на страницу входа</p>
          <p>✓ Используйте новый пароль для входа в систему</p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;