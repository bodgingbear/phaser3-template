const { app, BrowserWindow } = require('electron');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "My Game",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile('public/index.html');
}

app.on('ready', createWindow);
