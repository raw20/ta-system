const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getEmployees: () => ipcRenderer.invoke("db:get-employees"),
  createEmployee: (data) => ipcRenderer.invoke("db:create-employee", data),
  exportExcel: (type, data) => ipcRenderer.invoke("export:excel", type, data),
  selectFolder: () => ipcRenderer.invoke("dialog:select-folder"),
});
