import React from 'react';
import ResourceRow from './ResourceRow';
import { useTimeline } from '../hooks/useTimeline';
import './styles.css';

const ReverseGanttChart = ({ resources, tasks, dateRange, onTaskUpdate }) => {
  const { timeUnits, getPositionFromDate, getDateFromPosition } = useTimeline(dateRange);

  const handleTaskMove = (taskId, newStartDate, newEndDate) => {
    onTaskUpdate(taskId, {
      startDate: newStartDate,
      endDate: newEndDate
    });
  };

  const handleTaskResize = (taskId, newStartDate, newEndDate) => {
    onTaskUpdate(taskId, {
      startDate: newStartDate,
      endDate: newEndDate
    });
  };

  return (
    <div className="reverse-gantt">
      <div className="gantt-body">
        {resources.map(resource => (
          <ResourceRow
            key={resource.id}
            resource={resource}
            tasks={tasks.filter(task => task.resourceId === resource.id)}
            timeUnits={timeUnits}
            getPositionFromDate={getPositionFromDate}
            getDateFromPosition={getDateFromPosition}
            onTaskMove={handleTaskMove}
            onTaskResize={handleTaskResize}
            onWheel={(e) => {
            // Горизонтальный скролл при Shift+колесико
              if (e.shiftKey) {
              e.preventDefault();
              containerRef.current.scrollLeft += e.deltaY;
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ReverseGanttChart;