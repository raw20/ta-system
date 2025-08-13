// 현재 월의 일수 계산
export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

// 요일 계산
export const getDayOfWeek = (year: number, month: number, day: number) => {
  const date = new Date(year, month - 1, day);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[date.getDay()];
};
