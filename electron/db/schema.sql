-- 근태관리 시스템 SQLite 스키마
-- electron/db/schema.sql

-- ========================================
-- 1. 직원 정보 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    emp_code TEXT UNIQUE NOT NULL,             -- 입사일 코드 (202502020 형태)
    name TEXT NOT NULL,                        -- 이름
    position TEXT NOT NULL,                    -- 직급 (파트장, 선임, 사원)
    department TEXT DEFAULT '은평사업장',      -- 부서
    hire_date DATE,                           -- 입사일
    status TEXT DEFAULT 'active',             -- 재직상태
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 2. 근무 조 정보 테이블
-- ========================================
CREATE TABLE work_shifts (
    shift_number INTEGER PRIMARY KEY,          -- 1~9조
    shift_name TEXT NOT NULL,                  -- '1조', '2조'  
    start_time TEXT NOT NULL,                  -- '08:00', '09:00'
    end_time TEXT,                            -- '16:00', '17:00'
    description TEXT                          -- 설명
);

-- ========================================
-- 3. 월 근무 계획 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS monthly_work_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER NOT NULL,                     -- 연도
    month INTEGER NOT NULL,                    -- 월
    emp_code TEXT NOT NULL,                    -- 직원 코드
    weekly_off_days TEXT,                      -- 주휴 (월화, 주휴 등)
    
    -- 1-31일 각 날짜별 상태
    day_01 TEXT, day_02 TEXT, day_03 TEXT, day_04 TEXT, day_05 TEXT,
    day_06 TEXT, day_07 TEXT, day_08 TEXT, day_09 TEXT, day_10 TEXT,
    day_11 TEXT, day_12 TEXT, day_13 TEXT, day_14 TEXT, day_15 TEXT,
    day_16 TEXT, day_17 TEXT, day_18 TEXT, day_19 TEXT, day_20 TEXT,
    day_21 TEXT, day_22 TEXT, day_23 TEXT, day_24 TEXT, day_25 TEXT,
    day_26 TEXT, day_27 TEXT, day_28 TEXT, day_29 TEXT, day_30 TEXT, day_31 TEXT,
    
    -- 집계 정보
    monthly_days INTEGER,                      -- 월일수
    total_days INTEGER,                        -- 총일수  
    holiday_days INTEGER,                      -- 휴무
    compensatory_days INTEGER,                 -- 대휴
    total_work_days INTEGER,                   -- 합계
    annual_leave_days INTEGER,                 -- 연차
    absent_days INTEGER,                       -- 결근
    support_days INTEGER,                      -- 지원
    etc_days INTEGER,                          -- 기타
    attendance_days INTEGER,                   -- 출근일수
    
    notes TEXT,                               -- 비고
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emp_code) REFERENCES employees(emp_code),
    UNIQUE(year, month, emp_code)
);

-- ========================================
-- 4. 근무편성표 테이블
-- ========================================
CREATE TABLE work_schedules (
    year INTEGER NOT NULL,
    month INTEGER NOT NULL, 
    day INTEGER NOT NULL,
    emp_code TEXT NOT NULL,                   -- 직원코드
    shift_number INTEGER NOT NULL,            -- 몇 조 (1~9)
    assignment_type TEXT,                     -- 'parking', 'cart', 'manager' 등
    status TEXT,                             -- '출근', '휴무', '연차' 등
    notes TEXT,
    FOREIGN KEY (emp_code) REFERENCES employees(emp_code),
    FOREIGN KEY (shift_number) REFERENCES work_shifts(shift_number),
    UNIQUE(year, month, day, emp_code)
);
-- ========================================
-- 5. 야간시간 관리 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS night_work_hours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    period_name TEXT NOT NULL,                -- 기간 (04월-05월 등)
    emp_code TEXT NOT NULL,                   -- 직원 코드
    work_date DATE NOT NULL,                  -- 근무일자
    night_hours REAL DEFAULT 0,              -- 야간시간 (3시간 기준)
    overtime_hours REAL DEFAULT 0,           -- 연장근무시간
    holiday_hours REAL DEFAULT 0,            -- 휴일근무시간
    total_hours REAL DEFAULT 0,              -- 총 시간
    notes TEXT,                               -- 비고
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emp_code) REFERENCES employees(emp_code),
    UNIQUE(period_name, emp_code, work_date)
);

-- ========================================
-- 6. 월 출근부 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS monthly_attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER NOT NULL,                     -- 연도
    month INTEGER NOT NULL,                    -- 월
    emp_code TEXT NOT NULL,                    -- 직원 코드
    employee_type TEXT DEFAULT '정규',         -- 직원 유형 (정규, 단시간)
    
    -- 일별 출근 시간 (1-31일) - JSON 형태로 저장
    attendance_data TEXT,                      -- JSON: {"01": {"in": "09:00", "out": "18:00"}, ...}
    
    -- 월별 집계
    total_work_hours REAL,                    -- 총 근무시간
    total_overtime_hours REAL,                -- 총 연장시간
    total_work_days INTEGER,                  -- 총 근무일수
    
    manager_approval TEXT,                    -- 관리 팀장 확인
    notes TEXT,                               -- 비고
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emp_code) REFERENCES employees(emp_code),
    UNIQUE(year, month, emp_code)
);

-- ========================================
-- 7. 월간 근무계획표 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS monthly_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER NOT NULL,                     -- 연도
    month INTEGER NOT NULL,                    -- 월
    emp_code TEXT NOT NULL,                    -- 직원 코드
    position TEXT,                            -- 구분 (파트장, 선임, 사원)
    
    -- 월간 통합 현황
    total_planned_days INTEGER,               -- 총 계획일수
    total_work_days INTEGER,                  -- 총 근무일수
    day_shift_count INTEGER DEFAULT 0,       -- 주간근무 횟수
    night_shift_count INTEGER DEFAULT 0,     -- 야간근무 횟수
    holiday_work_count INTEGER DEFAULT 0,    -- 휴일근무 횟수
    overtime_hours REAL DEFAULT 0,           -- 연장근무시간
    
    notes TEXT,                               -- 비고
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emp_code) REFERENCES employees(emp_code),
    UNIQUE(year, month, emp_code)
);

-- ========================================
-- 8. 연차현황 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS annual_leave_status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER NOT NULL,                     -- 연도
    month INTEGER NOT NULL,                    -- 월
    emp_code TEXT NOT NULL,                    -- 직원 코드
    
    -- 연차 정보
    total_annual_days REAL,                   -- 총 연차일수
    used_annual_days REAL DEFAULT 0,         -- 사용 연차일수
    remaining_days REAL,                      -- 잔여 연차일수
    carried_over_days REAL DEFAULT 0,        -- 이월 연차일수
    monthly_usage REAL DEFAULT 0,            -- 해당월 사용량
    
    notes TEXT,                               -- 비고
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emp_code) REFERENCES employees(emp_code),
    UNIQUE(year, month, emp_code)
);

-- ========================================
-- 9. 근무 코드 정의 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS work_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,                -- 코드 (M, P, C 등)
    description TEXT NOT NULL,                -- 설명
    color TEXT,                               -- 화면 표시 색상
    is_work_day INTEGER DEFAULT 1,           -- 근무일 여부 (0/1)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 인덱스 생성
-- ========================================
CREATE INDEX IF NOT EXISTS idx_monthly_work_plans_date ON monthly_work_plans(year, month);
CREATE INDEX IF NOT EXISTS idx_work_schedules_date ON work_schedules(year, month, day);
CREATE INDEX IF NOT EXISTS idx_night_work_hours_date ON night_work_hours(work_date);
CREATE INDEX IF NOT EXISTS idx_monthly_attendance_date ON monthly_attendance(year, month);
CREATE INDEX IF NOT EXISTS idx_monthly_schedules_date ON monthly_schedules(year, month);
CREATE INDEX IF NOT EXISTS idx_annual_leave_status_date ON annual_leave_status(year, month);

-- ========================================
-- 기본 데이터 삽입
-- ========================================

-- 직원 정보 (주석 예시)
INSERT OR IGNORE INTO employees (emp_code, name, position, hire_date) VALUES
('SAMPLE001', '샘플직원', '사원', '2025-01-01');


-- 근무 조 정보 (주석 예시)
INSERT OR IGNORE INTO work_shifts (shift_number, shift_name, start_time) VALUES
(1, '1조', '08:00'),
(2, '2조', '09:00'),
(3, '3조', '09:30'),
(4, '4조', '10:00'),
(5, '5조', '11:00'),
(6, '6조', '12:30'),
(7, '7조', '14:00'),
(8, '8조', '14:30'),
(9, '9조', '15:00'),

-- 근무 코드 정의
INSERT OR IGNORE INTO work_codes (code, description, color, is_work_day) VALUES
('M', '관리자', '#4CAF50', 1),
('P', '주차', '#2196F3', 1),
('C', '카트', '#9C27B0', 1),
('T', '타워', '#2196F3', 1),
('DO', '휴무', '#F44336', 0),
('AL', '연차', '#FF9800', 0),
('LA', '공가', '#607D8B', 0),
('CDO', '대체휴무', '#795548', 0),
('SL', '병가', '#E91E63', 0),
('SW', '지원근무', '#00BCD4', 1);