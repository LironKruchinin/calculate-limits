const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
  
// Function to create independent window or main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 760,
    // Make sure to add webPreferences with
    // nodeIntegration and contextIsolation
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false,
  });
  
  // Main window loads index.html file
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  
  // To maximize the window
  mainWindow.maximize();
  mainWindow.show();
}
  
// Function to create child window of parent one
function createChildWindow() {
  childWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    modal: true,
    show: false,
    parent: mainWindow, // Make sure to add parent window here
  
    // Make sure to add webPreferences with below configuration
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  
  // Child window loads settings.html file
  childWindow.loadFile(path.join(__dirname, 'graph.html'));
  
  childWindow.once("ready-to-show", () => {
    childWindow.show();
  });
}
  
ipcMain.on("openChildWindow", (event, arg) => {
  createChildWindow();
});
  
app.whenReady().then(() => {
  createWindow();
  
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
  
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});