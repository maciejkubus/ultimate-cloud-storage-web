const isValidDate = (day: number, month: number, year: number, hour: number, minute: number): boolean  => {
    if (
      year < 1000 || year > 9999 ||
      month < 1 || month > 12 ||
      day < 1 || day > 31 ||
      hour < 0 || hour > 23 ||
      minute < 0 || minute > 59
    ) {
      return false;
    }
    const date = new Date(year, month - 1, day, hour, minute);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day &&
      date.getHours() === hour &&
      date.getMinutes() === minute
    );
  }

  export { isValidDate };
