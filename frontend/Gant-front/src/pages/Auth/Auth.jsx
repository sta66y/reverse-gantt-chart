// pages/Auth/Auth.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header/Header';
import { useNotification } from '../../contexts/NotificationContext';

const Auth = () => {

  const apiAddress = import.meta.env.VITE_API_ADDRESS
  // Состояние для переключения между входом и регистрацией
  const [isLogin, setIsLogin] = useState(true);
  
  // Состояние для данных формы
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  // Состояние для ошибок валидации
  const [errors, setErrors] = useState({});
  
  // Состояние для загрузки (показываем спиннер)
  const [loading, setLoading] = useState(false);
  
  // Состояние для ошибок от API
  const [apiError, setApiError] = useState('');

  const { showError } = useNotification();
  
  const navigate = useNavigate();

  // Функция валидации формы
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.username = 'Некорректный формат email';
    }
    
    // Валидация email
    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }
    
    // Валидация пароля
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидируем форму перед отправкой
    if (!validateForm()) return;
    
    // Начинаем загрузку
    setLoading(true);
    setApiError('');
    
    try {
      // TODO: Заменить на реальный вызов API
      console.log('Отправляем данные:', formData);
      
      // Имитация запроса к API (задержка 1 секунда)
      // await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Имитация ответа от сервера
      // В реальном приложении здесь будет:

      // if(!isLogin) {
      //   const response = await fetch(apiAddress + 'auth/register', {
      //     method: 'POST',
      //     credentials: 'include',  // ← ВАЖНО!
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(formData)
      //   });
      //   if(!response.ok) throw new Error("Ошибка на стороне регистрации: " + response.message)
      // }

      const response = await fetch(apiAddress + 'auth/' + (isLogin ? 'login' : 'register'), {
        method: 'POST',
        credentials: 'include',  // ← ВАЖНО!
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      console.log(response)
      
      if (response.ok) {
        const data = await response.json();
        console.log(data)

        // Переходим на страницу проектов
        if(isLogin) navigate('/projects');
        else window.location.reload()
      }
      else  {
        // Имитация ошибки от сервера
        throw new Error('Неверный email или пароль, либо пользователь уже существует');
      }
      
    } catch (error) {
      // Обрабатываем ошибки
      setApiError(error.message || 'Произошла ошибка при авторизации');

      showError({
        message: error.message,
        code: "unknown"
      })
    } finally {
      // Завершаем загрузку в любом случае
      setLoading(false);
    }
  };

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Обновляем данные формы
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Очищаем ошибку для этого поля, если пользователь начал вводить
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Также очищаем общую ошибку API
    if (apiError) {
      setApiError('');
    }
  };

  // Обработчик переключения между входом и регистрацией
  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    // Очищаем все ошибки при переключении
    setErrors({});
    setApiError('');
    // Можно также очистить форму, но это на твое усмотрение:
    // setFormData({ email: '', password: '' });
  };

  return (
    <div className={styles.auth}>
      <Header />
      
      <div className={styles['auth-content']}>
        <h2>{isLogin ? 'Вход в систему' : 'Создать аккаунт'}</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Поле UserName */}
          <div className={styles.inputGroup}>
            <input
              type="username"
              name="username"
              placeholder="Введите ваш username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? styles.error : ''}
              disabled={loading}
            />
            {errors.username && (
              <span className={styles.errorText}>{errors.username}</span>
            )}
          </div>
          {/* Поле Email */}
          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Введите ваш email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.error : ''}
              disabled={loading}
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>
          
          {/* Поле Пароль */}
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
            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
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
          
          {/* Ошибка от API */}
          {apiError && (
            <div className={styles.apiError}>
              {apiError}
            </div>
          )}
        </form>
        
        {/* Кнопка переключения режима */}
        <Button 
          onClick={handleToggleMode}
          variant='toggle'
          disabled={loading}
        >
          {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </Button>
      </div>
    </div>
  );
};

export default Auth;