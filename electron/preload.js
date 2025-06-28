import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // 🧪 테스트용 API
  testDbConnection: () => ipcRenderer.invoke("test:db-connection"),
  getEmployees: () => ipcRenderer.invoke("test:get-employees"),

  // 향후 추가될 API들
  createEmployee: (data) => ipcRenderer.invoke("db:create-employee", data),
  exportExcel: (type, data) => ipcRenderer.invoke("export:excel", type, data),
  selectFolder: () => ipcRenderer.invoke("dialog:select-folder"),
});
