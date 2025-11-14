export const formatDate = (date) => {
  return date.toLocaleDateString('ru-RU');
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getDaysBetween = (startDate, endDate) => {
  return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
};

export const isDateInRange = (date, startDate, endDate) => {
  return date >= startDate && date <= endDate;
};