import { date } from 'quasar';

export function useDate() {
  const formatDate = (dateString: string | number | Date, format = 'YYYY/MM/DD') => {
    return date.formatDate(dateString, format);
  };

  return {
    formatDate,
  };
}
