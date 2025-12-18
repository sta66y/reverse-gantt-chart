// pages/Auth/Auth.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header/Header';
import { useNotification } from '../../contexts/NotificationContext';

const Auth = () => {
  const apiAddress = import.meta.env.VITE_API_ADDRESS;
  const [isLogin, setIsLogin] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [resetUsername, setResetUsername] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { showError } = useNotification();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (isLogin) {
      if (!formData.email.trim()) {
        newErrors.email = 'Введите email или username';
      }
    } else {
      if (!formData.email.trim()) {
        newErrors.email = 'Email обязателен';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Некорректный формат email';
      }

      if (!formData.username.trim()) {
        newErrors.username = 'Username обязателен';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username должен быть не менее 3 символов';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!resetUsername.trim()) {
      setResetError('Введите username или email');
      return;
    }

    setResetLoading(true);
    setResetError('');
    setResetMessage('');

    try {
      const response = await fetch(
        `${apiAddress}password/reset?username=${resetUsername}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        setResetMessage('Инструкции по сбросу пароля отправлены на ваш email');
        setResetUsername('');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка при отправке запроса');
      }
    } catch (error) {
      const msg = error.message || 'Произошла ошибка при отправке запроса';
      setResetError(msg);
      showError({ message: msg, code: 'reset_error' });
    } finally {
      setResetLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');

    try {
      const payload = {
        username: isLogin ? formData.email : formData.username,
        password: formData.password,
      };

      if (!isLogin) {
        payload.email = formData.email;
      }

      const response = await fetch(
        apiAddress + 'auth/' + (isLogin ? 'login' : 'register'),
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Успешно:', data);

        if (isLogin) {
          navigate('/projects');
        } else {
          setIsLogin(true);
          setFormData({ username: '', email: '', password: '' });
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка авторизации');
      }
    } catch (error) {
      const msg = error.message || 'Произошла ошибка при авторизации';
      setApiError(msg);
      showError({ message: msg, code: 'auth_error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const handleResetUsernameChange = (e) => {
    setResetUsername(e.target.value);
    if (resetError) setResetError('');
    if (resetMessage) setResetMessage('');
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setShowResetPassword(false);
    setResetUsername('');
    setResetError('');
    setResetMessage('');
    setErrors({});
    setApiError('');
    setFormData({ username: '', email: '', password: '' });
  };

  const handleForgotPasswordClick = () => {
    setShowResetPassword(true);
    setResetUsername('');
    setResetError('');
    setResetMessage('');
  };

  const handleBackToLogin = () => {
    setShowResetPassword(false);
    setResetUsername('');
    setResetError('');
    setResetMessage('');
  };

  return (
    <div className={styles.auth}>
      <Header />
      <div className={styles.authContainer}>
        <div className={styles.authContent}>
          {showResetPassword ? (
            <>
              <h2>Сброс пароля</h2>
              
              <form onSubmit={handleResetPassword} className={styles.form}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="resetUsername"
                    placeholder="Введите ваш username или email"
                    value={resetUsername}
                    onChange={handleResetUsernameChange}
                    className={resetError ? styles.error : ''}
                    disabled={resetLoading}
                  />
                  {resetError && <span className={styles.errorText}>{resetError}</span>}
                  {resetMessage && (
                    <div className={styles.successMessage}>
                      {resetMessage}
                    </div>
                  )}
                </div>

                <div className={styles.resetButtons}>
                  <Button
                    variant="start"
                    type="submit"
                    disabled={resetLoading}
                    className={styles.submitButton}
                  >
                    {resetLoading ? 'Отправка...' : 'Отправить инструкции'}
                  </Button>
                  
                  <Button
                    onClick={handleBackToLogin}
                    variant="toggle"
                    disabled={resetLoading}
                    className={styles.backButton}
                  >
                    Назад к входу
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2>{isLogin ? 'Вход в систему' : 'Создать аккаунт'}</h2>

              <form onSubmit={handleSubmit} className={styles.form}>
                {!isLogin && (
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      name="username"
                      placeholder="Придумайте username"
                      value={formData.username}
                      onChange={handleChange}
                      className={errors.username ? styles.error : ''}
                      disabled={loading}
                    />
                    {errors.username && <span className={styles.errorText}>{errors.username}</span>}
                  </div>
                )}

                <div className={styles.inputGroup}>
                  <input
                    type={isLogin ? "text" : "email"}
                    name="email"
                    placeholder={isLogin ? "Email или username" : "Введите ваш email"}
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? styles.error : ''}
                    disabled={loading}
                  />
                  {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="password"
                    name="password"
                    placeholder="Введите пароль"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? styles.error : ''}
                    disabled={loading}
                  />
                  {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                </div>

                {isLogin && (
                  <div className={styles.forgotPassword}>
                    <button
                      type="button"
                      onClick={handleForgotPasswordClick}
                      className={styles.forgotPasswordLink}
                      disabled={loading}
                    >
                      Забыли пароль?
                    </button>
                  </div>
                )}

                <Button
                  variant='start'
                  type="submit"
                  disabled={loading}
                  className={styles.submitButton}
                >
                  {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                </Button>

                {apiError && <div className={styles.apiError}>{apiError}</div>}
              </form>

              <Button onClick={handleToggleMode} variant='toggle' disabled={loading}>
                {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;