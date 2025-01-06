export const getMonthLenght = (monthIndex: number, year: number) => {
  const monthsLength = [
    31, // January
    28, // February (non-leap year)
    31, // March
    30, // April
    31, // May
    30, // June
    31, // July
    31, // August
    30, // September
    31, // October
    30, // November
    31  // December
  ];

  if(monthIndex == 1 && year % 4 == 0 ) {
    return 29
  }

  return monthsLength[monthIndex];
}