// Desktop shell of Stremio Kai 7M. One program, three modes:
//  - Setup (the downloaded "Stremio-Kai-7M-Setup-x.exe", a portable build): a dark installer window that
//    downloads the app from this release on GitHub, installs it for the current user (no admin rights),
//    makes the shortcuts the user picked and registers it in "Apps & features".
//  - Uninstall ("Stremio Kai 7M.exe --uninstall", what Windows runs from Apps & features).
//  - App: the bundled web build in a window. Web security is off so the app can call the metadata and
//    add-on sites directly (in a browser CORS would block them; this is not a browser).
const { app, BrowserWindow, Menu, ipcMain, shell, net, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const cp = require('child_process');

const REPO = 'moahmmed597/Stremio-Kai-7M';
const NAME = 'Stremio Kai 7M';
const EXE = NAME + '.exe';
const REG = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\StremioKai7M';
const VERSION = app.getVersion();

const isUninstall = process.argv.indexOf('--uninstall') >= 0;
const isSetup = !isUninstall && !!process.env.PORTABLE_EXECUTABLE_FILE;

const defaultDir = () => path.join(process.env.LOCALAPPDATA || os.homedir(), 'Programs', NAME);
const startMenuLink = () => path.join(process.env.APPDATA || os.homedir(), 'Microsoft', 'Windows', 'Start Menu', 'Programs', NAME + '.lnk');
const desktopLink = () => path.join(app.getPath('desktop'), NAME + '.lnk');

function reg(args) {
  try {
    cp.execFileSync('reg', args, { windowsHide: true, stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}
function regRead(name) {
  try {
    const out = cp.execFileSync('reg', ['query', REG, '/v', name], { windowsHide: true, encoding: 'utf8' });
    const m = out.match(new RegExp(name + '\\s+REG_\\w+\\s+(.*)'));
    return m ? m[1].trim() : '';
  } catch (e) {
    return '';
  }
}

// ---------------- App ----------------
function startApp() {
  const win = new BrowserWindow({
    width: 1440,
    height: 810,
    minWidth: 960,
    minHeight: 540,
    backgroundColor: '#0a0a0c',
    autoHideMenuBar: true,
    title: NAME,
    icon: path.join(__dirname, 'logo.png'),
    webPreferences: { webSecurity: false, contextIsolation: true, autoplayPolicy: 'no-user-gesture-required' },
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, 'www', 'index.html'));
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') win.setFullScreen(!win.isFullScreen());
  });
  // First start after the installer: open the app in the language picked there.
  try {
    const conf = JSON.parse(fs.readFileSync(path.join(path.dirname(process.execPath), 'install.json'), 'utf8'));
    if (conf.language && !conf.applied) {
      win.webContents.once('did-finish-load', () => {
        win.webContents
          .executeJavaScript(
            '(function(){try{var d=JSON.parse(localStorage.getItem("kai.device")||"{}");if(!d.language){d.language=' +
              JSON.stringify(conf.language) +
              ';localStorage.setItem("kai.device",JSON.stringify(d));location.reload();}}catch(e){}})()'
          )
          .catch(() => {});
        conf.applied = true;
        try {
          fs.writeFileSync(path.join(path.dirname(process.execPath), 'install.json'), JSON.stringify(conf));
        } catch (e) {}
      });
    }
  } catch (e) {}
}

// ---------------- Uninstall ----------------
async function uninstall() {
  const dir = path.dirname(process.execPath);
  const res = await dialog.showMessageBox({
    type: 'question',
    buttons: ['Uninstall', 'Cancel'],
    defaultId: 1,
    cancelId: 1,
    title: NAME,
    message: 'Remove ' + NAME + ' from this PC?',
    detail: 'Your library and settings on your Stremio account are not affected.',
    checkboxLabel: 'Also delete the app data on this PC',
  });
  if (res.response !== 0) return app.quit();
  if (res.checkboxChecked) {
    try {
      fs.rmSync(app.getPath('userData'), { recursive: true, force: true });
    } catch (e) {}
  }
  [desktopLink(), startMenuLink()].forEach((f) => {
    try {
      fs.unlinkSync(f);
    } catch (e) {}
  });
  app.setLoginItemSettings({ openAtLogin: false, path: process.execPath });
  reg(['delete', REG, '/f']);
  // The folder is removed after this process has exited.
  cp.spawn('cmd.exe', ['/c', 'ping 127.0.0.1 -n 3 >nul & rmdir /s /q "' + dir + '"'], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
  app.quit();
}

// ---------------- Setup ----------------
function startSetup() {
  const win = new BrowserWindow({
    width: 1120,
    height: 720,
    resizable: false,
    frame: false,
    backgroundColor: '#0b0b0e',
    title: NAME + ' Setup',
    icon: path.join(__dirname, 'logo.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true },
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, 'installer.html'));
  const send = (ch, data) => !win.isDestroyed() && win.webContents.send(ch, data);

  ipcMain.handle('setup:info', async () => {
    const dir = regRead('InstallLocation');
    const ver = regRead('DisplayVersion');
    let license = '';
    try {
      license = fs.readFileSync(path.join(__dirname, 'license.txt'), 'utf8');
    } catch (e) {}
    return { version: VERSION, defaultDir: defaultDir(), installed: dir && fs.existsSync(path.join(dir, EXE)) ? { dir: dir, version: ver } : null, license: license, repo: REPO };
  });
  ipcMain.handle('setup:notes', async () => {
    try {
      const r = await net.fetch('https://api.github.com/repos/' + REPO + '/releases/tags/app-v' + VERSION, { headers: { 'User-Agent': 'stremio-kai-setup' } });
      const j = await r.json();
      return String(j.body || '');
    } catch (e) {
      return '';
    }
  });
  ipcMain.handle('setup:size', async () => {
    try {
      const r = await net.fetch('https://api.github.com/repos/' + REPO + '/releases/tags/app-v' + VERSION, { headers: { 'User-Agent': 'stremio-kai-setup' } });
      const j = await r.json();
      const a = (j.assets || []).find((x) => /win-x64\.zip$/.test(x.name));
      return a ? a.size : 0;
    } catch (e) {
      return 0;
    }
  });
  ipcMain.handle('setup:pickDir', async (e, cur) => {
    const r = await dialog.showOpenDialog(win, { defaultPath: cur, properties: ['openDirectory', 'createDirectory'] });
    if (r.canceled || !r.filePaths[0]) return cur;
    const p = r.filePaths[0];
    return path.basename(p) === NAME ? p : path.join(p, NAME);
  });
  ipcMain.on('setup:window', (e, what) => (what === 'min' ? win.minimize() : app.quit()));
  ipcMain.on('setup:open', (e, url) => /^https:\/\//.test(url) && shell.openExternal(url));
  ipcMain.on('setup:launch', (e, dir) => {
    cp.spawn(path.join(dir, EXE), [], { detached: true, stdio: 'ignore', cwd: dir }).unref();
    app.quit();
  });

  ipcMain.handle('setup:install', async (e, o) => {
    const dir = o.dir || defaultDir();
    const tmp = path.join(os.tmpdir(), 'kai7m-' + Date.now() + '.zip');
    const step = (n, text, pct) => send('setup:progress', { step: n, text: text, pct: pct });
    try {
      // 1. Download the app of this release.
      step(1, 'download', 0);
      const url = 'https://github.com/' + REPO + '/releases/download/app-v' + VERSION + '/Stremio-Kai-7M-' + VERSION + '-win-x64.zip';
      const res = await net.fetch(url);
      if (!res.ok) throw new Error('Download failed (HTTP ' + res.status + ')');
      const total = Number(res.headers.get('content-length')) || 0;
      const out = fs.createWriteStream(tmp);
      const reader = res.body.getReader();
      let got = 0;
      for (;;) {
        const r = await reader.read();
        if (r.done) break;
        got += r.value.length;
        if (!out.write(Buffer.from(r.value))) await new Promise((ok) => out.once('drain', ok));
        if (total) step(1, 'download', Math.round((got / total) * 100));
      }
      await new Promise((ok, bad) => out.end((err) => (err ? bad(err) : ok())));
      // 2. Clean install: remove the app data of this PC.
      if (o.clean) {
        step(2, 'clean', 0);
        try {
          fs.rmSync(path.join(process.env.APPDATA || '', NAME), { recursive: true, force: true });
        } catch (er) {}
      }
      // 3. Unpack into the folder (old files replaced).
      step(3, 'unpack', 0);
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch (er) {
        throw new Error('Close ' + NAME + ' and try again (its files are in use).');
      }
      fs.mkdirSync(dir, { recursive: true });
      await new Promise((ok, bad) => {
        const p = cp.spawn('tar', ['-xf', tmp, '-C', dir], { windowsHide: true });
        p.on('error', bad);
        p.on('exit', (code) => (code === 0 ? ok() : bad(new Error('Unpack failed (' + code + ')'))));
      });
      try {
        fs.unlinkSync(tmp);
      } catch (er) {}
      const exe = path.join(dir, EXE);
      if (!fs.existsSync(exe)) throw new Error('The download did not contain the app.');
      fs.writeFileSync(path.join(dir, 'install.json'), JSON.stringify({ language: o.language || 'en', version: VERSION }));
      // 4. Shortcuts, start with Windows, Apps & features entry.
      step(4, 'shortcuts', 0);
      const link = { target: exe, cwd: dir, icon: exe, iconIndex: 0, description: NAME };
      try {
        fs.unlinkSync(desktopLink());
      } catch (er) {}
      try {
        fs.unlinkSync(startMenuLink());
      } catch (er) {}
      if (o.desktop) shell.writeShortcutLink(desktopLink(), 'create', link);
      if (o.startMenu) shell.writeShortcutLink(startMenuLink(), 'create', link);
      app.setLoginItemSettings({ openAtLogin: !!o.startup, path: exe, name: NAME });
      let size = 0;
      try {
        size = Math.round(Number(cp.execFileSync('powershell', ['-NoProfile', '-Command', "(Get-ChildItem -Recurse -File '" + dir.replace(/'/g, "''") + "' | Measure-Object Length -Sum).Sum"], { encoding: 'utf8', windowsHide: true })) / 1024);
      } catch (er) {}
      const add = (name, type, data) => reg(['add', REG, '/v', name, '/t', type, '/d', data, '/f']);
      add('DisplayName', 'REG_SZ', NAME);
      add('DisplayVersion', 'REG_SZ', VERSION);
      add('Publisher', 'REG_SZ', 'moahmmed597');
      add('DisplayIcon', 'REG_SZ', exe);
      add('InstallLocation', 'REG_SZ', dir);
      add('UninstallString', 'REG_SZ', '"' + exe + '" --uninstall');
      add('URLInfoAbout', 'REG_SZ', 'https://github.com/' + REPO);
      add('NoModify', 'REG_DWORD', '1');
      add('NoRepair', 'REG_DWORD', '1');
      if (size) add('EstimatedSize', 'REG_DWORD', String(size));
      step(5, 'done', 100);
      return { ok: true, dir: dir, size: size };
    } catch (err) {
      try {
        fs.unlinkSync(tmp);
      } catch (er) {}
      return { ok: false, error: String((err && err.message) || err) };
    }
  });
}

if (isSetup) app.setPath('userData', path.join(os.tmpdir(), 'kai7m-setup')); // never touch the app's own data
app.whenReady().then(() => (isUninstall ? uninstall() : isSetup ? startSetup() : startApp()));
app.on('window-all-closed', () => app.quit());
