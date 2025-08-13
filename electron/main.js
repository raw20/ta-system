import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { initDatabase, getDatabase, closeDatabase } from "./db/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDev = process.env.NODE_ENV === "development";
let mainWindow;

function createWindow() {
  const preloadPath = join(__dirname, "preload.js");
  console.log("🔍 Preload path:", preloadPath);

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
    },
  });

  // 개발 환경에서는 무조건 localhost 사용
  mainWindow.loadURL("http://localhost:5173");

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  console.log("🚀 Electron app ready");

  // 데이터베이스 초기화
  try {
    initDatabase();
    console.log("✅ 데이터베이스 초기화 성공");
  } catch (error) {
    console.error("❌ 데이터베이스 초기화 실패:", error);
  }

  createWindow();
});

// ========================================
// 1. 직원 관리 API
// ========================================

// 직원 목록 조회
ipcMain.handle("employees:get-all", async () => {
  try {
    const db = getDatabase();
    const employees = db.prepare("SELECT * FROM employees ORDER BY name").all();
    return { success: true, data: employees };
  } catch (error) {
    console.error("직원 목록 조회 실패:", error);
    return { success: false, error: error.message };
  }
});

// 특정 직원 조회
ipcMain.handle("employees:get-by-id", async (event, employeeId) => {
  try {
    const db = getDatabase();
    const employee = db
      .prepare("SELECT * FROM employees WHERE id = ?")
      .get(employeeId);

    if (!employee) {
      return { success: false, error: "해당 ID의 직원을 찾을 수 없습니다." };
    }

    return { success: true, data: employee };
  } catch (error) {
    console.error("직원 조회 실패:", error);
    return { success: false, error: error.message };
  }
});

// 직원 추가
ipcMain.handle("employees:create", async (event, employee) => {
  try {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO employees (emp_code, name, position, role, hire_date, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      employee.emp_code,
      employee.name,
      employee.position,
      employee.role,
      employee.hire_date,
      employee.status || "active"
    );

    return { success: true, data: { id: result.lastInsertRowid } };
  } catch (error) {
    console.error("직원 추가 실패:", error);
    return { success: false, error: error.message };
  }
});

// 직원 수정
ipcMain.handle("employees:update", async (event, id, employee) => {
  try {
    const db = getDatabase();
    const stmt = db.prepare(`
      UPDATE employees 
      SET emp_code = ?, name = ?, position = ?, role = ?, hire_date = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = stmt.run(
      employee.emp_code,
      employee.name,
      employee.position,
      employee.role,
      employee.hire_date,
      employee.status,
      id
    );

    return { success: true, data: { changes: result.changes } };
  } catch (error) {
    console.error("직원 수정 실패:", error);
    return { success: false, error: error.message };
  }
});

// 직원 삭제
ipcMain.handle("employees:delete", async (event, id) => {
  try {
    const db = getDatabase();
    const stmt = db.prepare("DELETE FROM employees WHERE id = ?");
    const result = stmt.run(id);

    return { success: true, data: { changes: result.changes } };
  } catch (error) {
    console.error("직원 삭제 실패:", error);
    return { success: false, error: error.message };
  }
});
app.on("window-all-closed", () => {
  closeDatabase();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// ========================================
// 2. 월 근무계획 API (update: 250808 1922)
// ========================================

// 모든 월 근무계획 조회
ipcMain.handle("monthly-plans:get-all", async () => {
  try {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT mp.*, e.name as employee_name, e.position 
      FROM monthly_work_plans mp
      JOIN employees e ON mp.emp_code = e.emp_code
      ORDER BY mp.year DESC, mp.month DESC, e.name
    `);

    const plans = stmt.all();
    return { success: true, data: plans };
  } catch (error) {
    console.error("전체 월 근무계획 조회 실패:", error);
    return { success: false, error: error.message };
  }
});

// 특정 년월의 월 근무계획 조회
ipcMain.handle("monthly-plans:get-by-month", async (event, year, month) => {
  try {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT mp.*, e.name as employee_name, e.position 
      FROM monthly_work_plans mp
      JOIN employees e ON mp.emp_code = e.emp_code
      WHERE mp.year = ? AND mp.month = ?
      ORDER BY e.name
    `);

    const plans = stmt.all(year, month);
    return { success: true, data: plans };
  } catch (error) {
    console.error("월 근무계획 조회 실패:", error);
    return { success: false, error: error.message };
  }
});

// 특정 직원의 특정 년월 근무계획 조회
ipcMain.handle(
  "monthly-plans:get-by-employee",
  async (event, empCode, year, month) => {
    try {
      const db = getDatabase();
      const stmt = db.prepare(`
      SELECT mp.*, e.name as employee_name, e.position 
      FROM monthly_work_plans mp
      JOIN employees e ON mp.emp_code = e.emp_code
      WHERE mp.emp_code = ? AND mp.year = ? AND mp.month = ?
    `);

      const plan = stmt.get(empCode, year, month);
      return { success: true, data: plan };
    } catch (error) {
      console.error("직원 월 근무계획 조회 실패:", error);
      return { success: false, error: error.message };
    }
  }
);

// 월 근무계획 생성
ipcMain.handle("monthly-plans:create", async (event, planData) => {
  try {
    const db = getDatabase();

    // 중복 체크
    const existingStmt = db.prepare(
      "SELECT id FROM monthly_work_plans WHERE year = ? AND month = ? AND emp_code = ?"
    );
    const existing = existingStmt.get(
      planData.year,
      planData.month,
      planData.emp_code
    );

    if (existing) {
      return {
        success: false,
        error: "해당 직원의 해당 년월 계획이 이미 존재합니다.",
      };
    }

    const insertStmt = db.prepare(`
      INSERT INTO monthly_work_plans (
        year, month, emp_code, weekly_off_days,
        day_01, day_02, day_03, day_04, day_05, day_06, day_07, day_08, day_09, day_10,
        day_11, day_12, day_13, day_14, day_15, day_16, day_17, day_18, day_19, day_20,
        day_21, day_22, day_23, day_24, day_25, day_26, day_27, day_28, day_29, day_30, day_31,
        monthly_days, total_days, holiday_days, compensatory_days, total_work_days,
        annual_leave_days, absent_days, support_days, etc_days, attendance_days, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(
      planData.year,
      planData.month,
      planData.emp_code,
      planData.weekly_off_days,
      planData.day_01,
      planData.day_02,
      planData.day_03,
      planData.day_04,
      planData.day_05,
      planData.day_06,
      planData.day_07,
      planData.day_08,
      planData.day_09,
      planData.day_10,
      planData.day_11,
      planData.day_12,
      planData.day_13,
      planData.day_14,
      planData.day_15,
      planData.day_16,
      planData.day_17,
      planData.day_18,
      planData.day_19,
      planData.day_20,
      planData.day_21,
      planData.day_22,
      planData.day_23,
      planData.day_24,
      planData.day_25,
      planData.day_26,
      planData.day_27,
      planData.day_28,
      planData.day_29,
      planData.day_30,
      planData.day_31,
      planData.monthly_days,
      planData.total_days,
      planData.holiday_days,
      planData.compensatory_days,
      planData.total_work_days,
      planData.annual_leave_days,
      planData.absent_days,
      planData.support_days,
      planData.etc_days,
      planData.attendance_days,
      planData.notes
    );

    // 생성된 데이터 조회해서 반환
    const createdPlan = db
      .prepare(
        `
      SELECT mp.*, e.name as employee_name, e.position 
      FROM monthly_work_plans mp
      JOIN employees e ON mp.emp_code = e.emp_code
      WHERE mp.id = ?
    `
      )
      .get(result.lastInsertRowid);

    return { success: true, data: createdPlan };
  } catch (error) {
    console.error("월 근무계획 생성 실패:", error);
    return { success: false, error: error.message };
  }
});

// 월 근무계획 수정
ipcMain.handle("monthly-plans:update", async (event, id, planData) => {
  try {
    const db = getDatabase();

    const updateStmt = db.prepare(`
      UPDATE monthly_work_plans 
      SET weekly_off_days = ?, 
          day_01 = ?, day_02 = ?, day_03 = ?, day_04 = ?, day_05 = ?,
          day_06 = ?, day_07 = ?, day_08 = ?, day_09 = ?, day_10 = ?,
          day_11 = ?, day_12 = ?, day_13 = ?, day_14 = ?, day_15 = ?,
          day_16 = ?, day_17 = ?, day_18 = ?, day_19 = ?, day_20 = ?,
          day_21 = ?, day_22 = ?, day_23 = ?, day_24 = ?, day_25 = ?,
          day_26 = ?, day_27 = ?, day_28 = ?, day_29 = ?, day_30 = ?, day_31 = ?,
          monthly_days = ?, total_days = ?, holiday_days = ?, compensatory_days = ?,
          total_work_days = ?, annual_leave_days = ?, absent_days = ?, support_days = ?,
          etc_days = ?, attendance_days = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = updateStmt.run(
      planData.weekly_off_days,
      planData.day_01,
      planData.day_02,
      planData.day_03,
      planData.day_04,
      planData.day_05,
      planData.day_06,
      planData.day_07,
      planData.day_08,
      planData.day_09,
      planData.day_10,
      planData.day_11,
      planData.day_12,
      planData.day_13,
      planData.day_14,
      planData.day_15,
      planData.day_16,
      planData.day_17,
      planData.day_18,
      planData.day_19,
      planData.day_20,
      planData.day_21,
      planData.day_22,
      planData.day_23,
      planData.day_24,
      planData.day_25,
      planData.day_26,
      planData.day_27,
      planData.day_28,
      planData.day_29,
      planData.day_30,
      planData.day_31,
      planData.monthly_days,
      planData.total_days,
      planData.holiday_days,
      planData.compensatory_days,
      planData.total_work_days,
      planData.annual_leave_days,
      planData.absent_days,
      planData.support_days,
      planData.etc_days,
      planData.attendance_days,
      planData.notes,
      id
    );

    if (result.changes === 0) {
      return { success: false, error: "해당 계획을 찾을 수 없습니다." };
    }

    // 수정된 데이터 조회해서 반환
    const updatedPlan = db
      .prepare(
        `
      SELECT mp.*, e.name as employee_name, e.position 
      FROM monthly_work_plans mp
      JOIN employees e ON mp.emp_code = e.emp_code
      WHERE mp.id = ?
    `
      )
      .get(id);

    return { success: true, data: updatedPlan };
  } catch (error) {
    console.error("월 근무계획 수정 실패:", error);
    return { success: false, error: error.message };
  }
});

// 월 근무계획 삭제
ipcMain.handle("monthly-plans:delete", async (event, id) => {
  try {
    const db = getDatabase();
    const stmt = db.prepare("DELETE FROM monthly_work_plans WHERE id = ?");
    const result = stmt.run(id);

    if (result.changes === 0) {
      return { success: false, error: "해당 계획을 찾을 수 없습니다." };
    }

    return { success: true, data: null };
  } catch (error) {
    console.error("월 근무계획 삭제 실패:", error);
    return { success: false, error: error.message };
  }
});

// 엑셀 내보내기 (나중에 구현 예정)
ipcMain.handle("monthly-plans:export-to-excel", async (event, year, month) => {
  try {
    // TODO: 엑셀 내보내기 구현
    return {
      success: false,
      error: "엑셀 내보내기 기능은 아직 구현되지 않았습니다.",
    };
  } catch (error) {
    console.error("엑셀 내보내기 실패:", error);
    return { success: false, error: error.message };
  }
});

// 월의 일수 계산 (유틸리티 - 기존 유지)
ipcMain.handle(
  "monthly-plans:get-days-in-month",
  async (event, year, month) => {
    try {
      const daysInMonth = new Date(year, month, 0).getDate();
      const firstDay = new Date(year, month - 1, 1).getDay();

      return {
        success: true,
        data: {
          daysInMonth,
          firstDay,
          days: Array.from({ length: daysInMonth }, (_, i) => i + 1),
        },
      };
    } catch (error) {
      console.error("월 일수 계산 실패:", error);
      return { success: false, error: error.message };
    }
  }
);

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
