const { contextBridge, ipcRenderer } = require("electron");

console.log("🔍 Preload script 시작");

try {
  contextBridge.exposeInMainWorld("electronAPI", {
    // 기존 테스트 API
    testDbConnection: () => {
      console.log("🔍 testDbConnection 호출됨");
      return ipcRenderer.invoke("test:db-connection");
    },

    // 🎯 직원 관리 API 추가
    employees: {
      getAll: () => {
        console.log("🔍 employees.getAll 호출됨");
        return ipcRenderer.invoke("employees:get-all");
      },
      getById: (id) => ipcRenderer.invoke("employees:get-by-id", id),
      create: (employee) => ipcRenderer.invoke("employees:create", employee),
      update: (id, employee) =>
        ipcRenderer.invoke("employees:update", id, employee),
      delete: (id) => ipcRenderer.invoke("employees:delete", id),
    },
    // 🎯 월 근무계획 API 추가
    monthlyPlans: {
      getAll: () => ipcRenderer.invoke("monthly-plans:get-all"),
      getByMonth: (year, month) =>
        ipcRenderer.invoke("monthly-plans:get-by-month", year, month),
      getByEmployee: (empCode, year, month) =>
        ipcRenderer.invoke(
          "monthly-plans:get-by-employee",
          empCode,
          year,
          month
        ),
      create: (plan) => ipcRenderer.invoke("monthly-plans:create", plan),
      update: (id, plan) =>
        ipcRenderer.invoke("monthly-plans:update", id, plan),
      delete: (id) => ipcRenderer.invoke("monthly-plans:delete", id),
      exportToExcel: (year, month) =>
        ipcRenderer.invoke("monthly-plans:export-to-excel", year, month),

      // 유틸리티 (기존 유지)
      getDaysInMonth: (year, month) =>
        ipcRenderer.invoke("monthly-plans:get-days-in-month", year, month),
    },

    // 향후 추가될 API들
    exportExcel: (type, data) => ipcRenderer.invoke("export:excel", type, data),
    selectFolder: () => ipcRenderer.invoke("dialog:select-folder"),

    // 향후 추가될 API들
    exportExcel: (type, data) => ipcRenderer.invoke("export:excel", type, data),
    selectFolder: () => ipcRenderer.invoke("dialog:select-folder"),
  });

  console.log("✅ electronAPI 노출 성공");
  console.log(
    "🔍 employees API:",
    typeof window !== "undefined" ? "window 객체 존재" : "window 객체 없음"
  );
} catch (error) {
  console.error("❌ electronAPI 노출 실패:", error);
}
