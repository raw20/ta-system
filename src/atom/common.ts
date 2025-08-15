import { atom } from "jotai";

// 편집 모드 상태
export const isEditAtom = atom(false);

// 현재 선택된 년월
export const currentYearAtom = atom(new Date().getFullYear());
export const currentMonthAtom = atom(new Date().getMonth() + 1);
