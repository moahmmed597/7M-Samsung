// Bridge between the installer page and the setup process (nothing else is exposed).
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('setup', {
  info: () => ipcRenderer.invoke('setup:info'),
  notes: () => ipcRenderer.invoke('setup:notes'),
  size: () => ipcRenderer.invoke('setup:size'),
  pickDir: (cur) => ipcRenderer.invoke('setup:pickDir', cur),
  install: (opts) => ipcRenderer.invoke('setup:install', opts),
  onProgress: (fn) => ipcRenderer.on('setup:progress', (e, d) => fn(d)),
  launch: (dir) => ipcRenderer.send('setup:launch', dir),
  open: (url) => ipcRenderer.send('setup:open', url),
  window: (what) => ipcRenderer.send('setup:window', what),
});
