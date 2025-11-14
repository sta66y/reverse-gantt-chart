import React, { useState, useRef } from 'react';
import { formatDate, getDaysBetween } from '../../utils/dateHelpers';
import './TaskBar.css';

const TaskBar = ({ 
  task, 
  getPositionFromDate, 
  getDateFromPosition, 
  onMove, 
  onResize 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const barRef = useRef(null);

  const startPosition = getPositionFromDate(task.startDate);
  const endPosition = getPositionFromDate(task.endDate);
  const width = Math.max(endPosition - startPosition, 1);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeStart = (direction, e) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !barRef.current) return;

    const timelineRect = barRef.current.parentElement.getBoundingClientRect();
    const relativeX = e.clientX - timelineRect.left;
    const percent = (relativeX / timelineRect.width) * 100;
    
    const newStartDate = getDateFromPosition(percent - width / 2);
    const newEndDate = getDateFromPosition(percent + width / 2);

    onMove(task.id, newStartDate, newEndDate);
  };

  const handleResizeMove = (e) => {
    if (!isResizing || !barRef.current) return;

    const timelineRect = barRef.current.parentElement.getBoundingClientRect();
    const relativeX = e.clientX - timelineRect.left;
    const percent = (relativeX / timelineRect.width) * 100;

    let newStartDate = task.startDate;
    let newEndDate = task.endDate;

    if (resizeDirection === 'left') {
      newStartDate = getDateFromPosition(percent);
    } else if (resizeDirection === 'right') {
      newEndDate = getDateFromPosition(percent);
    }

    // Проверяем, чтобы дата начала была раньше даты окончания
    if (newStartDate < newEndDate) {
      onResize(task.id, newStartDate, newEndDate);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeDirection(null);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  const getProgressStyle = () => {
    return {
      width: `${task.progress}%`,
      backgroundColor: 'rgba(255, 255, 255, 0.3)'
    };
  };

  const getPriorityStyle = () => {
    const priorityStyles = {
      high: { borderLeft: '3px solid #dc2626' },
      medium: { borderLeft: '3px solid #ea580c' },
      low: { borderLeft: '3px solid #059669' }
    };
    return priorityStyles[task.priority] || {};
  };

  return (
    <div
      ref={barRef}
      className={`task-bar ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
      style={{
        left: `${startPosition}%`,
        width: `${width}%`,
        backgroundColor: task.color,
        ...getPriorityStyle()
      }}
      onMouseDown={handleMouseDown}
      title={`${task.name}\n${formatDate(task.startDate)} - ${formatDate(task.endDate)}\nПрогресс: ${task.progress}%`}
    >
      {/* Прогресс задачи */}
      <div className="task-progress" style={getProgressStyle()} />
      
      {/* Текст задачи */}
      <div className="task-content">
        <span className="task-name">{task.name}</span>
        <span className="task-dates">
          {getDaysBetween(task.startDate, task.endDate)}д
        </span>
      </div>

      {/* Ручки изменения размера */}
      <div 
        className="resize-handle left"
        onMouseDown={(e) => handleResizeStart('left', e)}
      />
      <div 
        className="resize-handle right"
        onMouseDown={(e) => handleResizeStart('right', e)}
      />

      {/* Индикатор прогресса в процентах */}
      <div className="task-progress-indicator">
        {task.progress}%
      </div>
    </div>
  );
};

export default TaskBar;