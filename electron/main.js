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

// 🎯 테스트용 IPC 핸들러
ipcMain.handle("test:db-connection", async () => {
  console.log("🔍 DB 연결 테스트 요청 받음");
  try {
    const db = getDatabase();
    const employees = db.prepare("SELECT * FROM employees").all();
    console.log("✅ 직원 조회 성공:", employees.length);
    return { success: true, count: employees.length, employees };
  } catch (error) {
    console.error("❌ DB 테스트 실패:", error);
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
