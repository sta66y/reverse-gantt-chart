export const calculateResourceLoad = (resourceTasks, totalDays) => {
  const busyDays = resourceTasks.reduce((total, task) => {
    return total + getDaysBetween(task.startDate, task.endDate);
  }, 0);
  
  return (busyDays / totalDays) * 100;
};

export const findOverlappingTasks = (tasks) => {
  const overlaps = [];
  
  for (let i = 0; i < tasks.length; i++) {
    for (let j = i + 1; j < tasks.length; j++) {
      if (isOverlapping(tasks[i], tasks[j])) {
        overlaps.push({ task1: tasks[i].id, task2: tasks[j].id });
      }
    }
  }
  
  return overlaps;
};

const isOverlapping = (task1, task2) => {
  return task1.startDate < task2.endDate && task2.startDate < task1.endDate;
};