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

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { showError } = useNotification();
  const navigate = useNavigate();

  const validateForm = () => {
  const newErrors = {};

  if (isLogin) {
    // При входе — только проверяем, что поле не пустое
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email или username';
    }
    // ← Больше никакой валидации! Можно ввести username без @
  } else {
    // При регистрации — полная проверка email
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }

    // Username только при регистрации
    if (!formData.username.trim()) {
      newErrors.username = 'Username обязателен';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username должен быть не менее 3 символов';
    }
  }

  // Пароль
  if (!formData.password) {
    newErrors.password = 'Пароль обязателен';
  } else if (!isLogin && formData.password.length < 6) {
    newErrors.password = 'Пароль должен быть не менее 6 символов';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
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

  const handleToggleMode = () => {
  setIsLogin(!isLogin);
  setErrors({});
  setApiError('');
  setFormData({ username: '', email: '', password: '' }); // ← Полная очистка
};
  return (
    <div className={styles.auth}>
      <Header />
      <div className={styles['auth-content']}>
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

          {/* Email */}
          <div className={styles.inputGroup}>
            <input
              type={isLogin ? "text" : "email"}  // ← Вход: text, Регистрация: email
              name="email"
              placeholder={isLogin ? "Email или username" : "Введите ваш email"}  // ← Подсказка пользователю
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.error : ''}
              disabled={loading}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          {/* Пароль */}
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

          {/* Кнопка отправки */}
          <Button
            variant='start'
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </Button>

          {/* API ошибка */}
          {apiError && <div className={styles.apiError}>{apiError}</div>}
        </form>

        {/* Переключение режима */}
        <Button onClick={handleToggleMode} variant='toggle' disabled={loading}>
          {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </Button>
      </div>
    </div>
  );
};

export default Auth;