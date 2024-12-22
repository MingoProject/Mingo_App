import { formatDistance } from "date-fns";

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };

  export const formatDateDistance = (date: string | Date) => {
    const utcDate = new Date(date);
  
    const nowUtc = new Date(new Date().toISOString()); 
  
    return formatDistance(utcDate, nowUtc, { addSuffix: true });
  };

  export const millisToMMSS = (timeInMillis: number) => {
    const totalSeconds = Math.floor(timeInMillis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };