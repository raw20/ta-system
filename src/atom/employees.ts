import type { Employee } from "@/types";
import { atom } from "jotai";

// 기본 상태들
export const employeesAtom = atom<Employee[]>([]);
export const employeesLoadingAtom = atom(false);
export const employeesErrorAtom = atom<string>("");

// 직원 목록 로드하는 async atom
export const loadEmployeesAtom = atom(
  null, // 읽기용 값 (사용 안 함)
  async (_, set) => {
    set(employeesLoadingAtom, true);
    set(employeesErrorAtom, "");

    try {
      const result = await window.electronAPI.employees.getAll();

      if (result.success) {
        set(employeesAtom, result.data || []);
      } else {
        set(employeesErrorAtom, result.error || "직원 목록 조회 실패");
      }
    } catch (err) {
      set(employeesErrorAtom, "API 호출 실패: " + err);
    } finally {
      set(employeesLoadingAtom, false);
    }
  }
);
