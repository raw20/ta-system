// 직원 정보
export interface Employee {
  id?: number;
  emp_code: string;
  name: string;
  position: "파트장" | "선임" | "사원";
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
  year: number;
  month: number;
  day: number;
  emp_code: string;
  shift_number: number;
  assignment_type?: "parking" | "cart" | "manager";
  status: "출근" | "휴무" | "연차" | "공가" | "대휴";
  notes?: string;
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
  // ... (나머지 일들)
  day_31?: string;
  // 집계 정보
  monthly_days?: number;
  total_days?: number;
  holiday_days?: number;
  attendance_days?: number;
  notes?: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
