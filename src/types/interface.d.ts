import {
  Employee,
  WorkShift,
  WorkSchedule,
  MonthlyWorkPlan,
  NightHours,
  MonthlyAttendance,
  AnnualLeave,
  ApiResponse,
} from "./database";

// 직원 관리 API
export interface EmployeeAPI {
  getAll: () => Promise<ApiResponse<Employee[]>>;
  getById: (id: number) => Promise<ApiResponse<Employee>>;
  getByCode: (empCode: string) => Promise<ApiResponse<Employee>>;
  create: (
    employee: Omit<Employee, "id" | "created_at" | "updated_at">
  ) => Promise<ApiResponse<Employee>>;
  update: (
    id: number,
    employee: Partial<Employee>
  ) => Promise<ApiResponse<Employee>>;
  delete: (id: number) => Promise<ApiResponse<void>>;
}

// 근무 조 관리 API
export interface WorkShiftAPI {
  getAll: () => Promise<ApiResponse<WorkShift[]>>;
  getById: (shiftNumber: number) => Promise<ApiResponse<WorkShift>>;
  create: (shift: WorkShift) => Promise<ApiResponse<WorkShift>>;
  update: (
    shiftNumber: number,
    shift: Partial<WorkShift>
  ) => Promise<ApiResponse<WorkShift>>;
  delete: (shiftNumber: number) => Promise<ApiResponse<void>>;
}

// 근무편성표 API
export interface WorkScheduleAPI {
  getAll: () => Promise<ApiResponse<WorkSchedule[]>>;
  getByMonth: (
    year: number,
    month: number
  ) => Promise<ApiResponse<WorkSchedule[]>>;
  getByEmployee: (
    empCode: string,
    year: number,
    month: number
  ) => Promise<ApiResponse<WorkSchedule[]>>;
  getByDay: (
    year: number,
    month: number,
    day: number
  ) => Promise<ApiResponse<WorkSchedule[]>>;
  create: (
    schedule: Omit<WorkSchedule, "id" | "created_at" | "updated_at">
  ) => Promise<ApiResponse<WorkSchedule>>;
  update: (
    id: number,
    schedule: Partial<WorkSchedule>
  ) => Promise<ApiResponse<WorkSchedule>>;
  delete: (id: number) => Promise<ApiResponse<void>>;
  exportToExcel: (year: number, month: number) => Promise<ApiResponse<string>>;
}

// 월 근무 계획 API
export interface MonthlyWorkPlanAPI {
  getAll: () => Promise<ApiResponse<MonthlyWorkPlan[]>>;
  getByMonth: (
    year: number,
    month: number
  ) => Promise<ApiResponse<MonthlyWorkPlan[]>>;
  getByEmployee: (
    empCode: string,
    year: number,
    month: number
  ) => Promise<ApiResponse<MonthlyWorkPlan>>;
  create: (
    plan: Omit<MonthlyWorkPlan, "id" | "created_at" | "updated_at">
  ) => Promise<ApiResponse<MonthlyWorkPlan>>;
  update: (
    id: number,
    plan: Partial<MonthlyWorkPlan>
  ) => Promise<ApiResponse<MonthlyWorkPlan>>;
  delete: (id: number) => Promise<ApiResponse<void>>;
  exportToExcel: (year: number, month: number) => Promise<ApiResponse<string>>;
}

// 야간시간 API
export interface NightHoursAPI {
  getAll: () => Promise<ApiResponse<NightHours[]>>;
  getByMonth: (
    year: number,
    month: number
  ) => Promise<ApiResponse<NightHours[]>>;
  getByEmployee: (
    empCode: string,
    year: number,
    month: number
  ) => Promise<ApiResponse<NightHours[]>>;
  getByDay: (
    year: number,
    month: number,
    day: number
  ) => Promise<ApiResponse<NightHours[]>>;
  create: (
    nightHour: Omit<NightHours, "id" | "created_at" | "updated_at">
  ) => Promise<ApiResponse<NightHours>>;
  update: (
    id: number,
    nightHour: Partial<NightHours>
  ) => Promise<ApiResponse<NightHours>>;
  delete: (id: number) => Promise<ApiResponse<void>>;
  exportToExcel: (year: number, month: number) => Promise<ApiResponse<string>>;
}

// 월 출근부 API
export interface MonthlyAttendanceAPI {
  getAll: () => Promise<ApiResponse<MonthlyAttendance[]>>;
  getByMonth: (
    year: number,
    month: number
  ) => Promise<ApiResponse<MonthlyAttendance[]>>;
  getByEmployee: (
    empCode: string,
    year: number,
    month: number
  ) => Promise<ApiResponse<MonthlyAttendance[]>>;
  getByDay: (
    year: number,
    month: number,
    day: number
  ) => Promise<ApiResponse<MonthlyAttendance[]>>;
  create: (
    attendance: Omit<MonthlyAttendance, "id" | "created_at" | "updated_at">
  ) => Promise<ApiResponse<MonthlyAttendance>>;
  update: (
    id: number,
    attendance: Partial<MonthlyAttendance>
  ) => Promise<ApiResponse<MonthlyAttendance>>;
  delete: (id: number) => Promise<ApiResponse<void>>;
  exportToExcel: (year: number, month: number) => Promise<ApiResponse<string>>;
}

// 연차현황 API
export interface AnnualLeaveAPI {
  getAll: () => Promise<ApiResponse<AnnualLeave[]>>;
  getByYear: (year: number) => Promise<ApiResponse<AnnualLeave[]>>;
  getByEmployee: (
    empCode: string,
    year?: number
  ) => Promise<ApiResponse<AnnualLeave[]>>;
  create: (
    leave: Omit<AnnualLeave, "id" | "created_at" | "updated_at">
  ) => Promise<ApiResponse<AnnualLeave>>;
  update: (
    id: number,
    leave: Partial<AnnualLeave>
  ) => Promise<ApiResponse<AnnualLeave>>;
  delete: (id: number) => Promise<ApiResponse<void>>;
  exportToExcel: (year: number) => Promise<ApiResponse<string>>;
}

// 메인 Electron API 인터페이스
export interface IElectronAPI {
  // 직원 관리
  employees: EmployeeAPI;

  // 근무 조 관리
  workShifts: WorkShiftAPI;

  // 근태 관리 기능들
  workSchedules: WorkScheduleAPI;
  monthlyWorkPlans: MonthlyWorkPlanAPI;
  nightHours: NightHoursAPI;
  monthlyAttendance: MonthlyAttendanceAPI;
  annualLeave: AnnualLeaveAPI;

  // 시스템 기능
  loadPreferences: () => Promise<ApiResponse<Record<string, unknown>>>;
  savePreferences: (
    preferences: Record<string, unknown>
  ) => Promise<ApiResponse<void>>;
  exportAllToExcel: (
    year: number,
    month: number
  ) => Promise<ApiResponse<string>>;
  importFromExcel: (filePath: string) => Promise<ApiResponse<void>>;
  backupData: () => Promise<ApiResponse<string>>;
  restoreData: (backupPath: string) => Promise<ApiResponse<void>>;
}

// 전역 Window 인터페이스 확장
declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
