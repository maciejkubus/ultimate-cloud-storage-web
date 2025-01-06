import { months } from "./months";

export const formatDate = (date: string, format: string): string => {
  const dateObj = new Date(date);
  
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();
  const hour = dateObj.getHours();
  const minute = dateObj.getMinutes();
  const second = dateObj.getSeconds();

  const dayStr = day < 10 ? `0${day}` : day;
  const monthStr = month < 10 ? `0${month}` : month;
  const hourStr = hour < 10 ? `0${hour}` : hour;
  const minuteStr = minute < 10 ? `0${minute}` : minute;
  const secondStr = second < 10 ? `0${second}` : second;

  let formatStr = format;
  formatStr = formatStr.replace('DD', '' + dayStr);
  formatStr = formatStr.replace('M+', months[month - 1]);
  formatStr = formatStr.replace('MM', '' + monthStr);
  formatStr = formatStr.replace('YYYY', '' + year);
  formatStr = formatStr.replace('HH', '' + hourStr);
  formatStr = formatStr.replace('mm', '' + minuteStr);
  formatStr = formatStr.replace('ss', '' + secondStr);

  return formatStr;
}