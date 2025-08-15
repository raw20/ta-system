import { isEditAtom, currentYearAtom, currentMonthAtom } from "@/atom/common";
import {
  employeesAtom,
  employeesLoadingAtom,
  employeesErrorAtom,
  loadEmployeesAtom,
} from "@/atom/employees";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

export const useMonthlyPlan = () => {
  // 상태 읽기/쓰기
  const [isEdit, setIsEdit] = useAtom(isEditAtom);
  const [currentYear, setCurrentYear] = useAtom(currentYearAtom);
  const [currentMonth, setCurrentMonth] = useAtom(currentMonthAtom);

  // 직원 관련 상태들
  const employees = useAtomValue(employeesAtom);
  const loading = useAtomValue(employeesLoadingAtom);
  const error = useAtomValue(employeesErrorAtom);
  const loadEmployees = useSetAtom(loadEmployeesAtom);

  // 월 변경 함수
  const changeMonth = (delta: number) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }

    setCurrentYear(newYear);
    setCurrentMonth(newMonth);

    // 또는 통합해서
    // setCurrentDate({ year: newYear, month: newMonth });
  };

  // 편집 모드 토글
  const toggleEditMode = () => {
    setIsEdit(!isEdit);
  };

  // 컴포넌트 마운트 시 직원 목록 로드
  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  return {
    // 상태
    isEdit,
    currentYear,
    currentMonth,
    employees,
    loading,
    error,

    // 액션
    setIsEdit,
    changeMonth,
    toggleEditMode,
    loadEmployees,
  };
};
