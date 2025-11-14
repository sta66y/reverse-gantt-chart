import { useMemo } from 'react';

export const useTimeline = (dateRange) => {
  const timeUnits = useMemo(() => {
    const units = [];
    const currentDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    while (currentDate <= endDate) {
      units.push({
        date: new Date(currentDate),
        dayOfWeek: currentDate.getDay(),
        isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
        isToday: currentDate.toDateString() === new Date().toDateString()
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return units;
  }, [dateRange]);

  const getPositionFromDate = (date) => {
    const startTime = dateRange.start.getTime();
    const endTime = dateRange.end.getTime();
    const dateTime = new Date(date).getTime();
    
    const position = ((dateTime - startTime) / (endTime - startTime)) * 100;
    return Math.max(0, Math.min(100, position)); // Ограничиваем в пределах 0-100%
  };

  const getDateFromPosition = (percent) => {
    const startTime = dateRange.start.getTime();
    const endTime = dateRange.end.getTime();
    const time = startTime + (percent / 100) * (endTime - startTime);
    return new Date(time);
  };

  const snapToDay = (date) => {
    // Привязка к началу дня
    const snapped = new Date(date);
    snapped.setHours(0, 0, 0, 0);
    return snapped;
  };

  return {
    timeUnits,
    getPositionFromDate,
    getDateFromPosition,
    snapToDay
  };
};