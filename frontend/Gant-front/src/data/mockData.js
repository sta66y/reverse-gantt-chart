export const initialResources = [
  { id: 1, name: 'Иван Петров', type: 'Разработчик', department: 'IT' },
  { id: 2, name: 'Мария Сидорова', type: 'Дизайнер', department: 'Design' },
  { id: 3, name: 'Алексей Козлов', type: 'Аналитик', department: 'Business' },
  { id: 4, name: 'Елена Волкова', type: 'Тестировщик', department: 'QA' },
  { id: 5, name: 'Дмитрий Орлов', type: 'Менеджер', department: 'Management' }
];

export const initialTasks = [
  {
    id: 1,
    resourceId: 1,
    name: 'Разработка авторизации',
    startDate: new Date('2024-01-02'),
    endDate: new Date('2024-01-10'),
    progress: 100,
    color: '#4f46e5',
    priority: 'high'
  },
  {
    id: 2,
    resourceId: 1,
    name: 'Интеграция с API',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-25'),
    progress: 75,
    color: '#059669',
    priority: 'medium'
  },
  {
    id: 3,
    resourceId: 2,
    name: 'Дизайн системы',
    startDate: new Date('2024-01-05'),
    endDate: new Date('2024-01-20'),
    progress: 100,
    color: '#dc2626',
    priority: 'high'
  },
  {
    id: 4,
    resourceId: 3,
    name: 'Сбор требований',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-08'),
    progress: 100,
    color: '#7c3aed',
    priority: 'medium'
  },
  {
    id: 5,
    resourceId: 4,
    name: 'Тестирование модулей',
    startDate: new Date('2024-01-18'),
    endDate: new Date('2024-01-30'),
    progress: 50,
    color: '#ea580c',
    priority: 'low'
  }
];