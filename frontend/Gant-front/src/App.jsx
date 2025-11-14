import React, { useState } from 'react';
import ReverseGanttChart from './components/ReverseGanttChart/ReverseGanttChart';
import { initialResources, initialTasks } from './data/mockData';
//import './App.css';

function App() {
  const [resources, setResources] = useState(initialResources);
  const [tasks, setTasks] = useState(initialTasks);
  const [dateRange, setDateRange] = useState({
    start: new Date('2024-01-01'),
    end: new Date('2024-01-31')
  });

  return (
    <div className="app">
      <h1>Реверсивная диаграмма Ганта</h1>
      <div className="controls">
        <button onClick={() => setDateRange(prev => ({
          start: new Date(prev.start.setMonth(prev.start.getMonth() - 1)),
          end: new Date(prev.end.setMonth(prev.end.getMonth() - 1))
        }))}>
          ← Предыдущий месяц
        </button>
        <span>
          {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
        </span>
        <button onClick={() => setDateRange(prev => ({
          start: new Date(prev.start.setMonth(prev.start.getMonth() + 1)),
          end: new Date(prev.end.setMonth(prev.end.getMonth() + 1))
        }))}>
          Следующий месяц →
        </button>
      </div>
      <ReverseGanttChart
        resources={resources}
        tasks={tasks}
        dateRange={dateRange}
        onTaskUpdate={(taskId, updates) => {
          setTasks(prev => prev.map(task => 
            task.id === taskId ? { ...task, ...updates } : task
          ));
        }}
      />
    </div>
  );
}

export default App;