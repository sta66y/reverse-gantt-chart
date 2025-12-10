// pages/Project/components/GanttChart/GanttChart.jsx
import { useState, useMemo } from "react";
import styles from "./GanttChart.module.css";

const GanttChart = ({
  tasks,
  onTaskSelect,
  onTaskEdit,
  onTaskStatusChange,
  onReviewerStatusChange,
  onAddSubtask,
  onDeleteTask,
  onShowComments,
  onTaskAssign
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState(new Set());

  // Константы для точного соответствия
  const LEFT_PANEL_WIDTH = 350;
  const DAY_WIDTH = 40; // Фиксированная ширина дня

  // Вычисление временного диапазона
  const { minDate, maxDate, days } = useMemo(() => {
    if (tasks.length === 0) {
      const today = new Date();
      const defaultMax = new Date(today);
      defaultMax.setMonth(today.getMonth() + 1);
      return {
        minDate: today,
        maxDate: defaultMax,
        days: 31,
      };
    }

    const allDates = getAllDates(tasks);
    const minDate = new Date(Math.min(...allDates));
    const maxDate = new Date(Math.max(...allDates));

    minDate.setDate(minDate.getDate() - 5);
    maxDate.setDate(maxDate.getDate() + 5);

    const days = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1;

    return { minDate, maxDate, days };
  }, [tasks]);

  // Отрисовка дат
  const renderDatesRow = () => {
    return (
      <div className={styles.datesRow}>
        {/* Отступ для левой панели */}
        <div
          className={styles.datesSpacer}
          style={{ width: `${LEFT_PANEL_WIDTH}px` }}
        ></div>

        {/* Даты */}
        <div className={styles.datesContainer}>
          {Array.from({ length: days }, (_, i) => {
            const date = addDays(minDate, i);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const isFirstOfMonth = date.getDate() === 1;

            return (
              <div
                key={i}
                className={`${styles.dateCell} ${
                  isWeekend ? styles.weekend : ""
                } ${isFirstOfMonth ? styles.firstOfMonth : ""}`}
                style={{ width: `${DAY_WIDTH}px` }}
              >
                <div className={styles.dayNumber}>{date.getDate()}</div>
                {isFirstOfMonth && (
                  <div className={styles.monthName}>{getMonthName(date)}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Отрисовка сетки
  const renderGrid = () => {
    return Array.from({ length: days }, (_, i) => (
      <div
        key={i}
        className={styles.gridLine}
        style={{
          left: `${LEFT_PANEL_WIDTH + i * DAY_WIDTH}px`,
          width: `${DAY_WIDTH}px`,
        }}
      />
    ));
  };

  // Функции для получения иконок статусов
  const getStatusIcon = (status) => {
    const icons = {
      Planned: "📅",
      "In process": "⚙️",
      Completed: "✅",
      Delayed: "⏸️",
    };
    return icons[status] || "📋";
  };

  const getReviewerStatusIcon = (reviewerStatus) => {
    const icons = {
      None: "👁️",
      Accepted: "👍",
      Rejected: "👎",
    };
    return icons[reviewerStatus] || "❓";
  };

  // Отрисовка задачи
  const renderTask = (task, level = 0) => {
    const isExpanded = expandedTasks.has(task.id);
    const hasChildren = task.children && task.children.length > 0;

    const startOffset = getDayOffset(new Date(task.startDate), minDate);
    const duration =
      getDayOffset(new Date(task.endDate), new Date(task.startDate)) + 1;

    const taskLeft = startOffset * DAY_WIDTH;
    const taskWidth = duration * DAY_WIDTH;

    return (
      <div key={task.id} className={styles.taskRowWrapper}>
        <div
          className={`${styles.taskRow} ${
            selectedTaskId === task.id ? styles.selected : ""
          }`}
          onClick={() => setSelectedTaskId(task.id)}
        >
          {/* Левая панель - фиксированная */}
          <div
            className={styles.taskInfo}
            style={{ width: `${LEFT_PANEL_WIDTH}px` }}
          >
            <div className={styles.taskInfoContent}>
              {/* Кнопка развертывания */}
              <button
                className={styles.expandButton}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasChildren) toggleTask(task.id);
                }}
                disabled={!hasChildren}
              >
                {hasChildren ? (isExpanded ? "−" : "+") : "•"}
              </button>

              {/* Кругляшок статуса проверки */}
              <div
                className={styles.reviewerStatus}
                data-status={task.reviewerStatus}
                title={getReviewerStatusTitle(task.reviewerStatus)}
              />

              <span
                className={styles.taskTitle}
                style={{ paddingLeft: `${level * 12}px` }}
              >
                {task.title}
              </span>

              <div className={styles.taskActions}>
                {/* Кнопка комментариев */}
                <button
                  className={styles.commentButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowComments(task);
                  }}
                  title="Комментарии"
                >
                  💬 {task.comments?.length || 0}
                </button>

                {/* Кнопка изменения статуса задачи */}
                <button
                  className={styles.statusButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskStatusChange(task);
                  }}
                  title="Изменить статус задачи"
                  data-status={task.status}
                >
                  {getStatusIcon(task.status)}
                </button>

                {/* Кнопка изменения статуса проверки */}
                <button
                  className={styles.reviewerButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReviewerStatusChange(task);
                  }}
                  title="Изменить статус проверки"
                  data-reviewer-status={task.reviewerStatus}
                >
                  {getReviewerStatusIcon(task.reviewerStatus)}
                </button>

                {/* Кнопка добавления подзадачи */}
                <button
                  className={styles.actionButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddSubtask(task.id);
                  }}
                  title="Добавить подзадачу"
                >
                  +
                </button>

                <button onClick={() => onTaskEdit(task)} title="Редактировать">
                  ✏️
                </button>

                {/* Кнопка удаления */}
                <button
                  className={styles.actionButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id);
                  }}
                  title="Удалить"
                >
                  🗑️
                </button>
                {/* В TaskActions добавьте кнопку назначения */}
                <button
                  className={styles.assignButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskAssign && onTaskAssign(task);
                  }}
                  title="Назначить задачу"
                >
                  👥
                </button>
              </div>
            </div>
          </div>

          {/* Правая панель - скроллируется */}
          <div className={styles.timelineArea}>
            <div
              className={styles.taskBar}
              style={{
                left: `${taskLeft}px`,
                width: `${taskWidth}px`,
              }}
              data-status={task.status}
              data-level={level}
            >
              <span className={styles.taskLabel}>
                {getStatusText(task.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Дочерние задачи */}
        {isExpanded && hasChildren && (
          <div className={styles.children}>
            {task.children.map((child) => renderTask(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const toggleTask = (taskId) => {
    setExpandedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  // Общая ширина холста
  const canvasWidth = LEFT_PANEL_WIDTH + days * DAY_WIDTH;

  return (
    <div className={styles.ganttChart}>
      {/* ТОЛЬКО заголовок "Задачи" фиксированный */}
      <div className={styles.fixedHeader}>
        <div
          className={styles.taskHeader}
          style={{ width: `${LEFT_PANEL_WIDTH}px` }}
        >
          Задачи
        </div>
      </div>

      {/* ВСЁ остальное - даты и задачи - в одном скроллящемся контейнере */}
      <div className={styles.scrollContainer}>
        <div className={styles.canvas} style={{ width: `${canvasWidth}px` }}>
          {/* Даты - ПЕРВАЯ СТРОКА ХОЛСТА */}
          {renderDatesRow()}

          {/* Сетка - ТОЧНО под датами */}
          <div className={styles.grid}>{renderGrid()}</div>

          {/* Задачи */}
          <div className={styles.tasksContainer}>
            {tasks.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Нет задач. Добавьте первую задачу!</p>
              </div>
            ) : (
              tasks.map((task) => renderTask(task))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Вспомогательные функции для статусов
const getStatusText = (status) => {
  const statusMap = {
    Planned: "Запланировано",
    "In process": "В процессе",
    Completed: "Завершено",
    Delayed: "Отложено",
  };
  return statusMap[status] || status;
};

const getReviewerStatusTitle = (reviewerStatus) => {
  const titleMap = {
    None: "Не проверялась",
    Accepted: "Принята проверяющим",
    Rejected: "Отклонена проверяющим",
  };
  return titleMap[reviewerStatus] || reviewerStatus;
};

// Вспомогательные функции для дат
const getAllDates = (tasks) => {
  const dates = [];

  const processTask = (task) => {
    if (task.startDate) dates.push(new Date(task.startDate).getTime());
    if (task.endDate) dates.push(new Date(task.endDate).getTime());

    if (task.children) {
      task.children.forEach(processTask);
    }
  };

  tasks.forEach(processTask);
  return dates.length > 0 ? dates : [new Date().getTime()];
};

const getDayOffset = (date, startDate) => {
  return Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const getMonthName = (date) => {
  const months = [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек",
  ];
  return months[date.getMonth()];
};

export default GanttChart;
