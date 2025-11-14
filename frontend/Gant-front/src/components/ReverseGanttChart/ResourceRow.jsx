import React from 'react';
import TaskBar from '../common/TaskBar/TaskBar';

const ResourceRow = ({ 
  resource, 
  tasks, 
  timeUnits, 
  getPositionFromDate, 
  getDateFromPosition,
  onTaskMove,
  onTaskResize
}) => {
  return (
    <div className="resource-row">
      {/* <div className="resource-info">
        <div className="resource-name">{resource.name}</div>
        <div className="resource-type">{resource.type}</div>
        <div className="resource-department">{resource.department}</div>
        <div className="resource-load">
          Загрузка: {Math.round((tasks.reduce((sum, task) => sum + 
            (new Date(task.endDate) - new Date(task.startDate)) / (24 * 60 * 60 * 1000), 0) / 
          timeUnits.length) * 100)}%
        </div>
      </div> */}
      
      <div className="resource-timeline">
        {timeUnits.map((unit, index) => (
          <div 
            key={index} 
            className={`time-unit ${unit.isWeekend ? 'weekend' : ''} ${unit.isToday ? 'today' : ''}`}
          />
        ))}
        
        {tasks.map(task => (
          <TaskBar
            key={task.id}
            task={task}
            getPositionFromDate={getPositionFromDate}
            getDateFromPosition={getDateFromPosition}
            onMove={onTaskMove}
            onResize={onTaskResize}
          />
        ))}
      </div>
    </div>
  );
};

export default ResourceRow;