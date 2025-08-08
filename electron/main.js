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
      INSERT INTO employees (emp_code, name, position, department, hire_date, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      employee.emp_code,
      employee.name,
      employee.position,
      employee.department,
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
      SET emp_code = ?, name = ?, position = ?, department = ?, hire_date = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = stmt.run(
      employee.emp_code,
      employee.name,
      employee.position,
      employee.department,
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

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
