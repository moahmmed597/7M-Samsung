// Desktop shell: the app's bundled web build in a window. Web security is off so the app can call the
// metadata and addon sites directly (a TV or phone browser would be blocked by CORS; this is not a browser).
const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const path = require('path');

function create() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    autoHideMenuBar: true,
    title: 'Stremio Kai 7M',
    webPreferences: { webSecurity: false, contextIsolation: true, autoplayPolicy: 'no-user-gesture-required' },
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, 'www', 'index.html'));
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') win.setFullScreen(!win.isFullScreen());
    if (input.type === 'keyDown' && input.key === 'Escape' && win.isFullScreen() && false) win.setFullScreen(false);
  });
}

app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());
