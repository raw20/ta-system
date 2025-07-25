// types/database.ts

// 직원 정보
export interface Employee {
  id?: number;
  emp_code: string;
  name: string;
  position: "파트장" | "선임" | "조장" | "정규사원" | "단시간사원";
  department: string;
  hire_date: string;
  status: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
}

// 근무 조 정보
export interface WorkShift {
  shift_number: number;
  shift_name: string;
  start_time: string;
  end_time?: string;
  description?: string;
}

// 근무편성표
export interface WorkSchedule {
  id?: number;
  year: number;
  month: number;
  day: number;
  emp_code: string;
  shift_number: number;
  assignment_type?: "parking" | "cart" | "manager";
  status: "출근" | "휴무" | "연차" | "공가" | "대휴";
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// 월 근무 계획
export interface MonthlyWorkPlan {
  id?: number;
  year: number;
  month: number;
  emp_code: string;
  weekly_off_days?: string;
  // 일별 상태 (1-31일)
  day_01?: string;
  day_02?: string;
  day_03?: string;
  day_04?: string;
  day_05?: string;
  day_06?: string;
  day_07?: string;
  day_08?: string;
  day_09?: string;
  day_10?: string;
  day_11?: string;
  day_12?: string;
  day_13?: string;
  day_14?: string;
  day_15?: string;
  day_16?: string;
  day_17?: string;
  day_18?: string;
  day_19?: string;
  day_20?: string;
  day_21?: string;
  day_22?: string;
  day_23?: string;
  day_24?: string;
  day_25?: string;
  day_26?: string;
  day_27?: string;
  day_28?: string;
  day_29?: string;
  day_30?: string;
  day_31?: string;
  // 집계 정보
  monthly_days?: number;
  total_days?: number;
  holiday_days?: number;
  attendance_days?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// 야간시간
export interface NightHours {
  id?: number;
  year: number;
  month: number;
  day: number;
  emp_code: string;
  night_hours: number;
  work_type?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// 월 출근부
export interface MonthlyAttendance {
  id?: number;
  year: number;
  month: number;
  day: number;
  emp_code: string;
  employee_type: "regular" | "part_time"; // 정규/단시간
  attendance_status: "출근" | "결근" | "휴가" | "연차" | "공가";
  work_hours?: number;
  overtime_hours?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// 연차현황
export interface AnnualLeave {
  id?: number;
  year: number;
  emp_code: string;
  annual_leave_date: string; // 연차발생일
  total_days: number; // 발생
  used_days: number; // 사용
  remaining_days: number; // 잔여
  usage_details?: string; // 사용 내역 JSON
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
